const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
exports.connect = () => {
    mongoose.connect(process.env.MONGODB_CONNECTION_STRING)
    .then(() => {
        console.log('MongoDB connected...');
    })
    .catch(err => {
        console.log(err);
        console.log('Error connecting to MongoDB');
        process.exit(1);
    });
}
