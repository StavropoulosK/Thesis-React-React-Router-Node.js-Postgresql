import connect from "./connection.mjs";

async function getInstructorProfileParams(instructorID){
    let client
    try {
        const sql = `SELECT instructorID, email, phoneNumber, languages, resorts, sports, cancelationPolicy, biographyNote, summaryInfo, yearsOfExperience, firstName, lastName ,profilepicture
                     FROM "USER" join instructor on userID=instructorID WHERE instructorID = $1`;

        client = await connect();
        const res = await client.query(sql, [instructorID]);
        return res.rows[0]
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function updateInstructorInfo(updateValueName,updateValue,tableName,instructorID){
    let client
    let userIDName=''
    try {

        if(tableName=="USER"){
            userIDName='userID'
        }
        else if(tableName=='instructor'){
            userIDName='instructorID'

        }
        const sql = `update "${tableName}" set ${updateValueName}=$1 where ${userIDName}=$2`;

        client = await connect();
        const res = await client.query(sql, [updateValue,instructorID]);

        return res.rows[0]
    } catch (err) {
        throw err;
    } finally {
        client.release(); 
    }
}

async function saveImage(userID, imageBuffer) {
    let client;
    try {
        client = await connect();

        const sql = `UPDATE "USER"
                     SET profilepicture = $1
                     WHERE userid = $2`;

        await client.query(sql, [imageBuffer, userID]);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

async function updateMeetingPointImage(meetingPointId,instrcutorId, imageBuffer){
    let client;
    try {
        client = await connect();

        const sql = `UPDATE meetingpoint
                     SET picture = $1
                     WHERE instructorId = $2 and meetingPointId=$3`;

        await client.query(sql, [imageBuffer, instrcutorId,meetingPointId]);
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }
}

function getFirstAndLastDate(monthYearStr) {

    // input April 2025
    // output  2025/04/01  2025/04/30

    const [monthName, yearStr] = monthYearStr.trim().split(" ");
    
    // Parse month number from month name (1-12)
    const month = new Date(`${monthName} 1, 2000`).getMonth() + 1; 
    // Note: year 2000 is arbitrary, just for parsing month
  
    const year = parseInt(yearStr, 10);
  
    // First day is always day 1
    const firstDate = `${year}/${String(month).padStart(2, "0")}/01`;
  
    // To get last day, create a date for the next month day 0 (which is last day prev month)
    const lastDay = new Date(year, month, 0).getDate();
  
    const lastDate = `${year}/${String(month).padStart(2, "0")}/${lastDay}`;
  
    return { firstDate, lastDate };
}


async function getMonthStatistics(instructorID,monthYearStr){



    const{firstDate,lastDate}= getFirstAndLastDate(monthYearStr)
    let client;
    try{
        client = await connect();

        const sql=`select amount,e.lessonType, (EXTRACT(EPOCH FROM (e.timeEnd::time - e.timeStart::time)) / 60) as minutes
                    from (( (select instructorID from instructor where instructorID=$1) natural join teaching natural join lesson) e join reservation_lesson r on e.lessonID=r.lessonID )
                    natural join reservation  natural join payment
                    where e.canceled=FALSE and r.canceled=FALSE and e.date>=$2 and e.date<=$3 and e.date<= (SELECT TO_CHAR(CURRENT_DATE, 'YYYY/MM/DD'))` 
        
        const res=await client.query(sql, [instructorID,firstDate,lastDate]);
        return res.rows
    } catch (err) {
        throw err;
    } finally {
        client.release();
    }

}

async function getGeneralStatistics(instructorID){
    let client1,client2;
    try{
        client1 = await connect();
        client2 = await connect();

        const sql1=`select count(*),reviewStars::text
                    from instructor natural join teaching natural join lesson natural join review_lesson natural join review
                    where instructorid=$1
                    group by reviewStars,instructorid` 
                    

        const sql2=`select distinct TO_CHAR(TO_DATE("date", 'YYYY/MM/DD'), 'YYYY/MM') as "date"
                    from (( select instructorID from instructor where instructorID=$1) natural join teaching natural join lesson ) e join reservation_lesson r on e.lessonID= r.lessonID
                    where e.canceled=FALSE and r.canceled=false and e.date<= (SELECT TO_CHAR(CURRENT_DATE, 'YYYY/MM/DD') as today)` 

        const [res1, res2] = await Promise.all([
                                client1.query(sql1, [instructorID]),
                                client2.query(sql2, [instructorID])
                            ]);
        return {reviewScores:res1.rows, monthsToDisplay:res2.rows}
 
    } catch (err) {
        throw err;
    } finally {
        client1.release();
        client2.release();

    }

}

async function createMeetingPoint(instructorID){
    let client
    try{
        client = await connect();

        const sql=`insert into MEETINGPOINT values (default,default,default,default,$1)` 
        
        await  client.query(sql, [instructorID])
        return
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    }
}

async function updateMeetingPoint(meetingPointId,updateField,updateValue){
    let client
    try{
        client = await connect();

        const sql=`update MEETINGPOINT set ${updateField}=$1 where meetingPointID=$2` 
        
        await  client.query(sql, [updateValue,meetingPointId])
        return
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    }
}

async function deleteMeetingPoint(meetingPointId,instrcutorId){
    let client
    try{
        client = await connect();

        const sql=`delete from MEETINGPOINT where meetingPointId=$1 and instructorId=$2` 
        
        await  client.query(sql, [meetingPointId,instrcutorId])
        return
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    }
}

async function getMeetingPoints(instructorID){
    let client
    try{
        client = await connect();

        const sql=`select meetingPointId as id, resortText as resort, locationText as text, picture as image from MEETINGPOINT where instructorID=$1 order by meetingPointId` 
        
        const result=await  client.query(sql, [instructorID])
        return result.rows
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    }
}

// {
//     teachingID:202,
//     selectedResort:"Parnassou",
//     selectedSport:"Ski",
//     selectedDateStart:"24/05/2025",  fix
//     selectedDateEnd:"27/05/2025",    fix
//     selectedDays:["Monday","Tuesday"],
//     timeStart:"07:20",
//     timeEnd:"10:20",
//     isLessonAllDay:"true",   
//     selectedLessonType:"private",
//     selectedMaxParticipants:"1 member", fix
//     meetingPoint:"location 1",   fix
//     hourCost:"202",  
//     groupName:"",
//     lessons:[
//         {
//           lessonID: 1,
//           date: "20/05/2025",        
//           canceled: false,
//           time: "10:00-12:00",
//           hasParticipants: true,    
//         },


       

async function getExistingTeachings(instructorId){
    let client
    try{
        client = await connect();

        // teaching natural join lesson is to improve performance (reduce rows due to l.instructorID=$1 constraint )

        const sql=` WITH lessonsWithParticipantsTable AS (
                        SELECT l.lessonID AS lessonsWithParticipants
                        FROM (teaching natural join lesson) l JOIN reservation_lesson r ON r.lessonID = l.lessonID
                        WHERE l.canceled = FALSE AND r.canceled = FALSE and l.instructorID=$1
                    ),
                    
                    lessonsPerTeaching AS (
                        SELECT 
                            l.teachingID,
                            json_agg(
                                json_build_object(
                                    'lessonID', l.lessonID,
                                    'date', SUBSTR(l."date", 9, 2) || '/' || SUBSTR(l."date", 6, 2) || '/' || SUBSTR(l."date", 1, 4),
                                    'canceled', l.canceled,
                                    'time', l.timeStart || '-' || l.timeEnd,
                                    'hasParticipants', l.lessonID IN (SELECT lessonsWithParticipants FROM lessonsWithParticipantsTable)
                                )
                                ORDER BY l."date" , l.timeStart
                            ) AS lessons
                        FROM (teaching natural join lesson) l
                        where l.instructorID=$1
                        GROUP BY l.teachingID
                    )
                    
                    SELECT 
                    t.teachingid as "teachingID", t.resort as "selectedResort", t.sport as "selectedSport", t.dateStart as "selectedDateStart",
                                        t.dateEnd as "selectedDateEnd", t.weekDays as "selectedDays", t.timeStart as "timeStart", t.timeEnd as "timeEnd",
                                        t.isAllDay::text as "isLessonAllDay", t.lessonType as "selectedLessonType", t.maxParticipants as "selectedMaxParticipants",
                                        t.meetingPointID as "meetingPoint", t.costPerHour::text as "hourCost", t.groupName as "groupName",lp.lessons
                    FROM teaching t JOIN lessonsPerTeaching lp ON t.teachingID = lp.teachingID
                    where t.instructorID=$1
                    order by t.dateEnd DESC, t.teachingid `
        
        const result=await  client.query(sql, [instructorId])
        return result.rows
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    } 
}

async function createTeaching(instrcutorId,selectedDateStart,selectedDateEnd,selectedResort,selectedSport,maxParticipants,groupName,days,finalMeetingPointID, hourCost,timeStart,timeEnd,selectedLessonType,isAllDay,datesArray){
    let client

    try {
        client = await connect();

        await client.query('BEGIN')
        const sql1 = `insert into teaching values(default,$1,$2 ,$3 ,$4 ,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) returning teachingID`;

        const teachingID = (await client.query(sql1, [selectedSport,selectedResort,selectedLessonType,selectedDateStart,selectedDateEnd,days,timeStart,timeEnd,isAllDay,maxParticipants,hourCost,groupName,instrcutorId,finalMeetingPointID])).rows[0].teachingid

        const sql2 = `  WITH data( dates, teachingID) AS
                        (VALUES ($1::varchar(30)[],$2::int))
                        INSERT INTO Lesson (date,teachingID)
                        SELECT unnest(dates), teachingID
                        FROM data;`


        await client.query(sql2, [datesArray,Number(teachingID)])
        await client.query('COMMIT')
    }
    catch (e) {
        await client.query('ROLLBACK')
        throw e
    }
    finally {
        client.release()
    }


 
}

async function profileParamsAreFilled(instructorId){
    let client
    try{
        client = await connect();

        const sql=`select * from instructor where instructorID=$1` 
        
        const result= (await  client.query(sql, [instructorId])).rows[0]

        for (const [key, value] of Object.entries(result)) {
            if (key !== 'instructorid' ) {
              if(value=="" || value.length==0){
                return false
              }
            }
        }

        return true
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    }
}

async function updateTeaching(instrcutorId,meetingPointId,teachingID){
    let client
    try{
        client = await connect();

        const sql=`update teaching set meetingPointID=$1 where instructorID=$2 and teachingID=$3` 
        
        await  client.query(sql, [meetingPointId,instrcutorId,teachingID])
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    }
}

async function cancelInstructorLessons(instrcutorId,lessonIDsArray){
    let client
    try{
        client = await connect();

        const sql=` UPDATE lesson 
                    SET canceled = true 
                    WHERE lessonID = ANY($1) 
                    AND teachingID IN (
                        SELECT teachingID 
                        FROM teaching 
                        WHERE instructorID = $2
                    )` 
        
        await  client.query(sql, [lessonIDsArray,instrcutorId])
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    } 
}

async function getInstructorSchedule(instrcutorId,date){

    let client
    try{
        client = await connect();

        const sql=` WITH STUDENT_INFO AS (
                        SELECT reservationID, (firstName || ' ' || lastName) as "name", email, phoneNumber as phone, profilePicture
                        FROM "USER"join reservation on userID=studentID
                    )
                    select lesson.canceled as lessoncanceled, r.canceled as studentcanceled,resort,"date",(timeStart||'-'||timeEnd) as "time",sport,participantNumber, lessonType, locationText,instructorNote,lesson.lessonID,lowestLevel as "level", "name", email,phone, profilePicture, picture
                    from (teaching natural join lesson join (reservation_lesson natural join STUDENT_INFO) r on lesson.lessonID= r.lessonID) natural  left join meetingpoint 
                    where instructorID=$1 and lesson.date=$2
                    order by timeStart asc ` 
        
        const result=await  client.query(sql, [instrcutorId,date])

        return result.rows
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    } 
    
}

async function getDatesWithLessons(instrcutorId){
    let client
    try{
        client = await connect();

        const sql=` select distinct lesson.date
                    from teaching natural join lesson join reservation_lesson r on lesson.lessonID= r.lessonID
                    where instructorID=$1 and TO_DATE(lesson.date, 'YYYY/MM/DD') >= CURRENT_DATE` 
        
        const result=await  client.query(sql, [instrcutorId])

        return result.rows
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    } 
    
}


async function updateNote(instrcutorId,lessonID,note){
    let client
    try{
        client = await connect();

        const sql=` UPDATE lesson 
                    SET instructorNote = $1 
                    WHERE lessonID = $2
                    AND teachingID IN (
                        SELECT teachingID 
                        FROM teaching 
                        WHERE instructorID = $3
                    )` 
        
        await  client.query(sql, [note,lessonID,instrcutorId])
 
    } catch (err) {
        throw err;
    } finally {
        client.release();

    } 
}

export {getInstructorProfileParams,updateInstructorInfo,saveImage,getMonthStatistics,getGeneralStatistics,createMeetingPoint,updateMeetingPoint,getMeetingPoints,deleteMeetingPoint,updateMeetingPointImage,getExistingTeachings,
    createTeaching,profileParamsAreFilled,updateTeaching,cancelInstructorLessons,getInstructorSchedule,updateNote,getDatesWithLessons}