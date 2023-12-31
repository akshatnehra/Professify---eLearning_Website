const mongoose = require('mongoose');
require('dotenv').config();

// Section Schema
const SectionSchema = mongoose.Schema({
    sectionName: {
        type: String,
        trim: true,
    },
    subSections: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubSection',
    }],
});

module.exports = mongoose.model('Section', SectionSchema);
