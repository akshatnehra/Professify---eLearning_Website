const e = require('express');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
const bcrypt = require('bcrypt');

// Reset Password Token
exports.resetPasswordToken = async (req, res) => {
    try {
        // Extract email from request body
        const { email } = req.body;

        // Check if user exists
        const user = User.findOne({ email });
        if (!user) {
            console.log('User not found');
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            });
        }

        // Generate token
        const token = crypto.randomUUID();

        // Set token expiry
        const resetPasswordExpires = Date.now() + 1000 * 60 * 60; // 1 hour

        // Update user
        const updatedUser = await User.findOneAndUpdate({email}, { token, resetPasswordExpires }, { new: true });
        console.log(updatedUser);

        // Create reset password url
        const resetPasswordUrl = `http://localhost:3000/resetPassword/${token}`;

        // Send email
        mailSender(email, 'Reset Password', "Click on the link to reset your password: " + resetPasswordUrl);

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Reset password link sent successfully'
        });

    } catch (error) {
        console.log(error);
        console.log('Error in resetPasswordToken');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Reset Password
exports.resetPassword = async (req, res) => {
    try {
        // Extract token, password, confirmPassword from request body
        const { token, password, confirmPassword } = req.body;

        // Check if password and confirmPassword match
        if (password !== confirmPassword) {
            console.log('Passwords do not match');
            return res.status(400).json({
                success: false,
                msg: 'Passwords do not match'
            });
        }

        // Get user with token
        const user = await User.findOne({ token });
        if (!user) {
            console.log('Invalid token');
            return res.status(400).json({
                success: false,
                msg: 'Invalid token'
            });
        }

        // Check if token has expired
        if (user.resetPasswordExpires < Date.now()) {
            console.log('Token has expired');
            return res.status(400).json({
                success: false,
                msg: 'Token has expired'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user
        const updatedUser = await User.findOneAndUpdate({ token }, { password: hashedPassword }, { new: true });

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Password reset successfully'
        });

    } catch (error) {
        console.log(error);
        console.log('Error in resetPassword');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}