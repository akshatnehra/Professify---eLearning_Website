const mongoose = require('mongoose');
require('dotenv').config();

// Profile Schema
const ProfileSchema = mongoose.Schema({
    gender: {
        type: String,
        trim: true,
    },
    dateOfBirth: {
        type: Date,
    },
    about: {
        type: String,
        trim: true,
    },
    contactNumber: {
        type: Number,
        trim: true,
    }
});

module.exports = mongoose.model('Profile', ProfileSchema);
