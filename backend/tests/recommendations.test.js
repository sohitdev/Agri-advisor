const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');
const Recommendation = require('../models/Recommendation');
const generateToken = require('../utils/generateToken');
const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');

const mock = new MockAdapter(axios);

describe('Recommendations Routes', () => {
  let token;
  let userId;

  beforeAll(async () => {
    // Suppress console logs during tests to keep output clean
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterAll(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  beforeEach(async () => {
    await User.deleteMany({});
    await Recommendation.deleteMany({});
    
    const user = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'farmer'
    });
    
    userId = user._id;
    token = generateToken(user._id);
    mock.reset();
  });

  describe('POST /api/recommendations/generate', () => {
    it('should generate recommendations via ML API', async () => {
      // Mock ML service response
      mock.onPost(/predict/).reply(200, {
        recommendations: [
          {
            cropName: 'Rice',
            suitabilityScore: 90,
            yieldPrediction: { expected: 4000, min: 3500, max: 4500, unit: 'kg/hectare' },
            explanation: 'Good conditions.',
            environmentalFactors: { temp_suitability: 0.95 }
          }
        ]
      });

      const res = await request(app)
        .post('/api/recommendations/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({
          state: 'Punjab',
          district: 'Ludhiana',
          season: 'Kharif'
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.recommendations).toHaveLength(1);
      expect(res.body.data.recommendations[0].cropName).toBe('Rice');

      // Ensure it's saved in DB
      const rec = await Recommendation.findById(res.body.savedId);
      expect(rec).not.toBeNull();
      expect(rec.user.toString()).toBe(userId.toString());
    });

    it('should handle ML service failure gracefully', async () => {
      mock.onPost(/predict/).reply(500, { detail: 'Internal Server Error' });

      const res = await request(app)
        .post('/api/recommendations/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({
          state: 'Punjab',
          district: 'Ludhiana',
          season: 'Kharif'
        });

      expect(res.statusCode).toBe(500);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toBe('Failed to connect to ML service');
    });

    it('should validate missing fields', async () => {
      const res = await request(app)
        .post('/api/recommendations/generate')
        .set('Authorization', `Bearer ${token}`)
        .send({
          state: 'Punjab'
          // district and season missing
        });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toMatch(/required/i);
    });
  });

  describe('GET /api/recommendations/history', () => {
    it('should get user recommendation history', async () => {
      await Recommendation.create({
        user: userId,
        location: { state: 'Punjab', district: 'Ludhiana' },
        season: 'Kharif',
        recommendations: [],
        environmentalSnapshot: {}
      });

      const res = await request(app)
        .get('/api/recommendations/history')
        .set('Authorization', `Bearer ${token}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.count).toBe(1);
    });
  });
});
