import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './CropLibrary.css';

const CropLibrary = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);

  const cropCategories = [
    { id: 'all', name: 'All Crops', icon: '🌾' },
    { id: 'cereals', name: 'Cereals', icon: '🌾' },
    { id: 'pulses', name: 'Pulses', icon: '🫘' },
    { id: 'oilseeds', name: 'Oilseeds', icon: '🥜' },
    { id: 'vegetables', name: 'Vegetables', icon: '🥬' },
    { id: 'fruits', name: 'Fruits', icon: '🍎' },
    { id: 'spices', name: 'Spices', icon: '🌶️' },
    { id: 'commercial', name: 'Commercial', icon: '🏭' },
  ];

  const cropsData = [
    // Cereals
    {
      id: 1,
      name: 'Rice',
      category: 'cereals',
      scientificName: 'Oryza sativa',
      image: '🌾',
      seasons: ['Kharif', 'Summer'],
      temperature: { min: 20, max: 35, optimal: '25-30°C' },
      rainfall: '150-300 cm',
      soil: 'Clayey loam, alluvial soil',
      waterRequirement: 'High (1200-1400 mm)',
      growingPeriod: '120-150 days',
      majorStates: ['West Bengal', 'Punjab', 'Uttar Pradesh', 'Bihar', 'Andhra Pradesh'],
      nutritionalValue: 'Rich in carbohydrates, contains protein, vitamins B1, B3, B6',
      marketPrice: '₹2,000-2,500/quintal',
      yieldPotential: '4-6 tonnes/hectare',
      tips: [
        'Transplant seedlings when they are 25-30 days old',
        'Maintain 5-7 cm water level in fields',
        'Apply balanced NPK fertilizers',
        'Control weeds within first 40 days'
      ]
    },
    {
      id: 2,
      name: 'Wheat',
      category: 'cereals',
      scientificName: 'Triticum aestivum',
      image: '🌾',
      seasons: ['Rabi'],
      temperature: { min: 10, max: 25, optimal: '15-20°C' },
      rainfall: '50-100 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (450-650 mm)',
      growingPeriod: '120-150 days',
      majorStates: ['Uttar Pradesh', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan'],
      nutritionalValue: 'High in carbohydrates, protein, fiber, B vitamins',
      marketPrice: '₹2,125-2,400/quintal',
      yieldPotential: '4-5 tonnes/hectare',
      tips: [
        'Sow seeds in November for best yield',
        'First irrigation 20-25 days after sowing',
        'Apply nitrogen in split doses',
        'Harvest when grain moisture is 12-14%'
      ]
    },
    {
      id: 3,
      name: 'Maize',
      category: 'cereals',
      scientificName: 'Zea mays',
      image: '🌽',
      seasons: ['Kharif', 'Rabi', 'Summer'],
      temperature: { min: 18, max: 32, optimal: '21-27°C' },
      rainfall: '50-100 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (500-800 mm)',
      growingPeriod: '80-110 days',
      majorStates: ['Karnataka', 'Rajasthan', 'Maharashtra', 'Bihar', 'Uttar Pradesh'],
      nutritionalValue: 'Rich in carbohydrates, fiber, vitamins A, B, E',
      marketPrice: '₹1,850-2,200/quintal',
      yieldPotential: '5-8 tonnes/hectare',
      tips: [
        'Plant in rows with 60-75 cm spacing',
        'Critical irrigation at flowering stage',
        'Intercrop with legumes for soil health',
        'Control stem borer with timely spraying'
      ]
    },
    {
      id: 4,
      name: 'Barley',
      category: 'cereals',
      scientificName: 'Hordeum vulgare',
      image: '🌾',
      seasons: ['Rabi'],
      temperature: { min: 8, max: 22, optimal: '12-16°C' },
      rainfall: '30-50 cm',
      soil: 'Sandy loam to loamy soil',
      waterRequirement: 'Low (350-450 mm)',
      growingPeriod: '110-130 days',
      majorStates: ['Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Haryana', 'Punjab'],
      nutritionalValue: 'High in fiber, selenium, manganese, B vitamins',
      marketPrice: '₹1,600-1,900/quintal',
      yieldPotential: '3-4 tonnes/hectare',
      tips: [
        'Drought tolerant - requires less water',
        'Best for areas with limited irrigation',
        'Sow in October-November',
        'Harvest when grains are hard'
      ]
    },
    {
      id: 5,
      name: 'Millets (Bajra)',
      category: 'cereals',
      scientificName: 'Pennisetum glaucum',
      image: '🌾',
      seasons: ['Kharif'],
      temperature: { min: 25, max: 40, optimal: '30-35°C' },
      rainfall: '40-60 cm',
      soil: 'Sandy loam, well-drained soil',
      waterRequirement: 'Low (350-500 mm)',
      growingPeriod: '70-90 days',
      majorStates: ['Rajasthan', 'Maharashtra', 'Gujarat', 'Uttar Pradesh', 'Haryana'],
      nutritionalValue: 'High in protein, iron, calcium, fiber',
      marketPrice: '₹2,350-2,800/quintal',
      yieldPotential: '2-3 tonnes/hectare',
      tips: [
        'Excellent for drought-prone areas',
        'Deep root system helps water uptake',
        'Can grow in poor soil conditions',
        'Harvest when grains are physiologically mature'
      ]
    },
    // Pulses
    {
      id: 6,
      name: 'Chickpea (Gram)',
      category: 'pulses',
      scientificName: 'Cicer arietinum',
      image: '🫘',
      seasons: ['Rabi'],
      temperature: { min: 15, max: 30, optimal: '20-25°C' },
      rainfall: '60-90 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Low (400-500 mm)',
      growingPeriod: '100-140 days',
      majorStates: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh', 'Karnataka'],
      nutritionalValue: 'High protein, fiber, iron, phosphorus',
      marketPrice: '₹5,100-6,000/quintal',
      yieldPotential: '1.5-2.5 tonnes/hectare',
      tips: [
        'Grows well in residual soil moisture',
        'No irrigation needed if soil has good moisture',
        'Wilt resistant varieties recommended',
        'Harvest when pods turn brown'
      ]
    },
    {
      id: 7,
      name: 'Pigeon Pea (Arhar)',
      category: 'pulses',
      scientificName: 'Cajanus cajan',
      image: '🫘',
      seasons: ['Kharif'],
      temperature: { min: 18, max: 35, optimal: '25-30°C' },
      rainfall: '60-100 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (600-700 mm)',
      growingPeriod: '150-180 days',
      majorStates: ['Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Uttar Pradesh', 'Gujarat'],
      nutritionalValue: 'High protein, dietary fiber, potassium',
      marketPrice: '₹6,000-7,500/quintal',
      yieldPotential: '1.2-2 tonnes/hectare',
      tips: [
        'Can be intercropped with cereals',
        'Fixes nitrogen in soil',
        'Resistant to drought conditions',
        'Multiple harvests possible in some varieties'
      ]
    },
    // Oilseeds
    {
      id: 8,
      name: 'Groundnut',
      category: 'oilseeds',
      scientificName: 'Arachis hypogaea',
      image: '🥜',
      seasons: ['Kharif', 'Rabi'],
      temperature: { min: 24, max: 33, optimal: '27-30°C' },
      rainfall: '50-75 cm',
      soil: 'Sandy loam, well-drained',
      waterRequirement: 'Moderate (500-700 mm)',
      growingPeriod: '100-130 days',
      majorStates: ['Gujarat', 'Rajasthan', 'Tamil Nadu', 'Andhra Pradesh', 'Karnataka'],
      nutritionalValue: 'High in protein, healthy fats, vitamin E',
      marketPrice: '₹5,500-6,500/quintal',
      yieldPotential: '2-3 tonnes/hectare',
      tips: [
        'Light and well-drained soil essential',
        'Avoid waterlogging at all costs',
        'Gypsum application improves quality',
        'Harvest when 75% pods mature'
      ]
    },
    {
      id: 9,
      name: 'Mustard',
      category: 'oilseeds',
      scientificName: 'Brassica juncea',
      image: '🌻',
      seasons: ['Rabi'],
      temperature: { min: 10, max: 25, optimal: '15-20°C' },
      rainfall: '25-40 cm',
      soil: 'Loamy to clay loam soil',
      waterRequirement: 'Low (350-450 mm)',
      growingPeriod: '110-145 days',
      majorStates: ['Rajasthan', 'Uttar Pradesh', 'Haryana', 'Madhya Pradesh', 'Gujarat'],
      nutritionalValue: 'Rich in omega-3, vitamin E, minerals',
      marketPrice: '₹5,050-6,000/quintal',
      yieldPotential: '1.5-2.5 tonnes/hectare',
      tips: [
        'Sow in October-November',
        'Can tolerate frost conditions',
        'Aphid control is critical',
        'Harvest when 75% pods turn yellow'
      ]
    },
    {
      id: 10,
      name: 'Soybean',
      category: 'oilseeds',
      scientificName: 'Glycine max',
      image: '🫛',
      seasons: ['Kharif'],
      temperature: { min: 20, max: 35, optimal: '26-30°C' },
      rainfall: '60-100 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (450-700 mm)',
      growingPeriod: '90-120 days',
      majorStates: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka'],
      nutritionalValue: 'Complete protein, isoflavones, fiber',
      marketPrice: '₹3,950-4,800/quintal',
      yieldPotential: '2-3 tonnes/hectare',
      tips: [
        'Rhizobium seed treatment essential',
        'Fixes atmospheric nitrogen',
        'Avoid waterlogging during flowering',
        'Harvest at physiological maturity'
      ]
    },
    // Vegetables
    {
      id: 11,
      name: 'Potato',
      category: 'vegetables',
      scientificName: 'Solanum tuberosum',
      image: '🥔',
      seasons: ['Rabi', 'Kharif'],
      temperature: { min: 15, max: 25, optimal: '18-22°C' },
      rainfall: '50-75 cm',
      soil: 'Well-drained sandy loam',
      waterRequirement: 'Moderate (500-700 mm)',
      growingPeriod: '75-120 days',
      majorStates: ['Uttar Pradesh', 'West Bengal', 'Bihar', 'Gujarat', 'Punjab'],
      nutritionalValue: 'Carbohydrates, vitamin C, potassium, B6',
      marketPrice: '₹800-1,500/quintal',
      yieldPotential: '20-35 tonnes/hectare',
      tips: [
        'Use certified disease-free seed tubers',
        'Earthing up is essential for tuber development',
        'Control late blight with fungicides',
        'Cure tubers before storage'
      ]
    },
    {
      id: 12,
      name: 'Tomato',
      category: 'vegetables',
      scientificName: 'Solanum lycopersicum',
      image: '🍅',
      seasons: ['Rabi', 'Kharif', 'Summer'],
      temperature: { min: 18, max: 30, optimal: '21-24°C' },
      rainfall: '50-75 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (400-600 mm)',
      growingPeriod: '90-120 days',
      majorStates: ['Andhra Pradesh', 'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Gujarat'],
      nutritionalValue: 'Lycopene, vitamin C, potassium',
      marketPrice: '₹1,000-3,000/quintal',
      yieldPotential: '30-50 tonnes/hectare',
      tips: [
        'Stake plants for better yield',
        'Regular watering during fruiting',
        'Control early and late blight',
        'Harvest at breaker stage for transport'
      ]
    },
    {
      id: 13,
      name: 'Onion',
      category: 'vegetables',
      scientificName: 'Allium cepa',
      image: '🧅',
      seasons: ['Rabi', 'Kharif'],
      temperature: { min: 15, max: 30, optimal: '20-25°C' },
      rainfall: '50-75 cm',
      soil: 'Loamy to clay loam, well-drained',
      waterRequirement: 'Moderate (350-550 mm)',
      growingPeriod: '120-150 days',
      majorStates: ['Maharashtra', 'Karnataka', 'Gujarat', 'Rajasthan', 'Bihar'],
      nutritionalValue: 'Quercetin, vitamin C, sulfur compounds',
      marketPrice: '₹1,000-3,500/quintal',
      yieldPotential: '25-40 tonnes/hectare',
      tips: [
        'Transplant seedlings at 6-8 weeks',
        'Stop irrigation 10 days before harvest',
        'Cure bulbs properly before storage',
        'Good storage extends market window'
      ]
    },
    // Fruits
    {
      id: 14,
      name: 'Banana',
      category: 'fruits',
      scientificName: 'Musa paradisiaca',
      image: '🍌',
      seasons: ['Whole Year'],
      temperature: { min: 20, max: 35, optimal: '27-30°C' },
      rainfall: '100-200 cm',
      soil: 'Deep, well-drained loamy soil',
      waterRequirement: 'High (1800-2200 mm)',
      growingPeriod: '10-12 months',
      majorStates: ['Tamil Nadu', 'Maharashtra', 'Gujarat', 'Andhra Pradesh', 'Karnataka'],
      nutritionalValue: 'Potassium, vitamin B6, vitamin C, fiber',
      marketPrice: '₹1,500-2,500/quintal',
      yieldPotential: '50-60 tonnes/hectare',
      tips: [
        'Tissue culture plants give uniform yield',
        'Desuckering improves bunch weight',
        'Propping prevents wind damage',
        'Harvest at 75% maturity'
      ]
    },
    {
      id: 15,
      name: 'Mango',
      category: 'fruits',
      scientificName: 'Mangifera indica',
      image: '🥭',
      seasons: ['Summer'],
      temperature: { min: 20, max: 40, optimal: '24-30°C' },
      rainfall: '75-250 cm',
      soil: 'Deep, well-drained alluvial soil',
      waterRequirement: 'Moderate (850-1000 mm)',
      growingPeriod: '3-6 months (flowering to harvest)',
      majorStates: ['Uttar Pradesh', 'Andhra Pradesh', 'Karnataka', 'Bihar', 'Gujarat'],
      nutritionalValue: 'Vitamin A, C, fiber, antioxidants',
      marketPrice: '₹3,000-8,000/quintal',
      yieldPotential: '10-15 tonnes/hectare',
      tips: [
        'Pruning after harvest improves flowering',
        'Control mango hopper and powdery mildew',
        'Paclobutrazol for regular bearing',
        'Harvest at mature green stage for export'
      ]
    },
    // Spices
    {
      id: 16,
      name: 'Turmeric',
      category: 'spices',
      scientificName: 'Curcuma longa',
      image: '🟡',
      seasons: ['Kharif'],
      temperature: { min: 20, max: 35, optimal: '25-30°C' },
      rainfall: '150-200 cm',
      soil: 'Well-drained loamy or alluvial soil',
      waterRequirement: 'High (1500-2250 mm)',
      growingPeriod: '7-9 months',
      majorStates: ['Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Odisha'],
      nutritionalValue: 'Curcumin, antioxidants, anti-inflammatory',
      marketPrice: '₹7,000-12,000/quintal',
      yieldPotential: '20-30 tonnes/hectare (fresh)',
      tips: [
        'Plant mother rhizomes in May-June',
        'Mulching conserves moisture',
        'Harvest when leaves turn yellow',
        'Curing and polishing improves price'
      ]
    },
    {
      id: 17,
      name: 'Chilli',
      category: 'spices',
      scientificName: 'Capsicum annuum',
      image: '🌶️',
      seasons: ['Kharif', 'Rabi'],
      temperature: { min: 20, max: 35, optimal: '25-30°C' },
      rainfall: '60-120 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (600-1200 mm)',
      growingPeriod: '120-150 days',
      majorStates: ['Andhra Pradesh', 'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Tamil Nadu'],
      nutritionalValue: 'Vitamin C, capsaicin, vitamin A',
      marketPrice: '₹8,000-15,000/quintal (dry)',
      yieldPotential: '1.5-2.5 tonnes/hectare (dry)',
      tips: [
        'Transplant 40-45 day old seedlings',
        'Multiple pickings possible',
        'Control thrips and mites',
        'Dry in shade for better color'
      ]
    },
    // Commercial
    {
      id: 18,
      name: 'Sugarcane',
      category: 'commercial',
      scientificName: 'Saccharum officinarum',
      image: '🎋',
      seasons: ['Whole Year'],
      temperature: { min: 20, max: 35, optimal: '27-32°C' },
      rainfall: '100-200 cm',
      soil: 'Deep loamy to clay loam soil',
      waterRequirement: 'Very High (1500-2500 mm)',
      growingPeriod: '12-18 months',
      majorStates: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat'],
      nutritionalValue: 'Sucrose, iron, calcium, potassium',
      marketPrice: '₹285-315/quintal (FRP)',
      yieldPotential: '80-120 tonnes/hectare',
      tips: [
        'Use disease-free seed sets',
        'Trash mulching conserves moisture',
        'Earthing up prevents lodging',
        'Harvest at peak maturity for max sugar'
      ]
    },
    {
      id: 19,
      name: 'Cotton',
      category: 'commercial',
      scientificName: 'Gossypium hirsutum',
      image: '☁️',
      seasons: ['Kharif'],
      temperature: { min: 21, max: 35, optimal: '25-30°C' },
      rainfall: '50-100 cm',
      soil: 'Black cotton soil, well-drained',
      waterRequirement: 'Moderate (700-1200 mm)',
      growingPeriod: '150-180 days',
      majorStates: ['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Rajasthan'],
      nutritionalValue: 'Cottonseed oil - high in vitamin E',
      marketPrice: '₹6,000-7,000/quintal',
      yieldPotential: '2-3 tonnes/hectare (seed cotton)',
      tips: [
        'Bt cotton varieties resist bollworm',
        'Proper spacing improves boll development',
        'Control sucking pests early',
        'Pick at right maturity for best quality'
      ]
    },
    {
      id: 20,
      name: 'Jute',
      category: 'commercial',
      scientificName: 'Corchorus capsularis',
      image: '🧵',
      seasons: ['Kharif'],
      temperature: { min: 24, max: 37, optimal: '30-34°C' },
      rainfall: '150-200 cm',
      soil: 'Sandy loam to clay loam, alluvial',
      waterRequirement: 'High (1000-1500 mm)',
      growingPeriod: '120-150 days',
      majorStates: ['West Bengal', 'Bihar', 'Assam', 'Odisha'],
      nutritionalValue: 'Fiber crop - not for food',
      marketPrice: '₹4,500-5,500/quintal',
      yieldPotential: '25-35 quintals/hectare',
      tips: [
        'Broadcast or line sowing',
        'Harvest at 50% flowering for best fiber',
        'Retting for 10-15 days',
        'Proper drying ensures quality'
      ]
    }
  ];

  const filteredCrops = cropsData.filter(crop => {
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          crop.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="crop-library-container">
      {/* Header */}
      <div className="library-header">
        <h1>🌾 Crop Information Library</h1>
        <p>Comprehensive guide to major crops grown in India</p>
      </div>

      {/* Search and Filter */}
      <div className="library-controls">
        <div className="search-box">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {cropCategories.map(cat => (
            <button
              key={cat.id}
              className={`category-btn ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="cat-icon">{cat.icon}</span>
              <span className="cat-name">{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Crops Grid */}
      <div className="crops-grid">
        {filteredCrops.map(crop => (
          <div 
            key={crop.id} 
            className="crop-card"
            onClick={() => setSelectedCrop(crop)}
          >
            <div className="crop-image">{crop.image}</div>
            <div className="crop-info">
              <h3>{crop.name}</h3>
              <p className="scientific-name">{crop.scientificName}</p>
              <div className="crop-tags">
                {crop.seasons.slice(0, 2).map(season => (
                  <span key={season} className={`season-tag ${season.toLowerCase().replace(' ', '-')}`}>
                    {season}
                  </span>
                ))}
              </div>
              <div className="crop-temp">
                🌡️ {crop.temperature.optimal}
              </div>
            </div>
            <div className="view-details">
              View Details →
            </div>
          </div>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="no-results">
          <p>No crops found matching your search.</p>
        </div>
      )}

      {/* Crop Detail Modal */}
      {selectedCrop && (
        <div className="crop-modal-overlay" onClick={() => setSelectedCrop(null)}>
          <div className="crop-modal" onClick={e => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setSelectedCrop(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="modal-header">
              <div className="modal-crop-icon">{selectedCrop.image}</div>
              <div>
                <h2>{selectedCrop.name}</h2>
                <p className="scientific">{selectedCrop.scientificName}</p>
              </div>
            </div>

            <div className="modal-content">
              {/* Quick Stats */}
              <div className="quick-stats">
                <div className="stat">
                  <span className="stat-label">🌡️ Temperature</span>
                  <span className="stat-value">{selectedCrop.temperature.optimal}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">💧 Water Need</span>
                  <span className="stat-value">{selectedCrop.waterRequirement}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">⏱️ Duration</span>
                  <span className="stat-value">{selectedCrop.growingPeriod}</span>
                </div>
                <div className="stat">
                  <span className="stat-label">📈 Yield</span>
                  <span className="stat-value">{selectedCrop.yieldPotential}</span>
                </div>
              </div>

              {/* Seasons */}
              <div className="info-section">
                <h4>🗓️ Growing Seasons</h4>
                <div className="seasons-list">
                  {selectedCrop.seasons.map(season => (
                    <span key={season} className={`season-badge ${season.toLowerCase().replace(' ', '-')}`}>
                      {season}
                    </span>
                  ))}
                </div>
              </div>

              {/* Soil & Rainfall */}
              <div className="info-section">
                <h4>🌍 Soil & Climate</h4>
                <p><strong>Soil Type:</strong> {selectedCrop.soil}</p>
                <p><strong>Rainfall:</strong> {selectedCrop.rainfall}</p>
                <p><strong>Temperature Range:</strong> {selectedCrop.temperature.min}°C - {selectedCrop.temperature.max}°C</p>
              </div>

              {/* Major States */}
              <div className="info-section">
                <h4>📍 Major Growing States</h4>
                <div className="states-list">
                  {selectedCrop.majorStates.map(state => (
                    <span key={state} className="state-tag">{state}</span>
                  ))}
                </div>
              </div>

              {/* Market Info */}
              <div className="info-section">
                <h4>💰 Market Information</h4>
                <p><strong>Current Price:</strong> {selectedCrop.marketPrice}</p>
                <p><strong>Nutritional Value:</strong> {selectedCrop.nutritionalValue}</p>
              </div>

              {/* Growing Tips */}
              <div className="info-section">
                <h4>💡 Growing Tips</h4>
                <ul className="tips-list">
                  {selectedCrop.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="modal-footer">
              <button className="get-recommendation-btn" onClick={() => navigate('/dashboard')}>
                Get Recommendation for this Crop
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropLibrary;
