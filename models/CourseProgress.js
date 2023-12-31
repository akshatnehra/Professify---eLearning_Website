const mongoose = require('mongoose');
require('dotenv').config();

// CourseProgress Schema
const CourseProgressSchema = mongoose.Schema({
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    },
    completedVideos: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSection',
    }
});
