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

    var listcontent = ""
    if(report_data.total == 0) return;
    for(let i = 0; i < report_data.total; i++)
    {
        listcontent = listcontent + `
                    <tr>
                        <td>${report_data.issueList[i].issueName}</td>
                        <td><a href=${report_data.issueList[i].issueLink}>${report_data.issueList[i].issueLink}</a></td>
                        <td>${report_data.issueList[i].issueTags}</td>
                        <td>${report_data.issueList[i].issueAssignee}</td>
                    </tr>
        `
    }
    const emailContent = `
    <style>
        table {
        border-collapse: collapse;
        width: 100%;
        }
        
        th, td {
        text-align: left;
        padding: 8px;
        }
        
        th {
        background-color: #222;
        color: #fff;
        }
        
        /* tr:nth-child(even) {
        background-color: #f2f2f2;
        }
        tr {
        }
        tr:hover {
        background-color: #ddd;
        } */
    </style>
    <html>
        <body style="background-color:white">
            <table align="center" border="0" cellpadding="0" cellspacing="0"
                bgcolor="white" style="border:2px solid black">
                <tbody>
                    <tr>
                        <td align="center">
                            <table align="center" border="0" cellpadding="0" 
                                cellspacing="0" class="col-550" width="550">
                                <tbody>
                                    <tr>
                                        <td align="center" style="background-color: #188cd9;;
                                                height: 50px;">
                                            <a align="center" href="#" style="text-decoration: none;">
                                                <p align="center" style="color:white;
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
                    <tr>
                        <td align="center" style="
                                border-bottom: 2px solid #188cd9; 
                                padding-right: 20px;padding-left:20px">
        
                            <p align="center" style="font-weight: bolder;font-size: 36px;
                                    letter-spacing: 0.025em;
                                    color:black" class="small">
                                    <script>
                                        date = new Date().toLocaleDateString();
                                        document.write(date);
                                    </script>
                                    Weekly Issue List
                            </p>
                        </td>
                    </tr>

                    <table>
                        <thead>
                        <tr align="center">
                            <th>IssueName</th>
                            <th>IssueLink</th>
                            <th>TAG</th>
                            <th>Assignee</th>
                        </tr>
                        </thead>
                        <tbody>
                        ${listcontent}
                        </tbody>
                    </table>
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
        subject: '[WV2 Github Feedback] Weekly report on new issues',
        html: emailContent
    };

    function retryFunc(error, info, times)
    {
        if(error && times > 0) {
            core.info('retry times: ' + times.toString() + '. ' + error)
            transporter.sendMail(mailOptions, (error, info) => retryFunc(error, info, times-1))
        } else if(error) {
            core.error(error)
        } else {
            core.info('Email sent: ' + info.response);
        }     
    }

    transporter.sendMail(mailOptions, (error, info) => retryFunc(error, info, 2))

}

module.exports = {
    main,
}
