const mongoose = require('mongoose');
require('dotenv').config();

exports.connect = () => {
    try {
        mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to database');
    } catch (error) {
        console.log(error);
        console.log('Error in connecting to database');
        process.exit(1);
    }
}