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


export {insertUser,checkEmailAlreadyUsed,authenticate,getProfileImage}