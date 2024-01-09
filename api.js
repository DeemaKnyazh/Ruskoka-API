var dboperations = require('./dboperations');
var Guest = require('./guest');

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();
var router = express.Router();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors());
app.use('/api', router);

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

router.route('/signIn/:id').get((request,response)=>{
    dboperations.signIn(request.params.id, request.headers.authorization).then(result =>{
        response.json(result[0])
    })
})

router.route('/guests').post((request,response)=>{

    let guest = {...request.body}

    dboperations.addGuest(guest, request.headers.authorization).then(result =>{
        response.status(201).json(result);
    })
})



var port = process.env.PORT || 443;
app.listen(port);
console.log('Order API is running at ' + port);

dboperations.getGuests().then(result => {
    console.log(result);
})