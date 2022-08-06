const AWS = require("aws-sdk");
const path = require("path");
const ejs = require("ejs");

const AWS_SES = new AWS.SES({
  region: "us-east-1",
});
const { SENDER_EMAIL } = process.env;

const sendEmail = (recipientEmails, html, subject) => {
  const params = {
    Source: SENDER_EMAIL,
    Destination: {
      ToAddresses: recipientEmails,
    },
    ReplyToAddresses: [],
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: html,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: subject,
      },
    },
  };

  return AWS_SES.sendEmail(params).promise();
};

module.exports = {
  sendEmail,
};
