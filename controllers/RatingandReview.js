const RatingandReview = require('../models/RatingAndReview');
const Course = require('../models/Course');

// Create rating and review
exports.createRatingandReview = async (req, res) => {
    try {
        // Extract courseId, rating, review, userid from request body
        const { courseId, rating, review, userId } = req.body;

        // Validate if fields are empty
        if (!courseId || !rating || !review || !userId) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId);
        if (!course) {
            console.log('Course not found');
            return res.status(400).json({
                success: false,
                msg: 'Course not found'
            });
        }

        // Check if user exists
        const user = await User.findById(userId);
        if (!user) {
            console.log('User not found');
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            });
        }

        // Check if user has purchased the course
        if (!user.courses.includes(courseId)) {
            console.log('User has not purchased the course');
            return res.status(400).json({
                success: false,
                msg: 'User has not purchased the course'
            });
        }

        // Check if user has already rated and reviewed the course
        if (course.ratingAndReviews.includes(userId)) {
            console.log('User has already rated and reviewed the course');
            return res.status(400).json({
                success: false,
                msg: 'User has already rated and reviewed the course'
            });
        } 

        // Create rating and review
        const ratingandreview = await RatingandReview.create({ rating, review });

        // Add rating and review to course's rating and reviews
        course.ratingAndReviews.push(ratingandreview._id);
        await course.save();

        // Add user to rating and review's users
        ratingandreview.users.push(userId);
        await ratingandreview.save();

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Rating and review created successfully'
        });
    } catch (error) {
        console.log(error);
        console.log('Error in createRatingandReview');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Get average rating of a course
exports.getAverageRating = async (req, res) => {
    try {
        // Extract courseId from request body
        const { courseId } = req.body;

        // Validate if fields are empty
        if (!courseId) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId).populate('ratingAndReviews');
        if (!course) {
            console.log('Course not found');
            return res.status(400).json({
                success: false,
                msg: 'Course not found'
            });
        }

        // Calculate average rating
        let sum = 0;
        course.ratingAndReviews.forEach(ratingandreview => {
            sum += ratingandreview.rating;
        });

        // Check if course has no ratings and reviews
        if (course.ratingAndReviews.length === 0) {
            console.log('Course has no ratings and reviews');
            return res.status(400).json({
                success: false,
                msg: 'Course has no ratings and reviews'
            });
        }

        const averageRating = sum / course.ratingAndReviews.length;

        // Return success message
        return res.status(200).json({
            success: true,
            averageRating
        });

    } catch (error) {
        console.log(error);
        console.log('Error in getAverageRating');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Get all ratings and reviews of a course
exports.getAllRatingsandReviews = async (req, res) => {
    try {
        // Extract courseId from request body
        const { courseId } = req.body;

        // Validate if fields are empty
        if (!courseId) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if course exists
        const course = await Course.findById(courseId).populate({
            path: 'ratingAndReviews',
            populate: {
                path: 'users', 
                select: 'firstName lastName email image'
            }
        });
        if (!course) {
            console.log('Course not found');
            return res.status(400).json({
                success: false,
                msg: 'Course not found'
            });
        }

        // Return success message
        return res.status(200).json({
            success: true,
            ratingandreviews: course.ratingAndReviews
        });

    } catch (error) {
        console.log(error);
        console.log('Error in getAllRatingsandReviews');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}