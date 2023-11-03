const bodyParser = require('body-parser');
const express = require('express');
const Window = require('window');
const DB = require(__dirname + "/routes/db.js");
port = 3000;

app = express();
const window = new Window();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(express.static("views/CSS"));
app.use(express.static("views/templates"));

//global variables
let verificationNum = 0;
let createAccountData;
let logedInUserData;
let LoginData;
let venueList;
let upcomingEventList;
let flag = 0;

//Routes for rendaring the file
app.get('/', function (req, res) {
    res.render("templates/home");
});

app.get('/home', function (req, res) {
    res.render("templates/home");
});

app.get('/signin', function (req, res) {
    res.render("templates/signin", { flag: 0 })
})

app.post('/signin', async function (req, res) {
    checkData = req.body;
    logedInUserData = await DB.isLogin(checkData);
    if (logedInUserData.length != 0) {
    logedInUserData = logedInUserData[0];
        if (logedInUserData.userpass == checkData.password) {
            DB.logedIn(checkData.email);
            res.render("templates/studentform")
        }
        else {
            res.render("templates/signin", { flag: 2 })
        }
    }
    else {
        res.render("templates/signin", { flag: 1 })
    }
});

app.get('/signup', function (req, res) {
    res.render("templates/signup");
});

app.get('/about', function (req, res) {
    res.render('templates/about', { access: 0, submitted: 0 });
});

app.post('/about', function (req, res) {
    feedBackData = req.body;
    DB.feedBack(feedBackData);
    res.render('templates/about', { access: 0, submitted: 1 });

});

app.get('/studentform',function (req, res){
    res.render('templates/studentform',{log : logedInUserData}); 
})

app.get('/studentform2',function (req, res){
    res.render('templates/studentform2',{log : logedInUserData}); 
})

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
})