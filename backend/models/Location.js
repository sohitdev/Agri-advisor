const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  state: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  district: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  coordinates: {
    latitude: Number,
    longitude: Number
  },
  // Aggregated environmental data
  soilData: {
    ph: {
      mean: Number,
      median: Number,
      stdDev: Number
    },
    organicCarbon: {
      mean: Number,
      median: Number,
      stdDev: Number
    },
    nitrogen: {
      mean: Number,
      median: Number,
      stdDev: Number
    },
    phosphorus: {
      mean: Number,
      median: Number,
      stdDev: Number
    },
    potassium: {
      mean: Number,
      median: Number,
      stdDev: Number
    },
    soilType: String
  },
  weatherData: {
    avgTemperature: {
      mean: Number,
      median: Number,
      stdDev: Number
    },
    avgRainfall: {
      mean: Number,
      median: Number,
      stdDev: Number
    },
    avgHumidity: {
      mean: Number,
      median: Number,
      stdDev: Number
    },
    lastUpdated: Date
  },
  cropYieldHistory: [{
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop'
    },
    season: String,
    year: Number,
    yield: Number, // in kg/hectare
    area: Number // in hectares
  }]
}, {
  timestamps: true
});

// Compound index for efficient queries
locationSchema.index({ state: 1, district: 1 }, { unique: true });

module.exports = mongoose.model('Location', locationSchema);


