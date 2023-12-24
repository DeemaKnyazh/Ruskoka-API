var config = require('./dbconfig');
const sql = require('mssql');

async function getGuests(){
    try{
        let pool = await sql.connect(config);
        let guests = await pool.request().query("SELECT * FROM guest");
        console.log("connected");
        return guests.recordsets;
    }
    catch (error){
        console.log(error);
    }
}

async function getGuest(guestId){
    try{
        let pool = await sql.connect(config);
        let guest = await pool.request()
            .input('input_parameter', sql.Int, guestId)
            .query("SELECT * from guest where id = @input_parameter");
        return guest.recordsets
    }
    catch{
        
    }
}

module.exports = {
    getGuests : getGuests
}