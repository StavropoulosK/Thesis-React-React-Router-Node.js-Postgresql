import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new pg.Pool({
    // flyio
    // user: 'postgres', ///username,x
    // host: 'hoteldb.flycast',
    // database: 'hoteldb',
    // password: process.env.password, /// password,
    // port: 5432

    // local
    host:process.env.host,
    user:process.env.user,
    password:process.env.password,
    port:process.env.port,
    database:process.env.database
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