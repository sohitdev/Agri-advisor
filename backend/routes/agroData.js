const express = require('express');
const router = express.Router();
const {
  createAgroData,
  getAgroData,
  uploadFile,
  listLocations,
  upload
} = require('../controllers/agroDataController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.get('/', authorize('admin'), listLocations);
router.post('/', authorize('admin'), createAgroData);
router.get('/:state/:district', getAgroData);
router.post('/upload', authorize('admin'), upload.single('file'), uploadFile);

module.exports = router;


