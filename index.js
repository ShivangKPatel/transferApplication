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
    console.log(checkData);
    logedInUserData = await DB.isLogin(checkData);
    console.log(logedInUserData);
    if (logedInUserData.length != 0) {
        if (logedInUserData[0].userpass == checkData.password) {
            DB.logedIn(checkData.email);
            res.render("templates/home")
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

app.post('/about', async function (req, res) {
    feedBackData = req.body;
    await DB.feedBack(feedBackData);
    res.render('templates/about', { access: 0, submitted: 1 });

});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
})