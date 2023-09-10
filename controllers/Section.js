const Course = require('../models/Course');
const Section = require('../models/Section');

// Create section
exports.createSection = async (req, res) => {
    try {
        // Extract sectionName, courseId from request body
        const { sectionName, courseId } = req.body;
        
        // Validate if fields are empty
        if (!sectionName || !courseId) {
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

        // Create section
        const section = await Section.create({ sectionName });
        
        // Add section to course's sections
        course.sections.push(section._id);
        await course.save();

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Section created successfully'
        });
    } catch (error) {
        console.log(error);
        console.log('Error in createSection');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Update section
exports.updateSection = async (req, res) => {
    try {
        // Extract sectionId, sectionName from request body
        const { sectionId, sectionName } = req.body;

        // Validate if fields are empty
        if (!sectionId || !sectionName) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if section exists
        const section = await Section.findById(sectionId);
        if (!section) {
            console.log('Section not found');
            return res.status(400).json({
                success: false,
                msg: 'Section not found'
            });
        }

        // Update section
        section.sectionName = sectionName;
        await section.save();

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Section updated successfully'
        });
         
    } catch (error) {
        console.log(error);
        console.log('Error in updateSection');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Delete section
exports.deleteSection = async (req, res) => {
    try {
        // Extract sectionId from request 
        const { sectionId, courseId } = req.body;

        // Validate if fields are empty
        if (!sectionId || !courseId) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if section exists
        const section = await Section.findById(sectionId);
        if (!section) {
            console.log('Section not found');
            return res.status(400).json({
                success: false,
                msg: 'Section not found'
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

        // Delete section from course's sections
        course.sections.pull(sectionId);
        await course.save();

        // Delete section
        await Section.findByIdAndDelete(sectionId);

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Section deleted successfully'
        });

    } catch (error) {
        console.log(error);
        console.log('Error in deleteSection');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}