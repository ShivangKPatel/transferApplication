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

// Text send to encrypt function
async function onStart() {
    var hw = encrypt("shivang02052005@gmail.com")
    res = await connection.query(`select * from encription`);
    res = res[0][0];
    console.log(res[0]);
    console.log(hw)
    hw = res;
    console.log(decrypt(hw))
}


async function isFound(emailCA) {
    var min = 1000;
    var max = 9999;
    var num = Math.floor(Math.random() * (max - min + 1)) + min;
    const [result] = await connection.query(`select * from master where useremail="${emailCA}"`);
    if (result.length != 0) {
        num = 0;
    }
    return num;
}

async function isLogin({ username, email, password, role }) {
    const [result] = await connection.query(`select * from master where useremail="${email}" AND userpass="${password}"`);
    return result;
}

function feedBack({ email, subject, feedbacktext }) {
    connection.query(`insert into feedback (email, subject, message) values ("${email}","${subject}","${feedbacktext}")`)
    return;
}

function logData(email, userid) {
    var datetime = new Date();
    date = datetime.toISOString().slice(0, 10);
    const hours = datetime.getHours();
    const minutes = datetime.getMinutes();
    const time = `${hours}:${minutes}`;
    connection.query(`insert into log (userid ,email, date,time) value ("${userid}" , "${email}","${date}","${time}")`);
}

function sendEmail(mailAddress, subject, arghtml) {
    var mailOptions = {
        from: 'smart20072020@gmail.com',
        to: `${mailAddress}`,
        subject: `${subject}`,
        html: `${arghtml}`
    };
    transporter.sendMail(mailOptions, function(error, info) {
        if (error) throw error;
        return;
    });
}

function OTPMessage(firstname, number) {
    const message = `
    <head>
        <link rel="stylesheet" href="CSS/stylemail.css">
    </head>
    <table id="m_8636265828324098607udemy-email" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f7f9fa;padding:24px">
        <tbody><tr>
            <td>&nbsp;</td>
            <td width="600">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff">
                        <tbody><tr>
                            <td style="border-bottom:1px solid #cccccc;padding:24px">
                                <h2>Student college transfer application</h2>
                            </td>
                        </tr>
                        <tr>
                            <td style="padding: 15px 24px 0 24px">
                                <p><a style="text-decoration:none;color:#1c1d1f">
                                    Hi ${firstname}
                                </a></p>
                                <p>
                                    <a style="text-decoration:none;color:#1c1d1f"><b></b></a><b><a style="text-decoration:none;color:#1c1d1f">Creating a new account</a></b>
                                </p>
                                <p>
                                    <a style="text-decoration:none;color:#1c1d1f">Your 4-Digit verification code is <b style="font-size: 16px; margin-top: 4px; margin-left: 4px;">${number}</b></a>
                                </p>
                                <p>
                                    <a style="text-decoration:none;color:#1c1d1f">This code was sent to you to verify your new account. </a>
                                </p>
                                <p style="margin-bottom:0">
                                    <a style="text-decoration:none;color:#1c1d1f">If you didn't request a code then ignore it.</a>
                                </p>   
                            </td>
                        </tr>
                    <tr>
                        <td style="padding:24px 0 0 0"></td>
                    </tr>
                </tbody></table>
            </td>
            <td>&nbsp;</td>
        </tr>
    </tbody></table>`;
    return message;
}

function createNewAccount({ firstname, middlename, lastname, email, password, contactno, select }) {
    connection.query(`insert into master(firstname, middlename, lastname, useremail, userpass, contactno, usertype) values("${firstname}", "${middlename}", "${lastname}", "${email}", "${password}", "${contactno}", "${select}")`);
}

module.exports = { isFound, sendEmail, OTPMessage, createNewAccount, isLogin, logData, feedBack };