import connect from "./connection.mjs";

async function getStudentProfileParams(studentID){
    let client
    try {
        const sql = `SELECT email, phoneNumber, firstName, lastName ,profilepicture
                     FROM "USER" join student on userID=studentID WHERE userID = $1`;

        client = await connect();
        const res = await client.query(sql, [studentID]);
        return res.rows[0]
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function updateStudentInfo(updateValueName,updateValue,userID){
    let client
    try {
        const sql = `update "USER" set ${updateValueName}=$1 where userID=$2`;

        client = await connect();
        const res = await client.query(sql, [updateValue,userID]);

        return res.rows[0]
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
    
}

async function addLessonToCart(studentId,lessonIDs,participants,selectedLevel){
    let client
    try {
        const sql = `   INSERT INTO cart (studentId, lessonId,participants,lowestLevel)
                        SELECT $1, unnest($2::int[]), $3, $4
                        ON CONFLICT (studentId, lessonId) DO NOTHING
                        RETURNING *;`;

        client = await connect();
        const res = await client.query(sql, [studentId,lessonIDs,participants,selectedLevel]);

        const insertedLessons= res.rowCount

        return insertedLessons

    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

// pare ta mathimata pou den tha eprepe na einai sto kalathi
// afairese auta ta mathimata apo to kalathi
// pare ta mathimata pou einai sto kalathi

async function getTakenLessonsInCart(studentID){
    let client
    try {
        const sql =`WITH LESSON_PARTICIPANTS AS(
                        SELECT l.lessonid, sum(participantNumber) as existingParticipants
                        FROM LESSON l LEFT JOIN ( RESERVATION_LESSON natural join reservation) r on l.lessonID= r.lessonID
                        where r.canceled=false or r.canceled is null
                        GROUP BY l.lessonid
                    )
                    
                    select lessonID
                    from (teaching natural join lesson natural join cart natural join LESSON_PARTICIPANTS)
                    where ( lesson.canceled=true or (existingParticipants is not null and lessonType='private')
                            or lesson.date < (SELECT TO_CHAR(CURRENT_DATE, 'YYYY/MM/DD'))
                            or (maxParticipants- COALESCE (existingParticipants,0) ) < cart.participants ) and studentID=$1`;

        client = await connect();
        const res = await client.query(sql, [studentID]);
        return res.rows.map(row => row.lessonid)
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function checkForLessonClasses(reservationId){
    let client
    try {
        // PREVIOUS_LESSON_PARTICIPANTS are the reservations made before current reservation, for the lessons reserved by current reservation

        const sql =`WITH PREVIOUS_LESSON_PARTICIPANTS AS(
                        SELECT l.lessonid, sum(participantNumber) as existingParticipants
                        FROM LESSON l JOIN ( RESERVATION_LESSON natural join reservation) r on l.lessonID= r.lessonID
                        where r.canceled=false and reservationID<$1 and l.lessonid in (select lessonID from RESERVATION_LESSON where reservationID=$1)
                        GROUP BY l.lessonid
                    )
                    select count(*) as existingClasses
                    from (teaching natural join lesson natural left join PREVIOUS_LESSON_PARTICIPANTS) l
                    where  l.lessonid in (select lessonID from RESERVATION_LESSON where reservationID=$1) and ( l.canceled=true or (existingParticipants is not null and lessonType='private')
                        or (maxParticipants- COALESCE (existingParticipants,0) ) <  (select participantNumber
                                                                                    from reservation_lesson r
                                                                                    where r.lessonID=l.lessonID and r.reservationID=$1) )`;

        client = await connect();
        const res = await client.query(sql, [reservationId]);
        return res.rows[0]?.existingclasses ?? 0;
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function deleteReservation(reservationID){
    let client
    // reservation_lesson deletes automatically (cascade)
    try {
        const sql =`delete from reservation where reservationID=$1`;

        client = await connect();
        const res = await client.query(sql, [reservationID]);
        return
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function clearCart(studentId){
    let client

    try {
        const sql =`delete from cart where studentId=$1`;

        client = await connect();
        const res = await client.query(sql, [studentId]);
        return
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function getLessonsInCart(studentId){
    let client
    try {
        const sql =`WITH REVIEWS_INSTRUCTOR AS(
                        SELECT AVG(reviewStars)::NUMERIC(3,1) as "reviewScore",instructorID, count(CASE WHEN reviewStars IS NOT NULL THEN 1 END) AS "reviewCount"
                        from  teaching natural join lesson natural left outer join (review_lesson natural join review)
                        group by instructorID
                    ),
                    INSTRUCTOR_TEACHING_INFO AS(
                        select instructorID,meetingPointID,teachingID as "instructionID",(firstName || ' '|| SUBSTRING(lastName,1,1)||'.') as "instructorName", yearsOfExperience as experience,languages,
                        profilepicture as image,instructorID as "instructorId","reviewScore","reviewCount", cancelationPolicy ,costPerHour as "costPerHour", 
                        lessonType as "typeOfLesson",resort,sport,groupName as "groupName", timeStart as "timeStart", timeEnd as "timeEnd",
                        locationText as "locationText",picture, isAllDay as "isAllDay"
                        from "USER"  join instructor on userID=instructorID natural join teaching natural left join meetingpoint natural left join reviews_instructor
                    )
                    select *,lowestlevel as "level" , lessonid as "lessonID"
                    from (cart natural join lesson) e join INSTRUCTOR_TEACHING_INFO i on e.teachingID= i."instructionID"
                    where e.canceled=false and studentid=$1`;

        client = await connect();
        const res = await client.query(sql, [studentId]);

        return res.rows
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function removeLessonsFromCart(studentId,lessonIDS){
    let client
    try {
        const sql = `   DELETE FROM cart
                        WHERE lessonId = ANY($2) and studentID=$1
                        RETURNING *`;

        client = await connect();
        const res = await client.query(sql, [studentId,lessonIDS]);

        const removedLessons= res.rowCount


        return removedLessons

    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function getCostOfLessonsInCart(studentId){
    let client
    try {
        const sql = `SELECT 
                        SUM(
                            ROUND(
                                (EXTRACT(EPOCH FROM (timeEnd::time - timeStart::time)) / 3600) * costPerHour)
                            ) AS paymentAmount
                    from cart natural join lesson natural join teaching
                    where studentid=$1
                    group by studentid`;

        client = await connect();
        const res = await client.query(sql, [studentId]);

        return res.rows[0]?.paymentamount ?? 0;

    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function createNewReservation(studentId){
    let client
    try {
        const sql = `insert into reservation values (default,TO_CHAR(CURRENT_DATE, 'YYYY/MM/DD'),$1) returning reservationID`;

        client = await connect();
        const res = await client.query(sql, [studentId]);

        return res.rows[0].reservationid

    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function insertReservationLesson(reservationID,studentID){
    let client
    try{
        const sql = `insert into reservation_lesson(reservationID,lessonID,canceled,participantNumber,lowestLevel)
                     select $1, lessonID,canceled, participants,lowestLevel
                     from cart natural join lesson
                     where studentID=$2      
                     returning reservLesID`
        client = await connect();
        const res = await client.query(sql, [reservationID,studentID]);

        return res.rows.map(item => item.reservlesid);

    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
    
}

async function insertPayment(amount,reservationID){
    let client
    try{
        const sql = `insert into payment(amount,paymentDate,reservationID)
                     select $1, (SELECT TO_CHAR(CURRENT_DATE, 'YYYY/MM/DD') ) ,$2`
        client = await connect();
        const res = await client.query(sql, [amount,reservationID]);

    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function getUpComingStudentLessons(studentId){
    let client
    try{
        const sql = `WITH REVIEWS_INSTRUCTOR AS(
                    SELECT AVG(reviewStars)::NUMERIC(3,1) as "reviewScore",instructorID, count(CASE WHEN reviewStars IS NOT NULL THEN 1 END) AS "reviewCount"
                    from  teaching natural join lesson natural left outer join (review_lesson natural join review)
                    group by instructorID
                ),
                INSTRUCTOR_TEACHING_INFO AS(
                    select instructorID,phoneNumber,meetingPointID,teachingID as "instructionID",(firstName || ' '|| SUBSTRING(lastName,1,1)||'.') as "instructorName", yearsOfExperience as experience,languages,
                    profilepicture as image,instructorID as "instructorId","reviewScore","reviewCount", cancelationPolicy ,costPerHour as "costPerHour", 
                    lessonType as "typeOfLesson",resort,sport,groupName as "groupName", timeStart as "timeStart", timeEnd as "timeEnd",
                    locationText as "locationText",picture, isAllDay as "isAllDay"
                    from "USER"  join instructor on userID=instructorID natural join teaching natural left join meetingpoint natural left join reviews_instructor
                )
                select *
                from ( (reservation natural join reservation_lesson) k1 join lesson k2 on k1.lessonID=k2.lessonID) e join INSTRUCTOR_TEACHING_INFO i on e.teachingID= i."instructionID"
                where  studentid=$1`
        client = await connect();
        const res = await client.query(sql, [studentId]);

        return res.rows

    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}


export {getStudentProfileParams,updateStudentInfo,addLessonToCart,getLessonsInCart,removeLessonsFromCart,getTakenLessonsInCart,getCostOfLessonsInCart,createNewReservation,insertReservationLesson,checkForLessonClasses,deleteReservation,
    clearCart,insertPayment,getUpComingStudentLessons}