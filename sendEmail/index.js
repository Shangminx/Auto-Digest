const { includes } = require("resium");
const core = require('@actions/core');
const github = require('@actions/github');
const nodemailer = require('nodemailer');

const email_password = core.getInput('email_password');
const email_username = core.getInput('sender_email');
const report_data = JSON.parse(core.getInput('report_data'));
const email_to = core.getInput('recipient_email').split(';');

const keywords_lists = [
    ["privacy", "theft", "steal", "leak"],
    ["safety", "security", "concern"],
    ["data", "password", "profile"], 
    ["send", "user", "Microsoft","content"] 
]
  
main(email_username, email_password, email_to, report_data)

function main(email_username, email_password, email_to, report_data) {
    try {
        sendMail(email_username, email_password, email_to, report_data);
    }
    catch (err) {
        core.setFailed(`Error ${err}`);
    }
}

function sendMail(email_username, email_password, email_to, report_data) {

    const emailContent = `
    <html>
        <body style="background-color:grey">
            <table align="center" border="0" cellpadding="0" cellspacing="0"
                width="550" bgcolor="white" style="border:2px solid black">
                <tbody>
                    <tr>
                        <td align="center">
                            <table align="center" border="0" cellpadding="0" 
                                cellspacing="0" class="col-550" width="550">
                                <tbody>
                                    <tr>
                                        <td align="center" style="background-color: #188cd9;;
                                                height: 50px;">
                                            <a href="#" style="text-decoration: none;">
                                                <p style="color:white;
                                                        font-weight:bold; font-size: 18px">
                                                    GitHub Auto-Digest Bot
                                                </p>
                                            </a>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </td>
                    </tr>
                    <tr style="height: 300px;">
                        <td align="center" style="border: none;
                                border-bottom: 2px solid #188cd9; 
                                padding-right: 20px;padding-left:20px">
        
                            <p style="font-weight: bolder;font-size: 42px;
                                    letter-spacing: 0.025em;
                                    color:red" class="small">
                                    Alarm!
                            </p>
                            <p style="font-weight: bolder;font-size: 36px;
                                    letter-spacing: 0.025em;
                                    color:black" class="small">
                                    New high priority issue need to look into!
                            </p>
                        </td>
                    </tr>
        
                    <tr style="display: inline-block;">
                        <td style="height: 150px;
                                padding: 20px;
                                border: none; 
                                border-bottom: 2px solid #361B0E;
                                background-color: white;">
                            
                            <h1 style="text-align: center; align-items: center;">
                                Daily issue list
                            </h1>
                            <h2 style="text-align: left; align-items: center;">
                                Issue Title: ${report_data.total}
                            </h2>
                            <p class="data" 
                                style="text-align: justify-all;
                                align-items: center; 
                                font-size: 15px;
                                padding-bottom: 12px;">
                                Issue Number: 234
                            </p>
                            <p class="data" 
                                style="text-align: justify-all;
                                align-items: center; 
                                font-size: 15px;
                                padding-bottom: 12px;">
                                Issue Create Time: 345
                            </p>
                            <p>
                                <a href="456"
                                style="text-decoration: none; 
                                        color:black; 
                                        border: 2px solid #188cd9; 
                                        padding: 10px 30px;
                                        font-weight: bold;"> 
                                View Issue 
                                </a>
                            </p>

                            <h2 style="text-align: left; align-items: center;">
                                Issue Title: ${report_data.total+1}
                            </h2>
                            <p class="data" 
                                style="text-align: justify-all;
                                align-items: center; 
                                font-size: 15px;
                                padding-bottom: 12px;">
                                Issue Number: 234
                            </p>
                            <p class="data" 
                                style="text-align: justify-all;
                                align-items: center; 
                                font-size: 15px;
                                padding-bottom: 12px;">
                                Issue Create Time: 345
                            </p>
                            <p>
                                <a href="456"
                                style="text-decoration: none; 
                                        color:black; 
                                        border: 2px solid #188cd9; 
                                        padding: 10px 30px;
                                        font-weight: bold;"> 
                                View Issue 
                                </a>
                            </p>
                        </td>
                    </tr>
                </tbody>
            </table>
        </body>
    </html>
    `

    let transporter = nodemailer.createTransport({
        host: 'primary.exchange.microsoft.com',
        port: 25,
        tls: {
            rejectUnauthorized: false
        }
    })

    let mailOptions = {
        from: email_username,
        to: email_to,
        subject: 'Daily report about issues',
        html: emailContent,
        priority: "high"
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            core.error(error);
        } else {
            core.info('Email sent: ' + info.response);
        }
    });

}

module.exports = {
    main,
}
