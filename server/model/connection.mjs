import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
    // flyio
    user: process.env.flyioUser, ///username,x
    host: process.env.flyioHost,
    database: process.env.flyioDatabase,
    password: process.env.flyioPassword, /// password,
    port: process.env.flyioPort

    // local
    // host:process.env.host,
    // user:process.env.user,
    // password:process.env.password,
    // port:process.env.dbPort,
    // database:process.env.database
})

async function connect() {
   
    
    try {
        const client = await pool.connect();
        return client
    }
    catch (err) {
        
        console.error(`Failed to connect ${err}`)
        throw err
    }

}

export default connect