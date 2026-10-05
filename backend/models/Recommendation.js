const mongoose = require('mongoose');

const recommendationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  location: {
    state: String,
    district: String
  },
  season: {
    type: String,
    enum: ['Kharif', 'Rabi', 'Summer', 'Winter', 'Autumn', 'Whole Year'],
    required: true
  },
  selectedCrop: {
    cropName: String,
    selectedAt: Date,
    notes: String
  },
  recommendations: [{
    crop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Crop'
    },
    cropName: {
      type: String,
      required: true
    },
    suitabilityScore: {
      type: Number,
      min: 0,
      max: 100
    },
    yieldPrediction: {
      min: Number, // kg/hectare
      max: Number, // kg/hectare
      expected: Number // kg/hectare
    },
    economics: {
      investment: {
        expected: Number,
        range: {
          min: Number,
          max: Number
        },
        unit: String,
        costBreakdown: [{
          key: String,
          amount: Number
        }]
      },
      revenue: {
        expected: Number,
        range: {
          min: Number,
          max: Number
        },
        assumedPricePerKg: Number,
        expectedYieldKgPerHectare: Number,
        unit: String
      },
      profit: {
        expected: Number,
        range: {
          min: Number,
          max: Number
        },
        roiPercent: Number,
        breakEvenYieldKgPerHectare: Number,
        unit: String
      },
      riskLevel: String,
      assumptions: [String]
    },
    explanation: {
      type: String,
      required: true
    },
    environmentalFactors: {
      soilMatch: Number,
      weatherMatch: Number,
      historicalYield: Number
    }
  }],
  environmentalSnapshot: {
    soil: {
      ph: Number,
      organicCarbon: Number,
      nitrogen: Number,
      phosphorus: Number,
      potassium: Number
    },
    weather: {
      avgTemperature: Number,
      avgRainfall: Number,
      avgHumidity: Number
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Recommendation', recommendationSchema);


