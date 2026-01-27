const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

module.exports = async (to, subject, html) => {
  await transporter.sendMail({
    from: `"QuickGas" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
