const express = require('express');
const router = express.Router();
const Location = require('../models/Location');

// Comprehensive districts mapping (fallback if not in database)
const DISTRICTS_BY_STATE = {
  'Andhra Pradesh': ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Tirupati', 'Rajahmundry', 'Kakinada'],
  'Arunachal Pradesh': ['Itanagar', 'Tawang', 'Bomdila', 'Pasighat', 'Tezu', 'Ziro'],
  'Assam': ['Guwahati', 'Dibrugarh', 'Silchar', 'Jorhat', 'Tinsukia', 'Nagaon', 'Bongaigaon'],
  'Bihar': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia', 'Ara'],
  'Chhattisgarh': ['Raipur', 'Bhilai', 'Bilaspur', 'Durg', 'Korba', 'Raigarh', 'Jagdalpur'],
  'Goa': ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda'],
  'Gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Gandhinagar', 'Anand', 'Bharuch', 'Mehsana'],
  'Haryana': ['Gurgaon', 'Faridabad', 'Panipat', 'Ambala', 'Karnal', 'Hisar', 'Rohtak', 'Yamunanagar'],
  'Himachal Pradesh': ['Shimla', 'Mandi', 'Dharamshala', 'Solan', 'Kullu', 'Kangra', 'Una'],
  'Jharkhand': ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Hazaribagh', 'Deoghar'],
  'Karnataka': ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davangere', 'Bellary'],
  'Kerala': ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Kannur', 'Alappuzha'],
  'Madhya Pradesh': ['Bhopal', 'Indore', 'Gwalior', 'Jabalpur', 'Ujjain', 'Raipur', 'Satna'],
  'Maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Aurangabad', 'Nashik', 'Solapur', 'Amravati', 'Kolhapur', 'Sangli'],
  'Manipur': ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur'],
  'Meghalaya': ['Shillong', 'Tura', 'Jowai', 'Nongpoh'],
  'Mizoram': ['Aizawl', 'Lunglei', 'Champhai', 'Kolasib'],
  'Nagaland': ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang'],
  'Odisha': ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur', 'Puri'],
  'Punjab': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Firozpur'],
  'Rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota', 'Ajmer', 'Bikaner', 'Alwar', 'Bharatpur'],
  'Sikkim': ['Gangtok', 'Namchi', 'Mangan', 'Gyalshing'],
  'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Erode'],
  'Telangana': ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Khammam'],
  'Tripura': ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailasahar'],
  'Uttar Pradesh': ['Lucknow', 'Kanpur', 'Agra', 'Varanasi', 'Allahabad', 'Meerut', 'Ghaziabad', 'Noida'],
  'Uttarakhand': ['Dehradun', 'Haridwar', 'Rishikesh', 'Nainital', 'Mussoorie'],
  'West Bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda']
};

// @desc    Get states
// @route   GET /api/locations/states
// @access  Public
router.get('/states', async (req, res) => {
  try {
    const states = [
      'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
      'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
      'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
      'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
      'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
      'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
    ];
    res.json({
      success: true,
      states
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get districts by state
// @route   GET /api/locations/districts/:state
// @access  Public
router.get('/districts/:state', async (req, res) => {
  try {
    // Decode and normalize state name (Express auto-decodes, but ensure proper matching)
    let state = decodeURIComponent(req.params.state);
    
    // First, try to get districts from MongoDB Location collection
    try {
      const locations = await Location.find({ state: new RegExp(`^${state}$`, 'i') })
        .select('district')
        .distinct('district')
        .lean();
      
      if (locations && locations.length > 0) {
        // Sort districts alphabetically
        const districts = locations.sort();
        return res.json({
          success: true,
          state: state,
          districts: districts
        });
      }
    } catch (dbError) {
      // If database query fails, continue to fallback
      console.log('Database query failed, using fallback:', dbError.message);
    }
    
    // Fallback to static mapping - try exact match first, then case-insensitive
    let districts = DISTRICTS_BY_STATE[state];
    
    // If exact match not found, try case-insensitive lookup
    if (!districts || districts.length === 0) {
      const stateKeys = Object.keys(DISTRICTS_BY_STATE);
      const matchedState = stateKeys.find(key => 
        key.toLowerCase() === state.toLowerCase()
      );
      if (matchedState) {
        districts = DISTRICTS_BY_STATE[matchedState];
        state = matchedState; // Use the canonical state name
      }
    }
    
    if (!districts || districts.length === 0) {
      return res.status(404).json({
        success: false,
        message: `No districts found for state: ${state}`
      });
    }
    
    res.json({
      success: true,
      state: state,
      districts: districts
    });
  } catch (error) {
    console.error('Error fetching districts:', error);
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;


