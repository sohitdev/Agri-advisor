const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  scientificName: {
    type: String,
    trim: true
  },
  season: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Zaid', 'All'],
    required: true
  },
  description: {
    type: String
  },
  minTemperature: {
    type: Number
  },
  maxTemperature: {
    type: Number
  },
  minRainfall: {
    type: Number
  },
  maxRainfall: {
    type: Number
  },
  soilTypes: [{
    type: String
  }],
  phRange: {
    min: Number,
    max: Number
  },
  imageUrl: {
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Crop', cropSchema);


