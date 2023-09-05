const Tag = require('../models/Tag');

// Create tag
exports.createTag = async (req, res) => {
    try {
        // Extract name, description from request body
        const { name, description } = req.body;

        // Validate if fields are empty
        if (!name || !description) {
            console.log('Please enter all fields');
            return res.status(400).json({
                success: false,
                msg: 'Please enter all fields'
            });
        }

        // Create tag
        const tag = new Tag({
            name,
            description,
        });
        await tag.save();

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Tag created successfully'
        });

    } catch (error) {
        console.log(error);
        console.log('Error in createTag');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}

// Get all tags
exports.getAllTags = async (req, res) => {
    try {
        // Get all tags
        const tags = await Tag.find({}, { name: true, description: true }); 
        if (!tags) {
            console.log('No tags found');
            return res.status(400).json({
                success: false,
                msg: 'No tags found'
            });
        }

        // Return success message
        return res.status(200).json({
            success: true,
            msg: 'Tags fetched successfully',
            tags
        });

    } catch (error) {
        console.log(error);
        console.log('Error in getAllTags');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}