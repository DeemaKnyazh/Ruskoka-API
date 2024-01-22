var http = require('http');
var Websocket = require('ws');

var dboperations = require('./dboperations');
var Guest = require('./guest');
require('dotenv').config()

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

//ToDo: Middleware auth, other security auth, websocket auth.

//Winter Palace Ball ticket api
router.use((request,response,next)=>{
    console.log('middleware');
    next();
})

router.route('/guests').get((request,response)=>{
    dboperations.getGuests(request.headers.authorization).then(result =>{
        response.json(result[0])
    })
})

router.route('/guest/:id').get((request,response)=>{
    dboperations.getGuest(request.params.id).then(result =>{
        response.json(result[0])
    })
})

router.route('/test').get((request,response)=>{
        response.json('test')
        //for testing purposes
})

router.route('/signin/:id').post((request,response)=>{
    dboperations.signIn(request.params.id, request.headers.authorization).then(result =>{
        wss.clients.forEach(function each(client) {
            if (client.id != request.headers.client) {
                client.send("status " + request.params.id);//Tells all connected clients that the status of that id had been switched
            }   
         });
        response.status(201).json(result);
    })
})

router.route('/guests').post((request,response)=>{

    let guest = {...request.body}

    dboperations.addGuest(guest, request.headers.authorization).then(result =>{
        wss.clients.forEach(function each(client) {
            if (client.id != request.headers.client) {
                client.send("new");//Tells all connected clients that someone has been added and to rerequest the db
            }   
         });
        response.status(201).json(result);
    })
})


//Camper management api
router.route('/campers/:year').get((request,response)=>{
    dboperations.getGuest(request.params.year).then(result =>{
        response.json(result[0])
    })//Get all the campers for that year
})

router.route('/campers/').post((request,response)=>{
    dboperations.signIn(request.headers.authorization).then(result =>{
        response.status(201).json(result);
    })//Add a new camper
})//Name, DOB, Sex, Previous Years, Russian Speaking, Swimming, Subsidy, Year, Date of Application,

router.route('/campers/:id/').post((request,response)=>{
    dboperations.signIn(request.params.id, request.headers.authorization).then(result =>{
        response.status(201).json(result);
    })//Update a camper
})

router.route('/campers/:id/:status').get((request,response)=>{
    dboperations.signIn(request.params.id, request.headers.authorization).then(result =>{
        response.status(201).json(result);
    })//Change camper status - Pending, Waitlist, Accepted, Denied
})

router.route('/campers/:id/:session').get((request,response)=>{
    dboperations.signIn(request.params.id, request.headers.authorization).then(result =>{
        response.status(201).json(result);
    })//Change Sessions - S1, S2, S1/S2, S3
})

router.route('/campers/:id/:notes').post((request,response)=>{
    dboperations.signIn(request.params.id, request.headers.authorization).then(result =>{
        response.status(201).json(result);
    })//Add notes
})



//Websockets
//Make a GET call to get info for a websocket connection
//Use the data recieved to upgrade to a websocket connection

//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new Websocket.Server({ server });

wss.getUniqueID = function () {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4();
};

wss.on('connection', ws => {

    ws.isAlive = true;
    ws.on('pong', () => {
        ws.isAlive = true;
    });

    ws.id = wss.getUniqueID();
    wss.clients.forEach(function each(client) {
        console.log('Client.ID: ' + client.id);
    });

    //connection is up, let's add a simple simple event
    wss.on('message', message => {

        //log the received message and send it back to the client
        console.log('received: %s', message);

            //send back the message to the other clients
            wss.clients
                .forEach(client => {
                    if (client != ws) {
                        client.send(`Hello, broadcast message -> ${message}`);
                    }    
                });
    });

    //send immediatly a feedback to the incoming connection    
    ws.send(ws.id);
});

//Checks the connected client every 100 seconds, if it doesnt reponds it terminates it after the next 100 seconds
setInterval(() => {
    wss.clients.forEach(ws => {
        if (!ws.isAlive) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 10000);

server.listen(process.env.PORT, () => {
    console.log(`Websocket and Rest server started on port ${server.address().port} :)`);
});
