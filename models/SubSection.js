const mongoose = require('mongoose');
require('dotenv').config();

// SubSection Schema
const SubSectionSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    timeDuration: {
        type: Number,
    },
    description: {
        type: String,
    },
    videoUrl: {
        type: String,
    },
});

module.exports = mongoose.model('SubSection', SubSectionSchema);
