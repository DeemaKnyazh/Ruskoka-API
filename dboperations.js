var config = require('./dbconfig');
const sql = require('mssql');
require('dotenv').config()

async function getGuests(auth){
    try{
        if(authen(auth)){
        let pool = await sql.connect(config);
        let guests = await pool.request().query("SELECT * FROM guest");
        console.log("connected");
        return guests.recordsets;
    }
    else{
        return "error";
    }
    }
    catch (error){
        console.log(error);
    }
}

async function getGuest(guestId){
    try{
        if (authen(auth)){
            let pool = await sql.connect(config);
            let guest = await pool.request()
                .input('input_parameter', sql.Int, guestId)
                .query("SELECT * FROM guest WHERE id = @input_parameter");
            return guest.recordsets
        }   
        else{
            return "error";
        }
    }
    catch (error){
        console.log(error);
    }
}

async function signIn(guestId,auth){
    try{
        if (authen(auth)){
            let pool = await sql.connect(config);
            let guest = await pool.request()
            .input('input_parameter', sql.Int, guestId)
            .query("SELECT sign FROM guest WHERE id = @input_parameter");
            sign = guest.recordset[0].sign;
            if(sign == 0){
                await pool.request()
                .input('input_parameter', sql.Int, guestId)
                .query('UPDATE guest SET sign = 1 WHERE id = @input_parameter');
            }
            else{
                await pool.request()
                .input('input_parameter', sql.Int, guestId)
                .query('UPDATE guest SET sign = 0 WHERE id = @input_parameter');
            }
            return guest.recordsets
        }
        else{
            return "error";
        }
    }
    catch (error){
        console.log(error);
    }
}

async function addGuest(guest,auth){
    try{
        if (authen(auth)){
        let pool = await sql.connect(config);
        let insertGuest = await pool.request()
            //.input('id', sql.Int, order.id)
            .input('name', sql.NVarChar, guest.name)
            .input('tables', sql.Int, guest.tables)
            .input('ticket', sql.NVarChar, guest.ticket)
            .execute('InsertGuest');
            return insertGuest.recordsets;
        }
        else{
            return "Incorrect Or Missing API key";
        }
    }
    catch (error){
        console.log(error);
    }
}

function authen(authHeader){
    if (authHeader.startsWith("Bearer ")){
        token = authHeader.substring(7, authHeader.length);
        console.log(token);
        if(token == process.env.APIKEY){
            return true;
        }
        else{
            return false;
        }
   } else {
      return false;
   }
}

module.exports = {
    getGuests : getGuests,
    getGuest : getGuest,
    signIn : signIn,
    addGuest : addGuest
}