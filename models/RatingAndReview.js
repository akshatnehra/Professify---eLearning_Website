const mongoose = require('mongoose');
require('dotenv').config();

// RatingAndReview Schema
const RatingAndReviewSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    review: {
        type: String,
        trim: true,
        required: true,
    },
});

module.exports = mongoose.model('RatingAndReview', RatingAndReviewSchema);
