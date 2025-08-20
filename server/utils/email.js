const dotenv = require("dotenv");
const path = require("path");
const { createTransport } = require("nodemailer");

//   Load .env file from config folder
dotenv.config({
  path: path.resolve(__dirname, "../config/.env"),
});

const SendEmail = async (options) => {
  try {
    //   Create email transporter
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT),
      auth: {
        user: process.env.SMTP_MAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    //   Email options
    const mailOptions = {
      from: process.env.SMTP_MAIL,
      to: options.email,
      subject: options.subject,
      html: options.isHtml ? options.message : undefined,
      text: !options.isHtml ? options.message : undefined,
    };

    //   Send the email
    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    console.error("   Error sending email:", error);
    throw new Error("Email could not be sent");
  }
};

module.exports = SendEmail;
