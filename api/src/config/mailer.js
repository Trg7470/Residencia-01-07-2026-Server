const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail(destination, subject, body) {
    const info = await transporter.sendMail({
        from: '"MEDITECH" <tucorreo@gmail.com>',
        to: destination,
        subject: subject,
        html: `
            ${body}
            `,
    });
    console.log("Correo enviado:", info.messageId);
}

module.exports = { transporter, sendEmail };