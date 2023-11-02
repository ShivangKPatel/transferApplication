var mysql2 = require('mysql2');
var nodemailer = require('nodemailer');

const connection = mysql2.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'transferapplication',
    port: '3308'
}).promise();

var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        //lavamwbdgvqvemup
        user: 'smart20072020@gmail.com',
        pass: 'lavamwbdgvqvemup'
    }
});

async function isFound(emailCA) {
    var min = 1000;
    var max = 9999;
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    const [result] = await connection.query(`select * from master where email="${emailCA}"`);
    if (result.length != 0) {
        num = 0;
    }
    return num;
}

async function isLogin({username, email, password, role}){
    const [result] = await connection.query(`select * from master where useremail="${email}" AND userpass="${password}"`);
    
    return result;
}

function feedBack({email, subject, feedbacktext}){
    connection.query(`insert into feedback (email, subject, message) values ("${email}","${subject}","${feedbacktext}")`)
    return;
}

function logedIn(email){
    var datetime = new Date();
    date = datetime.toISOString().slice(0,10);
    const hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const time = `${hours}:${minutes}`;
    connection.query(`insert into log (email,date,time) value ("${email}","${date}","${time}")`);
}

module.exports = {isFound, isLogin,feedBack,logedIn};