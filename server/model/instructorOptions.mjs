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

export {getInstructorProfileParams,updateInstructorInfo,saveImage}