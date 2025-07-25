const nodemailer = require('nodemailer');

const sendmail = async (options) => {
  // Create a transporter object using SMTP
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // Define email options
  const mailOptions = {
    from: ' vishu patil <"vishu@google.com">',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendmail;