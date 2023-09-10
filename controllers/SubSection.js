const Section = require('../models/Section');
const SubSection = require('../models/SubSection');
const uploadVideo = require('../utils/imageUploader');

// Create sub-section
exports.createSubSection = async (req, res) => {
    try {
        // Extract title, timeDuration, description, sectionId from request body
        const { title, timeDuration, description, sectionId } = req.body;

        // Extract video 
        const video = req.files.video;

        // Validate if fields are empty
        if (!title || !timeDuration || !description || !sectionId || !video) {
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

        // Upload video
        const videoUrl = await uploadVideo.uploadImage(video, process.env.CLOUDINARY_FOLDER_NAME);

        // Create sub-section
        const subSection = new SubSection({
            title,
            timeDuration,
            description,
            videoUrl
        });

        // Add sub-section to section's sub-sections
        section.subSections.push(subSection._id);
        await section.save();

        // Save sub-section
        await subSection.save();
        
        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Sub-section created successfully'
        });

    } catch (error) {
        console.log(error);
        console.log('Error in createSubSection');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Update sub-section
exports.updateSubSection = async (req, res) => {
    try {
        // Extract title, timeDuration, description, subSectionId from request body
        const { title, timeDuration, description, subSectionId } = req.body;
        const video = req.files.video;

        // Validate if fields are empty
        if (!title || !timeDuration || !description || !subSectionId) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if sub-section exists
        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            console.log('Sub-section not found');
            return res.status(400).json({
                success: false,
                msg: 'Sub-section not found'
            });
        }

        // Update title if changed
        if (subSection.title !== title) {
            subSection.title = title;
        }

        // Update timeDuration if changed
        if (subSection.timeDuration !== timeDuration) {
            subSection.timeDuration = timeDuration;
        }

        // Update description if changed
        if (subSection.description !== description) {
            subSection.description = description;
        }

        // Upload video and update videoUrl if changed
        if (video) {
            const videoUrl = await uploadVideo.uploadImage(video, process.env.CLOUDINARY_FOLDER_NAME);
            subSection.videoUrl = videoUrl;
        }

        // Save sub-section
        await subSection.save();

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Sub-section updated successfully'
        });

    } catch (error) {
        console.log(error);
        console.log('Error in updateSubSection');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Delete sub-section
exports.deleteSubSection = async (req, res) => {
    try {
        // Fetch sub-sectionId, sectionId from request body
        const { subSectionId, sectionId } = req.body;

        // Validate if fields are empty
        if (!subSectionId) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Check if sub-section exists
        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            console.log('Sub-section not found');
            return res.status(400).json({
                success: false,
                msg: 'Sub-section not found'
            });
        }

        // Delete sub-section from section's sub-sections
        const section = await Section.findById(sectionId);
        section.subSections.pull(subSectionId);
        await section.save();

        // Delete sub-section
        await SubSection.findByIdAndDelete(subSectionId);

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Sub-section deleted successfully'
        });

    } catch (error) {
        console.log(error);
        console.log('Error in deleteSubSection');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}