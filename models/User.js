const mongoose = require('mongoose');

// User Schema
const UserSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        trim: true,
    },
    lastName: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    }, 
    accountType: {
        type: String,
        required: true,
        enum: ["Admin", "Student", "Instructor"],
    },
    additionalDetails: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Profile',
        required: true,
    },
    courses: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course',
        } 
    ],
    image: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg",
    },
    courseProgress: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'CourseProgress',
        }
    ],
    token: {
        type: String,
    },
    resetPasswordExpires: {
        type: Date,
    }

});

module.exports = mongoose.model('User', UserSchema);