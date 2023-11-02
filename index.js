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


app.get('/', function(req, res) {
    res.render("templates/home");
});

app.get('/home', function(req, res) {
    res.render("templates/home");
});

app.get('/signin', function(req, res) {
    res.render("templates/signin");
});

app.get('/signup', function(req, res) {
    res.render("templates/signup");
});

app.post('/signup', function(req, res) {
    console.log(req.body);
    //DB.signup(req.body);
    res.redirect("/signin");
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}/`);
});