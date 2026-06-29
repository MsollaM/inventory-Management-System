const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roles = require('../middleware/roles');
const { getDashboardStats } = require('../controllers/reportController');

router.get('/dashboard', auth, roles('admin', 'store_manager'), getDashboardStats);

module.exports = router;