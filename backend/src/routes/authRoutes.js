const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

router.post('/login', login);
router.post('/setup-admin', require('../controllers/authController').setupSuperAdmin);

module.exports = router;
