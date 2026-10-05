const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/auth');
const { getMarketPrices, getAvailableMarketLocations } = require('../controllers/marketPriceController');

router.get('/available-locations', protect, getAvailableMarketLocations);
router.get('/', protect, getMarketPrices);

module.exports = router;
