const nodemailer = require('nodemailer');

const sentEmail = async (options) => {
  //  1) create a transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Defube mail options
  const mailOptions = {
    from: 'Admin HQ < adminHq@gmail.io>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  // 3) Accually sent Email
  return await transporter.sendMail(mailOptions);
};

module.exports = sentEmail;
