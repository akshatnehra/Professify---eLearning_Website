const cloudinary = require('cloudinary').v2;

// Configure cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Upload image to cloudinary
exports.uploadImage = async (file, folder, height, quality) => {
    try {
        const options = { folder };
        if(height) {
            options.transformation = [{ height }];
        }

        if(quality) {
            options.quality = quality;
        }
        options.resource_type = 'auto';

        const result = await cloudinary.uploader.upload(file, options);
        return result.secure_url; 
    } catch (error) {
        console.log(error);
        console.log('Error in uploadImage');
        return res.status(500).json({
            success: false,
            msg: 'Internal Server Error'
        });
    }
}