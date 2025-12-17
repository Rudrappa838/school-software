const express = require('express');
const { authenticateToken, authorize } = require('../middleware/authMiddleware');
const {
    getVehicles, addVehicle, updateVehicle, deleteVehicle,
    getRoutes, addRoute, updateLocation, handleGpsWebhook
} = require('../controllers/transportController');

const router = express.Router();

// Public GPS Webhook (Placed BEFORE authentication middleware)
router.post('/gps/webhook', handleGpsWebhook);

router.use(authenticateToken);

// Vehicle Routes
router.get('/vehicles', authorize('SCHOOL_ADMIN', 'TRANSPORT_MANAGER'), getVehicles);
router.post('/vehicles', authorize('SCHOOL_ADMIN'), addVehicle);
router.put('/vehicles/:id', authorize('SCHOOL_ADMIN', 'TRANSPORT_MANAGER'), updateVehicle);
router.delete('/vehicles/:id', authorize('SCHOOL_ADMIN'), deleteVehicle);
router.put('/vehicles/:id/location', authorize('SCHOOL_ADMIN', 'DRIVER'), updateLocation);

// Route Routes
router.get('/routes', authorize('SCHOOL_ADMIN', 'TRANSPORT_MANAGER', 'PARENT', 'STUDENT'), getRoutes); // Parents need to see routes too
router.get('/my-route', authorize('STUDENT', 'DRIVER', 'PARENT'), require('../controllers/transportController').getMyRoute);
router.post('/routes', authorize('SCHOOL_ADMIN'), addRoute);

module.exports = router;
