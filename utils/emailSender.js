const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email, username, code) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Email Verification - Your Account Registration",
    html: getVerificationEmailTemplate(username, code),
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

function getVerificationEmailTemplate(username, code) {
  return `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
                .header { background-color: #da1dd7ff; color: white; padding: 20px; text-align: center; }
                .content { padding: 20px; background-color: #f9f9f9; }
                .code { font-size: 24px; font-weight: bold; color: #da1dd7ff; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; }
                .footer { text-align: center; padding: 20px; color: #666; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Welcome to Our Platform!</h1>
                </div>
                <div class="content">
                    <h2>Hello ${username}!</h2>
                    <p>Thank you for registering with us. To complete your registration, please use the verification code below:</p>
                    <div class="code">${code}</div>
                    <p><strong>Important:</strong> This code will expire in 1 hour.</p>
                    <p>If you didn't create an account, please ignore this email.</p>
                </div>
                <div class="footer">
                    <p>Best regards,<br>4Max</p>
                </div>
            </div>
        </body>
        </html>
        `;
}

// let transporter;
// async function getTransporter() {
//   if (
//     process.env.EMAIL_HOST &&
//     process.env.EMAIL_USER &&
//     process.env.EMAIL_PASS
//   ) {
//     transporter = nodemailer.createTransport({
//       host: process.env.EMAIL_HOST,
//       port: process.env.EMAIL_PORT || 587,
//       secure: false,
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });
//   } else {
//     const testAccount = await nodemailer.createTestAccount();

//     console.log("Using Ethereal test account for email preview:");
//     console.log("Login:", testAccount.user);
//     console.log("Pass:", testAccount.pass);

//     transporter = nodemailer.createTransport({
//       host: testAccount.smtp.host,
//       port: testAccount.smtp.port,
//       secure: testAccount.smtp.secure,
//       auth: {
//         user: testAccount.user,
//         pass: testAccount.pass,
//       },
//     });
//   }
//   return transporter;
// }

// async function sendVerificationEmail(email, username, code) {
//   if (!transporter) transporter = await getTransporter();

//   const mailOptions = {
//     from: process.env.EMAIL_USER || '"4Max" <no-reply@4max.com>',
//     to: email,
//     subject: "Email Verification - Your Account Registration",
//     html: `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <style>
//           .container { max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif; }
//           .header { background-color: #da1dd7ff; color: white; padding: 20px; text-align: center; }
//           .content { padding: 20px; background-color: #f9f9f9; }
//           .code { font-size: 24px; font-weight: bold; color: #da1dd7ff; text-align: center; padding: 20px; background: white; border-radius: 5px; margin: 20px 0; }
//           .footer { text-align: center; padding: 20px; color: #666; }
//         </style>
//       </head>
//       <body>
//         <div class="container">
//           <div class="header">
//             <h1>Welcome to Our Platform!</h1>
//           </div>
//           <div class="content">
//             <h2>Hello ${username}!</h2>
//             <p>Thank you for registering with us. To complete your registration, please use the verification code below:</p>
//             <div class="code">${code}</div>
//             <p><strong>Important:</strong> This code will expire in 1 hour.</p>
//             <p>If you didn't create an account, please ignore this email.</p>
//           </div>
//           <div class="footer">
//             <p>Best regards,<br>4Max</p>
//           </div>
//         </div>
//       </body>
//       </html>
//     `,
//   };

//   try {
//     const info = await transporter.sendMail(mailOptions);
//     console.log(`✅ Verification email sent to ${email}`);
//     const previewURL = nodemailer.getTestMessageUrl(info);
//     if (previewURL) {
//       console.log("Preview your test email here:", previewURL);
//     }

//     return true;
//   } catch (error) {
//     console.error("Error sending email:", error);
//     return false;
//   }
// }

module.exports = {
  sendVerificationEmail,
};
