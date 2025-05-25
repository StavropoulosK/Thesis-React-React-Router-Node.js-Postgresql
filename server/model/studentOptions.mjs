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

export {getStudentProfileParams,updateStudentInfo}