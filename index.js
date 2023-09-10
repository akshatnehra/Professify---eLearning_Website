const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const dotenv = require('dotenv');

// Import routes
const courseRoute = require('./routes/course');
const userRoute = require('./routes/user');
const paymentRoute = require('./routes/payment');
const profileRoute = require('./routes/profile');

// Database
const database = require('./config/database');

// Cloudinary
const cloudinary = require('./config/cloudinary');

// dotenv
dotenv.config();

// PORT
const PORT = process.env.PORT || 5000;

// Connect to database
database.connect();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(fileUpload({ 
    useTempFiles: true,
    tempFileDir: '/tmp/'
}));

// Connect to cloudinary
cloudinary.connect();

// Routes
app.use('/api/v1/course', courseRoute);
app.use('/api/v1/auth', userRoute);
app.use('/api/v1/payment', paymentRoute);
app.use('/api/v1/profile', profileRoute);

// Default route
app.get('/', (req, res) => {
    return res.json({
        success: true,
        msg: 'Welcome to the e-learning API'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

