const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS
    }
});

const mailOptions = {
    from: process.env.EMAIL_USER,
    subject: 'Payment Successful',
};

module.exports = { transporter, mailOptions };