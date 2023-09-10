const Course = require('../models/Course');
const User = require('../models/User');
const Tag = require('../models/Tag');
const { uploadImage } = require('../utils/imageUploader');

// Create course
exports.createCourse = async (req, res) => {
    try {
        // Extract courseName, courseDescription, whatYouWillLearn, coursePrice, tag, image from request body
        const { courseName, courseDescription, whatYouWillLearn, coursePrice, tag } = req.body;

        // Fetch image
        const thumbnail = req.files.thumbnail;

        // Validate if fields are empty
        if (!courseName || !courseDescription || !whatYouWillLearn || !coursePrice || !tag || !thumbnail) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if the user is an instructor
        const userDetails = await User.findById(req.user.id);
        if(!userDetails) {
            console.log('User not found');
            return res.status(400).json({
                success: false,
                msg: 'User not found'
            });
        }
        
        // Check if tag exists
        const tagDetails = await Tag.findById(tag);
        if (!tagDetails) {
            console.log('Tag not found');
            return res.status(400).json({
                success: false,
                msg: 'Tag not found'
            });
        }

        // Upload image
        const thumbnailUrl = await uploadImage(thumbnail, process.env.COURSE_THUMBNAIL_BUCKET);

        // Create course
        const course = new Course({
            courseName,
            courseDescription,
            whatYouWillLearn,
            coursePrice,
            tag,
            thumbnail: thumbnailUrl,
            courseInstructor: req.user.id,
            sections: []
        });
        await course.save();

        // Add course to instructor's courses
        userDetails.courses.push(course._id);
        await userDetails.save();

        // Update tag with course
        tagDetails.courses.push(course._id);
        await tagDetails.save();

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Course created successfully'
        });
    } catch (error) {
        console.log(error);
        console.log('Error in createCourse');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Get all courses
exports.getAllCourses = async (req, res) => {
    try {
        // Get all courses
        const courses = await Course.find({}, { 
            courseName: true, 
            ratingAndReviews: true, 
            coursePrice: true, 
            studentsEnrolled: true, 
            thumbnail: true, 
            courseInstructor: true
        }).populate("courseInstructor");
        if (!courses) {
            console.log('No courses found');
            return res.status(400).json({
                success: false,
                msg: 'No courses found'
            });
        }

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Courses fetched successfully',
            courses
        });

    } catch (error) {
        console.log(error);
        console.log('Error in getAllCourses');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Get course details
exports.getCourseDetails = async (req, res) => {
    try {
        // Get courseId from request body
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
            path: 'courseInstructor',
            populate: {
                path: 'additionalDetails'
            }
        })
        .populate({
            path: 'sections',
            populate: {
                path: 'subSections',
            }
        })
        .populate({
            path: 'tag',
            populate: {
                path: 'courses'
            }
        })
        .populate('ratingAndReviews')
        // .populate('sections')
        .exec();

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
            msg: 'Course fetched successfully',
            course
        });
    } catch (error) {
        console.log(error);
        console.log('Error in getCourseDetails');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}