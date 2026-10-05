const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');
const { protect } = require('../middleware/auth');

// @desc    Get all crops
// @route   GET /api/crops
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { season } = req.query;
    const query = season ? { season } : {};
    const crops = await Crop.find(query).sort({ name: 1 });
    
    res.json({
      success: true,
      count: crops.length,
      crops
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single crop
// @route   GET /api/crops/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const crop = await Crop.findById(req.params.id);
    if (!crop) {
      return res.status(404).json({ message: 'Crop not found' });
    }
    res.json({
      success: true,
      crop
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create crop (Admin only)
// @route   POST /api/crops
// @access  Private/Admin
router.post('/', protect, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    const crop = await Crop.create(req.body);
    res.status(201).json({
      success: true,
      crop
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;


