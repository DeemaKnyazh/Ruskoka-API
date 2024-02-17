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
        console.log("1" + guest);
        let pool = await sql.connect(config);
        let insertGuest = await pool.request()
            //.input('id', sql.Int, order.id)
            .input('name', sql.NVarChar, guest.name)
            .input('tables', sql.Int, guest.tables)
            .input('ticket', sql.NVarChar, guest.ticket)
            .input('raffle', sql.Int, guest.raffle)
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

//Camper management api
async function getCampersByYear(year, auth){//Gets a JSON object of all the campers withing that year.
    try{
        if (authen(auth)){
            let pool = await sql.connect(config);
            let campers = await pool.request()
                .input('input_parameter', sql.Int, year)
                .query("SELECT * FROM campers WHERE year = @input_parameter");
            return campers.recordsets
        }   
        else{
            return "error";
        }
    }
    catch (error){
        console.log(error);
    }
}

async function addCamper(camper,auth){//Add more fields
    try{
        if (authen(auth)){
        let pool = await sql.connect(config);
        let insertCamper = await pool.request()
            //.input('id', sql.Int, order.id)
            //.input('status', sql.Int, camper.status)//Defaults to Pending when first inserted
            .input('name', sql.NVarChar, camper.name)
            .input('birthdate', sql.DateTime, guest.dob)
            .input('sex', sql.Bit, camper.sex)
            .input('email', sql.NVarChar, camper.email)
            .input('guardianOneName', sql.NVarChar, camper.guardianOneName)
            .input('guardianOneEmail', sql.NVarChar, camper.guardianOneEmail)
            .input('guardianOnePhone', sql.NVarChar, camper.guardianOnePhone)
            .execute('InsertCamper');
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

async function updateCamper(camperId, auth){//Figure out

}

async function camperStatus(camperId,status,auth){
    try{
        if (authen(auth)){
            let pool = await sql.connect(config);
            let camper = await pool.request()
            .input('camperId', sql.Int, camperId)
            .input('status', sql.Int, status)
            .query('UPDATE campers SET status = @status WHERE id = @camperId');
            return camper.recordsets
        }
        else{
            return "error";
        }
    }
    catch (error){
        console.log(error);
    }
}

async function camperSession(camperId,status,auth){
    try{
        if (authen(auth)){
            let pool = await sql.connect(config);
            let camper = await pool.request()
            .input('camperId', sql.Int, camperId)
            .input('session', sql.Int, status)
            .query('UPDATE campers SET session = @session WHERE id = @camperId');
            return camper.recordsets
        }
        else{
            return "error";
        }
    }
    catch (error){
        console.log(error);
    }
}

async function camperNotes(camperId,status,auth){
    try{
        if (authen(auth)){
            let pool = await sql.connect(config);
            let camper = await pool.request()
            .input('camperId', sql.Int, camperId)
            .input('session', sql.Int, status)
            .query('UPDATE campers SET session = @session WHERE id = @camperId');
            return camper.recordsets
        }
        else{
            return "error";
        }
    }
    catch (error){
        console.log(error);
    }
}


//Basic auth api
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