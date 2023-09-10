const express = require('express');
const router = express.Router();
const { auth } = require('../middlewares/auth');
const {
    deleteAccount,
    updateProfile,
    getAllUserDetails,
    changeProfilePicture,
    getEnrolledCourses
} = require('../controllers/Profile');

// Delete account
router.delete('/deleteProfile', auth, deleteAccount);

// Update profile
router.put('/updateProfile', auth, updateProfile);

// Get user details
router.get('/getUserDetails', auth, getAllUserDetails);

// Change profile picture
router.put('/changeProfilePicture', auth, changeProfilePicture);

// Get enrolled courses
router.get('/getEnrolledCourses', auth, getEnrolledCourses);

module.exports = router;