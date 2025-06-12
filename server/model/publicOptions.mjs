import connect from "./connection.mjs";

async function insertUser(firstName,lastName,passwordHash,email,phone,accountType){
    try {
        let client
        const firstRowName= accountType=="student"?"studentID":"instructorID"

        let userID

        try {
            client = await connect();

            await client.query('BEGIN')
            const sql1 = `insert into "USER" values(default,$1,$2 ,$3 ,$4 ,default,$5) returning userID`;

            userID = (await client.query(sql1, [firstName,lastName,passwordHash,email,phone])).rows[0].userid

            const sql2 = `INSERT INTO ${accountType}( ${firstRowName}) VALUES ($1)`

            await client.query(sql2, [userID])
            await client.query('COMMIT')
        }
        catch (e) {
            await client.query('ROLLBACK')
            throw e
        }
        finally {
            // it always executes
            client.release()
        }


        return userID
    }
    catch (err) {
        throw err
    }
}

async function checkEmailAlreadyUsed(email){
    let client
    try {
        const sql = `SELECT * FROM "USER" WHERE email = $1`;
        client = await connect();
        const res = await client.query(sql, [email]);
        return res.rows.length > 0;
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function authenticate(email){
    //userExists,hashedPassword,accountType
    let client
    try {
        client = await connect();

        const sql1 = `select passwordHash,userID from "USER" join instructor on userID=instructorID
                      WHERE email = $1`;
        const res1 = await client.query(sql1, [email]);

        const sql2 = `select passwordHash,userID from "USER" join student on userID=studentID
                        WHERE email = $1`;
        const res2 = await client.query(sql2, [email]);


        const userExists= res1.rows.length>0 || res2.rows.length>0
        let accountType=""
        let hashedPassword=""
        let userID=""

        if(res1.rows.length>0 ){
            accountType='instructor'
            hashedPassword=res1.rows[0].passwordhash
            userID=res1.rows[0].userid

        }

        else if(res2.rows.length>0){
            accountType='student'
            hashedPassword=res2.rows[0].passwordhash
            userID=res2.rows[0].userid
        }

        return {userExists,hashedPassword,accountType,userID}

    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function getProfileImage(userID){
    let client
    try {
        const sql = `SELECT profilepicture
                     FROM "USER" WHERE userID = $1`;

        client = await connect();
        const res = await client.query(sql, [userID]);
        return res.rows[0]
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function getInstructorInfo(instructorId){
    let client
    try {
        const sql =`WITH REVIEWS_INSTRUCTOR AS(
                        SELECT count(reviewStars) as starScore,instructorID, count(*) AS total_reviews
                        from review natural join review_lesson natural join lesson natural join teaching
                        where instructorID=$1
                        group by instructorID
                     )
                    select (firstName || ' '|| SUBSTRING(lastName,1,1)||'.') as "instructorName", yearsOfExperience as "yearsOfExperience",resorts as "skiResorts",sports,languages,
                    cancelationPolicy,biographyNote as biography, email as "instructorEmail",profilepicture as "profilePicture",starScore,total_reviews
                    from "USER"  join instructor on userID=instructorID natural left join reviews_instructor
                    where instructorID=$1`;

        client = await connect();
        const res = await client.query(sql, [instructorId]);
        return res.rows[0]
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }


}


async function getUserEmail(userID){
    let client
    try {
        const sql = `SELECT email
                     FROM "USER" WHERE userID = $1`;

        client = await connect();
        const res = await client.query(sql, [userID]);
        return res.rows[0].email
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}


async function bookLesson(resort, sport, from, to, members,lessonType,time,orderBy,instructorName,pageNumber){
    // according to user filters, the available group lessons and instructors are retrieved

    let lessonTypeCheck=''
    let timeCheck=''
    let orderByClause=''

    if(lessonType=='private'){
        lessonTypeCheck= " lessonType='private' "
    }
    else if(lessonType=="group"){
        lessonTypeCheck= " lessonType='group' "

    }
    else{
        lessonTypeCheck= " lessonType='private' or lessonType='group' "

    }

    if(time=='allDay'){
        timeCheck="isAllDay=true"
    }
    else if(time=='morning'){
        timeCheck="timeStart<='12:00'"

    }
    else if(time=='noon'){
        timeCheck="timeStart>='12:00'"

    }
    else{
        timeCheck="TRUE"
    }

    if(orderBy=="Price Low to High"){
        orderByClause=' "minPricePerHour" asc'
    }
    else if(orderBy=='Price High to Low'){
        orderByClause= '"minPricePerHour" desc'

    }
    else if(orderBy=='Best reviews'){
        orderByClause=' "reviewScore" desc'

    }
    else{
        orderByClause=' "reviewScore" desc'

    }

    // console.log('aaa ',lessonTypeCheck,timeCheck,orderByClause)


    let client
    try {
        const sql = `
        WITH REVIEWS_INSTRUCTOR AS(
            SELECT AVG(reviewStars)::NUMERIC(3,1) as "reviewScore",instructorID, count(CASE WHEN reviewStars IS NOT NULL THEN 1 END) AS "reviewCount"
            from instructor natural join teaching natural join lesson natural left outer join (review_lesson natural join review)
            group by instructorID
         ),
        INSTRUCTOR_INFO AS(
            select teachingID,lessonType as "typeOfLesson" ,(firstName || ' '|| SUBSTRING(lastName,1,1)||'.') as "instructorName", yearsOfExperience as experience,languages,
            summaryInfo as description, profilepicture as image,instructorID as "instructorId","reviewScore","reviewCount"
            from "USER"  join instructor on userID=instructorID natural join teaching natural left join reviews_instructor
        ),
        TEACHING_OPTIONS AS(
            select teachingid, costPerHour, groupName as "groupName"
            from (teaching natural join lesson l) left join (select * from reservation_lesson e where e.canceled=false or e.canceled is null ) r  on l.lessonID=r.lessonID
            where l.canceled=false and ( ${lessonTypeCheck})
            and resort=$1 and sport=$2 and ${timeCheck} and l.date>=$3 and l.date<=$4
            group by l.lessonID, teachingid
            HAVING 
                CASE 
                    WHEN lessonType = 'group' 
                        THEN (maxParticipants - COALESCE(SUM(participantNumber), 0)) >= $5
                    WHEN lessonType = 'private' 
                        THEN ( SUM(participantNumber) IS NULL  and maxParticipants >= $5 )
                    ELSE false
                END
        )
        select i."typeOfLesson", i."instructorName",i."groupName",i."instructionID"::text,i.experience, i.languages,i.description,i.image,i."instructorId",i."reviewScore"::text,i."reviewCount", min(finalCostPerHour) as "minPricePerHour",  COUNT(*) OVER () AS "entries"
        from(
            SELECT  i."typeOfLesson",teach."groupName", i."instructorName",i.experience, i.languages,i.description,i.image,i."instructorId",i."reviewScore",i."reviewCount", CASE WHEN i."typeOfLesson" = 'group' THEN costPerHour * $5 ELSE costPerHour END AS finalCostPerHour
                , 
                   CASE 
                     WHEN i."typeOfLesson" = 'private' THEN NULL
                     ELSE i.teachingid
                   END AS "instructionID"
            from TEACHING_OPTIONS teach natural join  INSTRUCTOR_INFO i
            where i."instructorName" ILIKE  ($6 || '%')) i
        group by i."typeOfLesson", i."instructorName",i."groupName",i."instructionID",i.experience, i.languages,i.description,i.image,i."instructorId",i."reviewScore",i."reviewCount"
        order by ${orderByClause} NULLS LAST
        LIMIT 4
        OFFSET (4 * ($7 - 1))`;

        client = await connect();
        const res = await client.query(sql, [resort, sport,from,to,members,instructorName,pageNumber]);
        return res.rows
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function getDatesWithLessons(resort, sport, members){
    let client

    const membersFinal= members!=""?Number(members):0

    try {
        const sql =`select distinct l."date"
                    from (teaching natural join lesson l) left join (select * from reservation_lesson e where e.canceled=false) r  on l.lessonID=r.lessonID
                    where l.canceled=false and resort LIKE ( $1 || '%') and sport LIKE ($2 || '%') 
                    group by l.lessonID, l."date", lessonType, maxParticipants
                    HAVING 
                        CASE 
                            WHEN lessonType = 'group' 
                                THEN (maxParticipants - COALESCE(SUM(participantNumber), 0)) >= $3
                            WHEN lessonType = 'private' 
                                THEN ( SUM(participantNumber) IS NULL  and maxParticipants >= $3 )
                            ELSE false
                        END
                    order by l."date" `;

        client = await connect();
        const res = await client.query(sql, [resort, sport, membersFinal]);
        return res.rows
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function showLessons(resort,sport,from,to,members,instructorId,instructionID,typeOfLesson,time){
    
    let client

    // console.log("aaa!! ",resort,sport,from,to,members,typeOfLesson,instructorId,instructionID,time)

    let lessonTypeCheck=''
    let timeCheck=''
    let instructionIDCheck=''

    if(typeOfLesson=='private'){
        lessonTypeCheck= " lessonType='private' "
    }
    else if(typeOfLesson=="group"){
        lessonTypeCheck= " lessonType='group' "

    }
    else{
        lessonTypeCheck= " lessonType='private' or lessonType='group' "

    }

    if(time=='allDay'){
        timeCheck="isAllDay=true"
    }
    else if(time=='morning'){
        timeCheck="timeStart<='12:00'"

    }
    else if(time=='noon'){
        timeCheck="timeStart>='12:00'"

    }
    else{
        timeCheck="TRUE"
    }

    if(instructionID!=null){
        instructionIDCheck= `teachingID=${instructionID}`
    }
    else{
        instructionIDCheck='TRUE'
    }

    try {
        const sql =`WITH AVAILABLE_LESSONS AS(
                    select teachingid, l.lessonid, "date", isallday, costPerHour, timeStart, timeEnd
                    from (teaching natural join lesson l) left join (select * from reservation_lesson e where e.canceled=false or e.canceled is null ) r  on l.lessonID=r.lessonID
                    where l.canceled=false and ( ${lessonTypeCheck})
                    and resort=$1 and sport=$2 and ${timeCheck} and l.date>=$3 and l.date<=$4 and instructorId=$6 and (${instructionIDCheck})
                    group by l.lessonID, teachingid
                    HAVING 
                        CASE 
                            WHEN lessonType = 'group' 
                                THEN (maxParticipants - COALESCE(SUM(participantNumber), 0)) >= $5
                            WHEN lessonType = 'private' 
                                THEN ( SUM(participantNumber) IS NULL  and maxParticipants >= $5 )
                            ELSE false
                        END
                ),
                ALL_LESSONS AS(
                    select teachingid, l.lessonid, "date", isallday, costPerHour, timeStart, timeEnd
                    from teaching natural join lesson l
                    where l.canceled=false  and ( ${lessonTypeCheck})
                    and resort=$1 and sport=$2 and ${timeCheck} and l.date>=$3 and l.date<=$4 and instructorId=$6 and (${instructionIDCheck}) and maxParticipants >=$5
                )
                select  json_agg(
                        json_build_object(
                            'teachingID',teachingid::text,
                            'lessonID',lessonid::text,
                            'date',"date",
                            'isAllDay',isallday,
                            'cost',costPerHour::text,
                            'timeStart',timeStart, 
                            'timeEnd',timeEnd,
                            'full', lessonid not in ( select lessonid from AVAILABLE_LESSONS)
                        )
                        ORDER BY timeStart
                    ) AS lessons
                FROM ALL_LESSONS
                GROUP BY "date" `;

        client = await connect();
        const res = await client.query(sql, [resort,sport,from,to,members,instructorId]);

        

        // console.log(res.rows.map(row=> row.lessons));
        // console.log("\n\n\n")
        return res.rows.map(row=> row.lessons)
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }

}

async function getLessonsMeetingPoints(uniqueTeachingIDs){
    let client
    try{
        client = await connect();

        const sql=` select teachingID::text, meetingPointID,locationText as "location", picture
                    from teaching natural left join meetingPoint
                    where teachingID::text = ANY ($1);` 
        
        const result=await  client.query(sql, [uniqueTeachingIDs])
        return result.rows
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    }
}

async function getBookLessonReviwes(resort, sport, from, to, members){
    // according to user filters, the available group lessons and instructors are retrieved


    let client
    try {
        const sql = `
                WITH INSTRUCTOR_INFO AS(
                    select	instructorid,teachingid, (firstName || ' ' || SUBSTRING(lastName FROM 1 FOR 1) || '.') as "instructorName"
                    from "USER" u join instructor i on u.userid=i.instructorid natural join teaching
                ),
                TEACHING_OPTIONS AS(
                    select distinct teachingID
                    from (teaching natural join lesson l) left join (select * from reservation_lesson e where e.canceled=false or e.canceled is null ) r  on l.lessonID=r.lessonID
                    where l.canceled=false 
                    and resort=$1 and sport=$2  and l.date>=$3 and l.date<=$4
                    GROUP BY TEACHINGID
                    HAVING 
                        CASE 
                            WHEN lessonType = 'group' 
                                THEN (maxParticipants - COALESCE(SUM(participantNumber), 0)) >= $5
                            WHEN lessonType = 'private' 
                                THEN ( SUM(participantNumber) IS NULL  and maxParticipants >= $5 )
                            ELSE false
                        END
                ),
                all_review_lessons as (
                    select distinct reservID,"date",sport,resort,reviewText as review,reviewStars as stars,timeStart,timeEnd ,"instructorName", (i.firstName || ' ' || SUBSTRING(i.lastName FROM 1 FOR 1) || '.') as "name", i.profilePicture
                    from (teaching natural join lesson join (review_lesson natural join review join "USER" u  on u.userid=review.studentid)
                            on lesson.lessonid= review_lesson.lessonid ) i join instructor_info inf on i.instructorid=inf.instructorid
                    where inf.instructorID in (select instructorid from INSTRUCTOR_INFO natural join TEACHING_OPTIONS))
                select * from all_review_lessons
                order by ((case when review is not null then 1000 else 0 end)+stars) desc
                limit 360`;

        client = await connect();
        const res = await client.query(sql, [resort, sport,from,to,members]);
        return res.rows
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function getIndexReviews(){

    let client
    try{
        client = await connect();

        const sql=` with instructor_info as (
                    select	instructorid, (firstName || ' ' || SUBSTRING(lastName FROM 1 FOR 1) || '.') as "instructorName"
                    from "USER" u join instructor i on u.userid=i.instructorid
                    
                ),
                all_review_lessons as (
                select reservID,"date",sport,resort,reviewText as review,reviewStars as stars,timeStart,timeEnd ,"instructorName", (i.firstName || ' ' || SUBSTRING(i.lastName FROM 1 FOR 1) || '.') as "name", i.profilePicture
                from (teaching natural join lesson join (review_lesson natural join review join "USER" u  on u.userid=review.studentid)
                        on lesson.lessonid= review_lesson.lessonid ) i join instructor_info inf on i.instructorid=inf.instructorid
                where reviewText is not null)
                select * from all_review_lessons
                order by stars desc
                limit 12` 
        
        const result=await  client.query(sql, [])
        return result.rows
 
    } catch (err) {
        console.error(err)
        return []
    } finally {
        client.release();

    }
}

async function getInstructorReviews(instructorID){
    let client
    try{
        client = await connect();

        const sql=` with instructor_info as (
                    select	instructorid, (firstName || ' ' || SUBSTRING(lastName FROM 1 FOR 1) || '.') as "instructorName"
                    from "USER" u join instructor i on u.userid=i.instructorid and instructorid=$1
                    
                ),
                all_review_lessons as (
                select reservID,"date",sport,resort,reviewText as review,reviewStars as stars,timeStart,timeEnd ,"instructorName", (i.firstName || ' ' || SUBSTRING(i.lastName FROM 1 FOR 1) || '.') as "name", i.profilePicture
                from (teaching natural join lesson join (review_lesson natural join review join "USER" u  on u.userid=review.studentid)
                        on lesson.lessonid= review_lesson.lessonid ) i join instructor_info inf on i.instructorid=inf.instructorid
                where inf.instructorID=$1)
                select * from all_review_lessons
                order by ((case when review is not null then 1000 else 0 end)+stars) desc
                limit 360	` 
        
        const result=await  client.query(sql, [instructorID])
        return result.rows
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    }
}


// WITH AVAILABLE_LESSONS AS(
// 	select teachingid, l.lessonid, "date", isallday, costPerHour, timeStart, timeEnd
// 	from (teaching natural join lesson l) left join (reservation_lesson r natural join reservation) on l.lessonID=r.lessonID
// 	where l.canceled=false and (r.canceled=false or r.canceled is null) and (lessonType='private' or lessonType='group')
// 	and resort='Vasilitsas' and sport='Ski' and timeStart<='15:00' and l.date>='2025/05/29' and l.date<='2025/06/13' and instructorId=4
// 	group by l.lessonID, teachingid
// 	HAVING 
// 	    CASE 
// 	        WHEN lessonType = 'group' 
// 	            THEN (maxParticipants - COALESCE(SUM(participantNumber), 0)) >= 2
// 	        WHEN lessonType = 'private' 
//                 THEN ( SUM(participantNumber) IS NULL  and maxParticipants >= 2 )
// 	        ELSE false
// 	    END
// ),
// ALL_LESSONS AS(
// 	select teachingid, l.lessonid, "date", isallday, costPerHour, timeStart, timeEnd
// 	from (teaching natural join lesson l) left join (reservation_lesson r natural join reservation) on l.lessonID=r.lessonID
// 	where l.canceled=false and (r.canceled=false or r.canceled is null) and (lessonType='private' or lessonType='group')
// 	and resort='Vasilitsas' and sport='Ski' and timeStart<='15:00' and l.date>='2025/05/29' and l.date<='2025/06/13' and instructorId=4
// 	group by l.lessonID, teachingid
// )
// select  json_agg(
// 		json_build_object(
// 			'teachingid',teachingid,
// 			'lessonid',lessonid,
// 			'date',"date",
// 			'isallday',isallday,
// 			'costPerHour',costPerHour,
// 			'timeStart',timeStart, 
// 			'timeEnd',timeEnd,
// 			'full', lessonid not in ( select lessonid from AVAILABLE_LESSONS)
// 		)
// 		ORDER BY timeStart
// 	) AS lessons
// FROM ALL_LESSONS
// GROUP BY "date"




// WITH REVIEWS_INSTRUCTOR AS(
// 	SELECT AVG(reviewStars)::NUMERIC(3,1) as "reviewScore",instructorID, count(CASE WHEN reviewStars IS NOT NULL THEN 1 END) AS "reviewCount"
// 	from instructor natural join teaching natural join lesson natural left outer join (review_lesson natural join review)
// 	group by instructorID
//  ),
// INSTRUCTOR_INFO AS(
// select teachingID,lessonType as "typeOfLesson" ,(firstName || ' '|| SUBSTRING(lastName,1,1)||'.') as "instructorName", yearsOfExperience as experience,languages,
// summaryInfo as description, profilepicture as image,instructorID as "instructorId","reviewScore","reviewCount"
// from "USER"  join instructor on userID=instructorID natural join teaching natural left join reviews_instructor
// ),
// TEACHING_OPTIONS AS(
// 	select teachingid, costPerHour, groupName as "groupName"
// 	from (teaching natural join lesson l) left join (reservation_lesson r natural join reservation) on l.lessonID=r.lessonID
// 	where l.canceled=false and (r.canceled=false or r.canceled is null) and (lessonType='private' or lessonType='group')
// 	and resort='Velouhiou' and sport='Snowboard' and timeStart<='15:00' 
// 	and (isAllDay=false or isAllDay=true) and l.date>='2025/05/29' and l.date<='2026/05/29' 
// 	group by l.lessonID, teachingid
// 	HAVING 
// 	    CASE 
// 	        WHEN lessonType = 'group' 
// 	            THEN (maxParticipants - COALESCE(SUM(participantNumber), 0)) >= 2
// 	        WHEN lessonType = 'private' 
//                 THEN ( SUM(participantNumber) IS NULL  and maxParticipants >= 2 )
// 	        ELSE false
// 	    END
// )
// select i."typeOfLesson", i."instructorName",i."groupName",i."instructionID",i.experience, i.languages,i.description,i.image,i."instructorId",i."reviewScore"::text,i."reviewCount", min(costperhour) as "minPricePerHour",  COUNT(*) OVER () AS "entries"
// from(
// 	SELECT  i."typeOfLesson",teach."groupName", i."instructorName",i.experience, i.languages,i.description,i.image,i."instructorId",i."reviewScore",i."reviewCount", costperhour
// 		, 
// 	       CASE 
// 	         WHEN i."typeOfLesson" = 'private' THEN NULL
// 	         ELSE i.teachingid
// 	       END AS "instructionID"
// 	from TEACHING_OPTIONS teach natural join  INSTRUCTOR_INFO i
// 	where i."instructorName" ILIKE '%') i
// group by i."typeOfLesson", i."instructorName",i."groupName",i."instructionID",i.experience, i.languages,i.description,i.image,i."instructorId",i."reviewScore",i."reviewCount"
// order by "reviewScore" desc
// LIMIT 4
// OFFSET 0



export {insertUser,checkEmailAlreadyUsed,authenticate,getProfileImage,getInstructorInfo,getUserEmail,bookLesson,showLessons,getLessonsMeetingPoints,getIndexReviews,getInstructorReviews,getBookLessonReviwes,getDatesWithLessons}