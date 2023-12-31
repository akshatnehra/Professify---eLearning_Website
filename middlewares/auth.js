const jwt = require('jsonwebtoken');
require('dotenv').config();
const User = require('../models/User');

// Auth middleware
exports.auth = async (req, res, next) => {
    try {
        // Extract token from request header
        const token = req.cookies.token || req.body.token || req.query.token || req.header('Authorization').replace('Bearer ', '');
        console.log(token);

        // If token is not present
        if (!token) {
            console.log('Token not present');
            return res.status(401).json({
                success: false,
                msg: 'Unauthorized'
            });
        }

        // Verify token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decoded);
            req.user = decoded; 
        } catch (error) {
            console.log(error);
            console.log('Error in verifying token');
            return res.status(401).json({
                success: false,
                msg: 'Unauthorized'
            });
        }
        next(); 

    } catch (error) {
        console.log(error);
        console.log('Error in auth middleware');
        return res.status(500).json({ 
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// isStudent middleware
exports.isStudent = async (req, res, next) => {
    try {

        // Check if user is student
        if(req.user.role !== 'Student') {
            console.log('User is not a student');
            return res.status(403).json({
                success: false,
                msg: 'Forbidden: this route is only for students'
            });
        }
        next();
    
    } catch (error) {
        console.log(error);
        console.log('Error in isStudent middleware');
        return res.status(500).json({ 
            success: false,
            msg: 'Internal Server Error'
        });     
    }
}

// isInstructor middleware
exports.isInstructor = async (req, res, next) => {
    try {
        
        // Check if user is instructor
        if(req.user.role !== 'Instructor') {
            console.log('User is not an instructor');
            return res.status(403).json({
                success: false,
                msg: 'Forbidden: this route is only for instructors'
            });
        }
        next();

    } catch (error) {
        console.log(error);
        console.log('Error in isInstructor middleware');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// isAdmin middleware
exports.isAdmin = async (req, res, next) => {

    // Check if user is admin
    if(req.user.role !== 'Admin') {
        console.log('User is not an admin');
        return res.status(403).json({
            success: false,
            msg: 'Forbidden: this route is only for admins'
        });
    }
    next();
     
}