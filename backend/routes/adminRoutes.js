const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const adminController = require('../controllers/adminController');

router.get('/stats', auth, adminController.getDashboardStats);
router.get('/users', auth, adminController.getAllUsers);

module.exports = router;
