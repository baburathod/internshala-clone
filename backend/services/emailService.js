const nodemailer = require("nodemailer");

// Reuse this transporter for later features (Resume OTP, French Language OTP, Subscriptions)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.mailtrap.io",
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.SMTP_USER || "test_user",
    pass: process.env.SMTP_PASS || "test_pass"
  },
  tls: {
    rejectUnauthorized: false
  },
  // Force IPv4 because Render's free tier has issues reaching Gmail over IPv6
  family: 4
});

const sendResetEmail = async (email, newPassword) => {
  try {
    const mailOptions = {
      from: '"Internshala Clone Support" <no-reply@internshalaclone.com>',
      to: email,
      subject: "Your New Temporary Password",
      text: `Your password has been successfully reset. \n\nYour new temporary password is: ${newPassword}\n\nPlease log in and change your password immediately.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2 style="color: #007bff;">Password Reset</h2>
          <p>Your password has been successfully reset.</p>
          <p>Your new temporary password is: <strong>${newPassword}</strong></p>
          <p>Please log in and change your password immediately.</p>
          <br/>
          <p>Thanks,<br/>Internshala Clone Team</p>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = {
  sendResetEmail,
  transporter // Exporting for future OTP features
};
