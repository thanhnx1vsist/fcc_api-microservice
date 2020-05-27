const express = require('express');
const app = express();
const body_parser = require('body-parser');
const mongoose = require('mongoose');
const Url = require('./model/url');
const URL = require('url');
const dns = require('dns');
const User = require('./model/user');
const Excercise = require('./model/exercises');

var PORT = 3000

app.use(body_parser());
app.use(express.static(__dirname));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


var db = 'mongodb://localhost/fcc'

mongoose.connect(db, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => { console.log('Connected DB!') })
    .catch((err) => { console.log('Error', err) });


// Ex 1
app.get('/api/timestamp', (req, res) => {
    let currentDate = new Date();
    let unixDate = Date.now();
    let utcDate = currentDate.toUTCString();
    res.json({
        unix: unixDate,
        utc: utcDate
    })

})
app.get('/api/timestamp/:date_string', (req, res) => {
    var date = req.params.date_string;
    let unixDate, utcDate;
    let dateObject;
    // kiem tra xem test co xau con co 5 chu so lien tiep hay khong, isodate max = 4
    if (/\d{5}/.test(date)) {
        // date la unix date
        dateObject = new Date(date * 1000);
        utcDate = dateObject.toUTCString();
        unixDate = date;
        console.log("utc", utcDate);
    }
    else {
        utcDate = new Date(date).toUTCString();
        unixDate = new Date(date).getTime();
        dateObject = new Date(date);
    }

    console.log("rrrr", dateObject.toUTCString());
    if (dateObject.toUTCString() === "Invalid Date") {
        res.json({ error: "Invalid Date" })
    } else {
        res.json({
            unix: unixDate,
            utc: utcDate
        })
    }
})

// Ex 2

app.get('/api/whoami', (req, res) => {
    // var ipClient = requestId.getClientIp(req);
    // console.log(ipClient);

    var ipAddress;
    var forwardIP = (req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress).split(',')[0];
    // var lang = req.header('accept-language');
    console.log('aaaaaa', forwardIP);
    // console.log('langgg', lang);
    var language = req.headers['accept-language']
    var software = req.headers['user-agent']
    //console.log('eee', ipAddress);
    console.log('langgg', language);
    console.log('soft', software);
    res.json({
        ipaddress: forwardIP,
        language: language,
        software: software
    })
})


app.get("/", (req,res)=>{
    res.render("index.html")
})


// Ex 4
app.post('/api/exercise/new-user', async(req, res)=>{
    const user = new User({
        username : req.body.username
    })
    const newUser = await user.save();
    res.json(newUser);
});

app.post('/api/exercise/add', async(req,res)=>{
    const exercise = new Excercise({
        userId : req.body.userId,
        description: req.body.description,
        duration: req.body.duration,
        date: req.body.date
    });
    const newEx = await exercise.save();
    res.json(newEx);
})

app.get('api/exercise/log/:userId/:from/:to/:limit', async(req, res)=>{
    var ex = await Excercise.find({
        $and :[
            {userId : req.params.userId},
            {date: {
                $gte: ISODate(req.params.from),
                $lt: ISODate(req.params.to)
            }}
        ]
    }).limit(req.params.limit);
    res.json(ex);
})

app.listen(PORT, () => console.log(`Server is running on ${PORT}`));