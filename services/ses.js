const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");
const sesClient = new SESClient({ region: "us-east-1" });

const { SENDER_EMAIL } = process.env;

const sendEmail = (recipientEmails, html, subject) => {
  const sendEmailCommand = new SendEmailCommand({
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
  });

  return sesClient.send(sendEmailCommand);
};

module.exports = {
  sendEmail,
};
