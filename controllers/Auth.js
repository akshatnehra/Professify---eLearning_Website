const User = require('../models/User');
const OTP = require('../models/OTP');
const otpGenerator = require('otp-generator');
const bcrypt = require('bcrypt');
const Profile = require('../models/Profile');
const jwt = require('jsonwebtoken');
const mailSender = require('../utils/mailSender');

// Send OTP to user's email
exports.sendOTP = async (req, res) => {
    try {
        // Extract email from request body
        const { email } = req.body;
        
        // Check if user exists
        const isUserPresent = await User.findOne({ email });
        if (isUserPresent) {
            console.log('User already registered');
            return res.status(400).json({ 
                success: false, 
                msg: 'User already registered' 
            });
        }

        // Generate OTP
        const generatedOTP = otpGenerator.generate(6, { 
            upperCaseAlphabets: false,
            lowerCaseAlphabets: false,
            specialChars: false
        });
        console.log("OTP : " + generatedOTP);

        // Save OTP to database
        const otp = new OTP({
            email,
            otp: generatedOTP,
            createdAt: Date.now(),
        });
        await otp.save();
        console.log(otp);

        // Return success message
        return res.status(200).json({ 
            success: true,
            msg: 'OTP sent successfully'
         });
    } catch (error) {
        console.log(error);
        console.log('Error in sending OTP');
        return res.status(500).json({ msg: 'Internal Server Error' });
    }
}

// Signup user
exports.signup = async (req, res) => {
    try {
        // Extract userData from request body
        const {
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            otp,
            accountType,
            contactNumber
        } = req.body;

        // Validate userData
        if(!firstName || !lastName || !email || !password || !confirmPassword || !otp || !accountType || !contactNumber) {
            console.log('Please enter all fields');
            return res.status(400).json({ 
                success: false, 
                msg: 'Please enter all fields' 
            });
        }

        // Validate password and confirmPassword
        if(password !== confirmPassword) {
            console.log('Passwords do not match');
            return res.status(400).json({
                success: false,
                msg: 'Passwords do not match'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (user) {
            console.log('User already registered');
            return res.status(400).json({
                success: false,
                msg: 'User already registered'
            });
        }

        // Get most recent OTP for the user
        const mostRecentOTP = await OTP.findOne({ email }).sort({ createdAt: -1 }).limit(1);
        console.log(mostRecentOTP);

        // Check if OTP is valid
        if(mostRecentOTP.length === 0) {
            console.log('OTP not found');
            return res.status(400).json({
                success: false,
                msg: 'OTP not found'
            });
        }

        // Check if OTP is expired
        if (Date.now() - mostRecentOTP.createdAt > 5*60*1000) {
            console.log('OTP expired');
            return res.status(400).json({
                success: false,
                msg: 'OTP expired'
            });
        }

        // Check if OTP is correct
        console.log(mostRecentOTP.otp);
        if (mostRecentOTP.otp !== otp) {
            console.log('Invalid OTP');
            return res.status(400).json({
                success: false,
                msg: 'Invalid OTP'
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create new profile
        const newProfile = new Profile({
            gender: null,
            dateOfBirth: null,
            about: null,
            contactNumber
        });
        // Save profile to database
        await newProfile.save();

        // Create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            accountType,
            contactNumber,
            additionalDetails: newProfile._id
        });

        // Save user to database
        await newUser.save();

        // Return response
        return res.status(200).json({
            success: true,
            msg: 'User registered successfully',
            user: newUser
        });
    } catch (error) {
        console.log(error);
        console.log('Error in signing up user');
        return res.status(500).json({ msg: 'Internal Server Error, user cannot be registered.' });
    }
}

// Login user
exports.login = async (req, res) => {
    try {
        // Get email and password from request body
        const { email, password } = req.body;

        // Validate email and password
        if(!email || !password) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false, 
                msg: 'Please enter all fields'
            });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if(!user) {
            console.log('User not registered');
            return res.status(400).json({
                success: false,
                msg: 'User not registered'
            });
        }

        // Check if password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect) {
            console.log('Invalid credentials');
            return res.status(400).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }

        // Generate JWT token
        const payload = {
            email: user.email,
            id: user._id,
            role: user.accountType
        }

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: '2h'
        });
        user.token = token;
        user.password = undefined;
         
        // Create cookie and send response
        res.cookie('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3*24*60*60*1000) // 3 days
        }).status(200).json({
            success: true,
            msg: 'User logged in successfully',
            user,
            token
        });

    } catch (error) {
        console.log(error);
        console.log('Error in logging in user');
        return res.status(500).json({ msg: 'Internal Server Error, user cannot be logged in.' });       
    }
}

// Change password
exports.changePassword = async (req, res) => {
    try {
        // Get email, oldPassword and newPassword from request body
        const { email, oldPassword, newPassword, confirmPassword } = req.body;

        // Validate email, oldPassword and newPassword
        if(!email || !oldPassword || !newPassword || !confirmPassword) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Validate newPassword and confirmPassword
        if(newPassword !== confirmPassword) {
            console.log('Passwords do not match');
            return res.status(400).json({
                success: false,
                msg: 'Passwords do not match'
            });
        }

        // Check if user exists
        if(!User.findOne({ email })) {
            console.log('User not registered');
            return res.status(400).json({
                success: false,
                msg: 'User not registered'
            });
        }

        // Check if oldPassword is correct
        if(!await bcrypt.compare(oldPassword, user.password)) {
            console.log('Invalid credentials');
            return res.status(400).json({
                success: false,
                msg: 'Invalid credentials'
            });
        }

        // Hash newPassword
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password
        const user = await User.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });

        // Send email to user using mailSender it takes 3 parameters email, subject, body
        mailSender(user.email, 'Password Changed', "<h1>Your password has been changed successfully</h1>");

        // Return response
        return res.status(200).json({
            success: true,
            msg: 'Password changed successfully'
        });

    } catch (error) {
        console.log(error);
        console.log('Error in changing password');
        return res.status(500).json({ 
            success: false,
            msg: 'Internal Server Error, password cannot be changed.' });
    }
}