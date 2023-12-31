const nodemailer = require('nodemailer');
require('dotenv').config();

const emailSubject = "Professify - One-Time Password (OTP) Verification";
const emailBodyHTML = `
    <div style="font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#f4f4f4">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" border="0" style="margin: 20px auto; background-color: #ffffff; border-radius: 10px; box-shadow: 0px 2px 4px rgba(0,0,0,0.1);">
                    <tr>
                        <td style="padding: 20px; text-align: center;">
                            <img src="https://www.nicepng.com/png/detail/646-6467630_logo-random.png" alt="Professify Logo" width="250">
                            <h2 style="margin-top: 20px; color: #333;">OTP Verification</h2>
                            <p style="font-size: 16px; color: #666;">Dear [User's Name],</p>
                            <p style="font-size: 16px; color: #666;">Welcome to Professify, your online learning platform!</p>
                            <p style="font-size: 16px; color: #666;">To complete your registration, please enter the OTP below:</p>
                            <div style="background-color: #0077b5; color: #ffffff; font-size: 24px; font-weight: bold; padding: 10px 20px; border-radius: 5px;">
                                [OTP]
                            </div>
                            <p style="font-size: 16px; color: #666;">This OTP will expire in 15 minutes.</p>
                            <p style="font-size: 16px; color: #666;">If you didn't request this OTP, please ignore this email.</p>
                            <p style="font-size: 16px; color: #666;">Thank you for choosing Professify!</p>
                            <p style="font-size: 16px; color: #666;">Best Regards,</p>
                            <p style="font-size: 16px; color: #333; font-weight: bold;">The Professify Team</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
    </div>
`;

// Send OTP to user's email
const sendMail = async (email, subject, body) => {
    try {
        const transporter = nodemailer.createTransport({
            service: process.env.EMAIL_SERVICE,
            auth: {
                user: process.env.EMAIL_ID,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_ID,
            to: email,
            subject: `${subject}`,
            html: `${body}`,
        };
        
        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                console.log('Error in sending OTP');
            } else {
                console.log(`Email sent: ${info.response}`);
                return info;
            }
        });
    } catch (error) {
        console.log(error);
        console.log('Error in sending OTP');
    }
};

module.exports = sendMail;
