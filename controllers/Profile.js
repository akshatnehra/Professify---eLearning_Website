const Profile = require('../models/Profile');
const User = require('../models/User');
const {uploadImage} = require('../utils/imageUploader');
const { format, parse } = require('date-fns');

// Update profile
exports.updateProfile = async (req, res) => {
    try {
        // Extract profileData from request body
        const { gender, dateOfBirth="", about="", contactNumber } = req.body;
        const parsedDateOfBirth = parse(dateOfBirth, 'dd.MM.yyyy', new Date());

        // Extratc userId from request 
        const userId = req.user.id;

        // Validate if fields are empty
        if(!gender || !contactNumber || !userId) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if(!user) {
            console.log('User not found');
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            });
        }

        // Get user profile
        const userProfile = await Profile.findById(user.additionalDetails);

        // Update profile
        userProfile.dateOfBirth = parsedDateOfBirth;
        userProfile.gender = gender;
        userProfile.about = about;
        userProfile.contactNumber = contactNumber;
        await userProfile.save();

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Profile updated successfully',
            userProfile
        });

    } catch (error) {
        console.log(error);
        console.log('Error in updateProfile');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Delete Account
exports.deleteAccount = async (req, res) => {
    try {
        // Extract userId from request
        console.log(req);
        const userId = req.user.id;

        // Validate if fields are empty
        if(!userId) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if(!user) {
            console.log('User not found');
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            });
        }

        // Delete additional details
        await Profile.findByIdAndDelete(user.additionalDetails);

        // Unenroll user from all courses
        // 1. Get all courses of user from user.courses
        const courses = user.courses;


        // 2. For each course, delete user from course.students if courses.length > 0
        if(courses) {
            courses.forEach(async (courseId) => {
                const course = await Course.findById(courseId);
                course.students.pull(userId);
                await course.save();
            });
        }
        
        // Delete user
        await User.findByIdAndDelete(userId);

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Account deleted successfully'
        });

    } catch (error) {
        console.log(error);
        console.log('Error in deleteAccount');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Get all user details
exports.getAllUserDetails = async (req, res) => {
    try {
        // Extract userId from request
        const userId = req.user.id;

        // Validate if fields are empty
        if(!userId) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if(!user) {
            console.log('User not found');
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            });
        }

        // Get user details
        const userDetails = await User.findById(userId).populate('additionalDetails');

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'User details fetched successfully',
            userDetails
        });
    } catch (error) {
        console.log(error);
        console.log('Error in getAllUserDetails');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Change profile picture
exports.changeProfilePicture = async (req, res) => {
    try {
        // Extract userId from request
        const userId = req.user.id;

        // Extract profilePicture from request file
        const profilePicture = req.files.displayPicture;

        // Validate if fields are empty
        if(!userId || !profilePicture) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if(!user) {
            console.log('User not found');
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            });
        }

        // upload image to cloudinary
        const image = await uploadImage(profilePicture, process.env.CLOUDINARY_FOLDER_NAME);

        // Update profile picture in user
        user.image = image;

        return res.status(200).json({
            success: true,
            msg: 'Profile picture updated successfully',
            image
        });

    } catch (error) {
        console.log(error);
        console.log('Error in changeProfilePicture');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Get enrolled courses
exports.getEnrolledCourses = async (req, res) => {
    try {
        // Extract userId from request
        const userId = req.user.id;

        // Validate if fields are empty
        if(!userId) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if(!user) {
            console.log('User not found');
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            });
        }

        // Get enrolled courses
        const enrolledCourses = await User.findById(userId).populate({
            path: 'courses',
            populate: {
                path: 'courseInstructor',
                select: 'name'
            }
        });

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Enrolled courses fetched successfully',
            enrolledCourses
        });

    } catch (error) {
        console.log(error);
        console.log('Error in getEnrolledCourses');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}