const axios = require('axios');
const Location = require('../models/Location');
const Crop = require('../models/Crop');
const Recommendation = require('../models/Recommendation');
const { calculateCropEconomics } = require('../utils/cropEconomics');

const normalizeLocationPart = (value) => String(value || '').trim();

/**
 * Resolve latitude/longitude for a given state and district.
 * Priority:
 *  1. Use coordinates stored in Location document
 *  2. Fallback to Open-Meteo geocoding API (no API key required)
 */
const resolveCoordinates = async (locationDoc, state, district) => {
  if (locationDoc?.coordinates?.latitude && locationDoc?.coordinates?.longitude) {
    return {
      latitude: locationDoc.coordinates.latitude,
      longitude: locationDoc.coordinates.longitude
    };
  }

  // Fallback to geocoding API
  const geoUrl = 'https://geocoding-api.open-meteo.com/v1/search';
  const params = {
    name: district,
    count: 1,
    language: 'en',
    format: 'json',
    country: 'India'
  };

  const { data } = await axios.get(geoUrl, { params, timeout: 8000 });

  if (!data.results || data.results.length === 0) {
    throw new Error(`Could not resolve coordinates for ${district}, ${state}`);
  }

  const bestMatch = data.results[0];
  return {
    latitude: bestMatch.latitude,
    longitude: bestMatch.longitude
  };
};

/**
 * Fetch recent and short-term forecast weather using Open-Meteo.
 * This requires only coordinates and returns simple averages.
 */
const fetchWeatherFromOpenMeteo = async (latitude, longitude) => {
  const url = 'https://api.open-meteo.com/v1/forecast';
  const params = {
    latitude,
    longitude,
    hourly: ['temperature_2m', 'relativehumidity_2m', 'precipitation'].join(','),
    daily: ['temperature_2m_max', 'temperature_2_2m_min', 'precipitation_sum'].join(','),
    past_days: 2,
    forecast_days: 3,
    timezone: 'auto'
  };

  const { data } = await axios.get(url, { params, timeout: 8000 });

  const temps = data.hourly?.temperature_2m || [];
  const humidities = data.hourly?.relativehumidity_2m || [];
  const precip = data.hourly?.precipitation || [];

  const avg = (arr) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);

  return {
    avgTemperature: avg(temps) ?? 25,
    avgRainfall: avg(precip) ?? 5,
    avgHumidity: avg(humidities) ?? 60
  };
};

/**
 * Build soil snapshot from Location document.
 * If any value is missing, fill with reasonable defaults.
 */
const buildSoilSnapshot = (location) => {
  const soil = location?.soilData || {};

  return {
    ph: soil.ph?.mean ?? 6.5,
    organicCarbon: soil.organicCarbon?.mean ?? 0.8,
    nitrogen: soil.nitrogen?.mean ?? 120,
    phosphorus: soil.phosphorus?.mean ?? 25,
    potassium: soil.potassium?.mean ?? 180
  };
};

/**
 * Core recommendation pipeline used by both legacy and new routes.
 */
const runRecommendationPipeline = async ({ userId, state, district, season, useRealtimeWeather = false }) => {
  if (!state || !district || !season) {
    const error = new Error('Please provide state, district, and season');
    error.statusCode = 400;
    throw error;
  }

  const normalizedState = normalizeLocationPart(state);
  const normalizedDistrict = normalizeLocationPart(district);

  const location = await Location.findOne({
    state: new RegExp(`^${normalizedState.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
    district: new RegExp(`^${normalizedDistrict.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')
  });

  if (!location) {
    const error = new Error(
      'Location data not found. Please ensure data has been processed for this district.'
    );
    error.statusCode = 404;
    throw error;
  }

  // Soil snapshot from DB
  const soilSnapshot = buildSoilSnapshot(location);

  // Weather: either use stored aggregates or real-time from Open-Meteo
  let weatherSnapshot;
  if (useRealtimeWeather) {
    const { latitude, longitude } = await resolveCoordinates(location, normalizedState, normalizedDistrict);
    weatherSnapshot = await fetchWeatherFromOpenMeteo(latitude, longitude);
  } else {
    const weather = location.weatherData || {};
    weatherSnapshot = {
      avgTemperature: weather.avgTemperature?.mean ?? 25,
      avgRainfall: weather.avgRainfall?.mean ?? 800,
      avgHumidity: weather.avgHumidity?.mean ?? 60
    };
  }

  const mlPayload = {
    state: normalizedState,
    district: normalizedDistrict,
    season,
    soil: soilSnapshot,
    weather: weatherSnapshot
  };

  let mlResponse;
  try {
    mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict`,
      mlPayload,
      { timeout: 10000 }
    );
  } catch (error) {
    console.error('ML Service Error:', error.message);
    const err = new Error('ML service unavailable. Please try again later.');
    err.statusCode = 503;
    throw err;
  }

  const predictions = mlResponse.data.recommendations || [];

  const recommendations = await Promise.all(
    predictions.map(async (pred) => {
      const crop = await Crop.findOne({ name: pred.cropName });
      return {
        crop: crop?._id,
        cropName: pred.cropName,
        suitabilityScore: Number(pred.suitabilityScore).toFixed(2),
        yieldPrediction: pred.yieldPrediction,
        economics: calculateCropEconomics(pred.cropName, pred.yieldPrediction),
        explanation: pred.explanation,
        environmentalFactors: pred.environmentalFactors
      };
    })
  );

  const environmentalSnapshot = {
    soil: soilSnapshot,
    weather: weatherSnapshot
  };

  const recommendationDoc = await Recommendation.create({
    user: userId,
    location: { state: normalizedState, district: normalizedDistrict },
    season,
    recommendations,
    environmentalSnapshot
  });

  return {
    recommendations,
    environmentalSnapshot,
    recommendationId: recommendationDoc._id
  };
};

// @desc    Get crop recommendations (using stored aggregates)
// @route   POST /api/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const { state, district, season } = req.body;
    const userId = req.user.id;

    const result = await runRecommendationPipeline({
      userId,
      state,
      district,
      season,
      useRealtimeWeather: false
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Recommendation Error:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Generate recommendations with real-time weather
// @route   POST /api/recommendations/generate
// @access  Private
exports.generateRecommendations = async (req, res) => {
  try {
    const { state, district, season } = req.body;
    const userId = req.user.id;

    const result = await runRecommendationPipeline({
      userId,
      state,
      district,
      season,
      useRealtimeWeather: true
    });

    res.json({ success: true, ...result });
  } catch (error) {
    console.error('Real-time Recommendation Error:', error);
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

// @desc    Get recommendation history
// @route   GET /api/recommendations
// @access  Private
exports.getRecommendationHistory = async (req, res, next) => {
  try {
    const recommendations = await Recommendation.find({ user: req.user.id })
      .populate('recommendations.crop')
      .sort({ createdAt: -1 })
      .limit(20);

    res.json({
      success: true,
      count: recommendations.length,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single recommendation
// @route   GET /api/recommendations/:id
// @access  Private
exports.getRecommendation = async (req, res, next) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id)
      .populate('recommendations.crop')
      .populate('user', 'name email');

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    // Check if user owns this recommendation or is admin
    if (recommendation.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      success: true,
      recommendation
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Select a crop from recommendation
// @route   PUT /api/recommendations/:id/select-crop
// @access  Private
exports.selectCrop = async (req, res) => {
  try {
    const { cropName, notes } = req.body;

    if (!cropName) {
      return res.status(400).json({ message: 'Crop name is required' });
    }

    const recommendation = await Recommendation.findById(req.params.id);

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    // Check if user owns this recommendation
    if (recommendation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Verify the crop exists in recommendations
    const cropExists = recommendation.recommendations.some(
      rec => rec.cropName === cropName
    );

    if (!cropExists) {
      return res.status(400).json({ message: 'Crop not found in recommendations' });
    }

    // Update selected crop
    recommendation.selectedCrop = {
      cropName,
      selectedAt: new Date(),
      notes: notes || ''
    };

    await recommendation.save();

    res.json({
      success: true,
      message: 'Crop selected successfully',
      selectedCrop: recommendation.selectedCrop
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove selected crop
// @route   DELETE /api/recommendations/:id/select-crop
// @access  Private
exports.removeSelectedCrop = async (req, res) => {
  try {
    const recommendation = await Recommendation.findById(req.params.id);

    if (!recommendation) {
      return res.status(404).json({ message: 'Recommendation not found' });
    }

    // Check if user owns this recommendation
    if (recommendation.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    recommendation.selectedCrop = undefined;
    await recommendation.save();

    res.json({
      success: true,
      message: 'Selection removed successfully'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


