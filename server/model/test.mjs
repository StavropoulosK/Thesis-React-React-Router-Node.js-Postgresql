import connect from "./connection.mjs";


const sql = `insert into payment (amount,paymentDate) values (24,$1)`;
    try {
        const values=["20/05/2024"]
        const client = await connect();
        const res = await client.query(sql,values)
        client.release()

    }
    catch (err) {
        throw err
    }