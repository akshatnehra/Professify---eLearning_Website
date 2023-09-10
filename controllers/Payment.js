const { instance } = require('../config/razorpay');
const Course = require('../models/Course');
const User = require('../models/User');
const mailSender = require('../utils/mailSender');
const crypto = require('crypto');
const courseTemplate = require('../mail/template/coursePurchase');

// Capture the payment and initiate the razorpay payment
exports.capturePayment = async (req, res) => {
    try {
        // Extract courseId and userId from request body
        const { courseId } = req.body;

        // Extract userId from request
        const userId = req.user.id;

        // Validate if fields are empty
        if (!courseId || !userId) {
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

        // Check if user has already purchased the course
        if (user.courses.includes(courseId)) {
            console.log('User has already purchased the course');
            return res.status(400).json({
                success: false,
                msg: 'User has already purchased the course'
            });
        }

        // Create order
        const order = await instance.orders.create({
            amount: course.coursePrice * 100,
            currency: 'INR',
            receipt: `receipt_${courseId}_${userId}`,
            notes: {
                courseId,
                userId
            }
        });
        console.log(order);

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Order created successfully',
            order
        });

    } catch (error) {
        console.log(error);
        console.log('Error in capturePayment');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Verify the payment
exports.verifyPayment = async (req, res) => {
    try {
        // Get webhook secret from environment variables
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

        // Get razorpay signature from request headers
        const razorpaySignature = req.headers['x-razorpay-signature'];

        // HMAC SHA256 algorithm
        const shasum = crypto.createHmac('sha256', webhookSecret);

        // Stringlyfy the request body
        shasum.update(JSON.stringify(req.body));

        // Create digest
        const digest = shasum.digest('hex');

        // Compare digest with razorpay signature
        if (digest !== razorpaySignature) {
            console.log('Transaction not legit');
            return res.status(400).json({
                success: false,
                msg: 'Transaction not legit'
            });
        }

        // Extract courseId and userId from request body
        const { courseId, userId } = req.body.payload.payment.entity.notes;

        // Add course to user's courses
        const user = await User.findById(userId);
        user.courses.push(courseId);
        await user.save();

        // Add user to course's students
        const course = await Course.findById(courseId);
        course.students.push(userId);
        await course.save();

        // Prepare email body
        const emailBody = courseTemplate.coursePurchaseTemplate(user.name, course.courseName, course.courseInstructor);

        // Send mail to user
        await mailSender(
            user.email, 
            'Your Learning Journey Begins: Course Purchase Confirmation at Professify 📚', 
            emailBody
        );

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Payment verified successfully'
        });

    } catch (error) {
        console.log(error);
        console.log('Error in verifyPayment');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}