const mongoose = require('mongoose');
require('dotenv').config();

// Tag Schema
const TagSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
    },
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
    }]
});

module.exports = mongoose.model('Tag', TagSchema);