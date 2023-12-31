const mongoose = require('mongoose');
require('dotenv').config();

// Course Schema
const CourseSchema = mongoose.Schema({
    courseName: {
        type: String,
        trim: true,
    },
    courseDescription: {
        type: String,
        trim: true,
    },
    courseInstructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    whatYouWillLearn: {
        type: String,
        trim: true,
    },
    courseContent: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
    }],
    ratingAndReviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'RatingandReview',
    }],
    coursePrice: {
        type: Number,
        required: true,
    },
    thumbnail: {
        type: String,
        default: 'https://ditrpindia.com/images/defaultcourse.jpg'
    },
    tag: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag',
    }],
    studentsEnrolled: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }],
    sections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Section',
    }],
});

module.exports = mongoose.model('Course', CourseSchema);
