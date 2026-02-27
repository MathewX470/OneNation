const nodemailer = require("nodemailer");

const sendOtpEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS, // App password (NOT your real password)
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "OneNation Email Verification OTP",
    html: `
      <h3>Your OTP Code</h3>
      <p>Your verification OTP is:</p>
      <h2>${otp}</h2>
      <p>This OTP expires in 5 minutes.</p>
    `,
  });
};

module.exports = sendOtpEmail;