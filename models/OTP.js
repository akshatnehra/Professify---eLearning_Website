const mongoose = require('mongoose');
const sendMail = require('../utils/mailSender');
require('dotenv').config();

// OTP Schema
const OTPSchema = mongoose.Schema({
    email: {
        type: String,
        trim: true,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 5*60, // 5 minutes
    },
});

async function sendOTP(email, otp) {
    try {
        const response = await sendMail(email, "Professify - One-Time Password (OTP) Verification", otp);
        console.log(`Email sent to ${email} ` + response);
    } catch (error) {
        console.log(error);
        console.log('Error in sending OTP');
    }

}

// call sendOTP function before saving OTP to database
OTPSchema.pre('save', async function(next) {
    const otp = this;
    await sendOTP(otp.email, otp.otp);
    next();
});

module.exports = mongoose.model('OTP', OTPSchema);
