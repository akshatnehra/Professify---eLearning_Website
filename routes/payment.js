const express = require('express');
const router = express.Router();

const { capturePayment, verifyPayment } = require('../controllers/Payment');
const { auth, isStudent, isInstructor, isAdmin } = require('../middlewares/auth');

// Capture payment
router.post('/capturePayment', auth, isStudent, capturePayment);

// Verify payment
router.post('/verifyPayment', verifyPayment);

module.exports = router;