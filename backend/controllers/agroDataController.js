const Location = require('../models/Location');
const Crop = require('../models/Crop');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = process.env.UPLOAD_PATH || './uploads';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['.csv', '.xlsx', '.xls'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only CSV and Excel files are allowed.'));
  }
};

exports.upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB
  },
  fileFilter
});

// @desc    Create/Update location agro-data
// @route   POST /api/agro-data
// @access  Private (Admin)
exports.createAgroData = async (req, res, next) => {
  try {
    const { state, district, soilData, weatherData, cropYieldHistory } = req.body;

    const location = await Location.findOneAndUpdate(
      { state, district },
      {
        state,
        district,
        soilData,
        weatherData,
        cropYieldHistory
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    res.json({
      success: true,
      location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get location agro-data
// @route   GET /api/agro-data/:state/:district
// @access  Private
exports.getAgroData = async (req, res, next) => {
  try {
    const { state, district } = req.params;
    const location = await Location.findOne({ state, district });

    if (!location) {
      return res.status(404).json({ message: 'Location data not found' });
    }

    res.json({
      success: true,
      location
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Upload CSV/Excel file
// @route   POST /api/agro-data/upload
// @access  Private (Admin)
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // TODO: Process CSV/Excel file and import data
    // This would require additional libraries like csv-parser or xlsx
    
    res.json({
      success: true,
      message: 'File uploaded successfully',
      file: req.file.filename,
      note: 'File processing needs to be implemented'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    List all locations
// @route   GET /api/agro-data
// @access  Private (Admin)
exports.listLocations = async (req, res, next) => {
  try {
    const locations = await Location.find()
      .select('state district weatherData.lastUpdated')
      .sort({ state: 1, district: 1 });

    res.json({
      success: true,
      count: locations.length,
      locations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


