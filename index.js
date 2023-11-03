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

//VerificationNumber
var verificationnum = 0;
let careateAccountData;

app.get('/', function(req, res) {
    res.render("templates/home");
});

app.get('/home', function(req, res) {
    res.render("templates/home");
});

app.get('/signin', function(req, res) {
    res.render("templates/signin", { flag: 0 }) //flag=0 means no error
})

app.post('/signin', async function(req, res) {
    checkData = req.body;
    console.log(checkData);
    logedInUserData = await DB.isLogin(checkData);
    if (logedInUserData.length != 0) {
        logedInUserData = logedInUserData[0];
        console.log(logedInUserData);
        if (logedInUserData.userpass == checkData.password) {
            DB.logData(logedInUserData.useremail, logedInUserData.userid);
            res.render("templates/home")
        } else {
            res.render("templates/signin", { flag: 2 }) //flag=2 means password is wrong
        }
    } else {
        res.render("templates/signin", { flag: 1 }) //flag=1 means account not found
    }
});

app.get('/signup', function(req, res) {
    res.render("templates/signup", { flag: 0 }); //flag=0 means no error
});

app.post('/signup', async function(req, res) {
    createAccountData = req.body;
    console.log(createAccountData);
    verificationnum = await DB.isFound(createAccountData.email);
    console.log(verificationnum);
    if (verificationnum == 0) {
        res.render("templates/signup", { flag: 1 }); //flag=1 means account already exist
    } else {
        const message = await DB.OTPMessage(createAccountData.firstname, verificationnum);
        try {
            await DB.sendEmail(createAccountData.email, "Verify your self on bookMyCelebration...", message);
        } catch (error) {
            console.log("Error got in sending an email");
        }
        res.render("templates/verification", { flag: 0, mail: createAccountData.email }); //flag=0 means no error
    }
});

app.get('/verification', function(req, res) {
    res.render("templates/verification", { flag: 0, mail: createAccountData.email });
});

app.post('/verification', function(req, res) {
    numbrerGot = req.body;
    if (verificationnum == numbrerGot.OTPVerification) {
        DB.createNewAccount(createAccountData);
        res.render("templates/signin", { flag: 3 }) //flag=3 means account created successfully and login using your email and password
    } else {
        res.render("templates/verification", { flag: 1, log: createAccountData }); //flag=1 means OTP is wrong
    }
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
});