import React, { useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './SoilAnalysis.css';

const SoilAnalysis = () => {
  const [selectedSoilType, setSelectedSoilType] = useState('');
  const [soilParameters, setSoilParameters] = useState({
    nitrogen: 50,
    phosphorus: 40,
    potassium: 45,
    pH: 6.5,
    organicCarbon: 0.5,
    moisture: 35,
  });
  const [showResults, setShowResults] = useState(false);

  // Soil types data
  const soilTypes = [
    {
      id: 'alluvial',
      name: 'Alluvial Soil',
      icon: '🏞️',
      description: 'Found in river valleys, highly fertile',
      regions: ['Punjab', 'Haryana', 'UP', 'Bihar', 'West Bengal'],
      crops: ['Rice', 'Wheat', 'Sugarcane', 'Cotton'],
      characteristics: {
        fertility: 85,
        waterRetention: 70,
        drainage: 75,
        aeration: 65,
        nutrients: 80,
      },
    },
    {
      id: 'black',
      name: 'Black Soil',
      icon: '⬛',
      description: 'Rich in clay, excellent moisture retention',
      regions: ['Maharashtra', 'Gujarat', 'MP', 'Karnataka'],
      crops: ['Cotton', 'Soybean', 'Groundnut', 'Wheat'],
      characteristics: {
        fertility: 75,
        waterRetention: 90,
        drainage: 50,
        aeration: 55,
        nutrients: 70,
      },
    },
    {
      id: 'red',
      name: 'Red Soil',
      icon: '🔴',
      description: 'Rich in iron, slightly acidic',
      regions: ['Tamil Nadu', 'Karnataka', 'Odisha', 'Chhattisgarh'],
      crops: ['Millets', 'Groundnut', 'Tobacco', 'Vegetables'],
      characteristics: {
        fertility: 60,
        waterRetention: 55,
        drainage: 80,
        aeration: 75,
        nutrients: 55,
      },
    },
    {
      id: 'laterite',
      name: 'Laterite Soil',
      icon: '🟤',
      description: 'Found in heavy rainfall areas, leached nutrients',
      regions: ['Kerala', 'Karnataka', 'Goa', 'Assam'],
      crops: ['Tea', 'Coffee', 'Rubber', 'Cashew'],
      characteristics: {
        fertility: 45,
        waterRetention: 40,
        drainage: 85,
        aeration: 80,
        nutrients: 40,
      },
    },
    {
      id: 'sandy',
      name: 'Sandy Soil',
      icon: '🏜️',
      description: 'Low water retention, needs frequent irrigation',
      regions: ['Rajasthan', 'Gujarat', 'Punjab'],
      crops: ['Bajra', 'Moong', 'Groundnut', 'Dates'],
      characteristics: {
        fertility: 35,
        waterRetention: 25,
        drainage: 95,
        aeration: 90,
        nutrients: 30,
      },
    },
    {
      id: 'clay',
      name: 'Clay Soil',
      icon: '🟫',
      description: 'Heavy, sticky when wet, rich in nutrients',
      regions: ['Maharashtra', 'Tamil Nadu', 'AP'],
      crops: ['Rice', 'Wheat', 'Sugarcane'],
      characteristics: {
        fertility: 70,
        waterRetention: 85,
        drainage: 35,
        aeration: 40,
        nutrients: 75,
      },
    },
  ];

  // NPK optimal ranges
  const npkOptimalRanges = {
    nitrogen: { low: 0, medium: 40, high: 60, optimal: '40-60 kg/ha' },
    phosphorus: { low: 0, medium: 30, high: 50, optimal: '30-50 kg/ha' },
    potassium: { low: 0, medium: 35, high: 55, optimal: '35-55 kg/ha' },
  };

  // pH optimal ranges for different crops
  const phRanges = [
    { crop: 'Rice', min: 5.5, max: 7.0, optimal: 6.5 },
    { crop: 'Wheat', min: 6.0, max: 7.5, optimal: 6.8 },
    { crop: 'Potato', min: 5.0, max: 6.5, optimal: 5.8 },
    { crop: 'Tomato', min: 6.0, max: 7.0, optimal: 6.5 },
    { crop: 'Cotton', min: 6.0, max: 8.0, optimal: 7.0 },
    { crop: 'Sugarcane', min: 6.0, max: 8.0, optimal: 6.5 },
  ];

  const selectedSoil = soilTypes.find(s => s.id === selectedSoilType);

  const getRadarData = () => {
    if (!selectedSoil) return [];
    return [
      { subject: 'Fertility', value: selectedSoil.characteristics.fertility, fullMark: 100 },
      { subject: 'Water Retention', value: selectedSoil.characteristics.waterRetention, fullMark: 100 },
      { subject: 'Drainage', value: selectedSoil.characteristics.drainage, fullMark: 100 },
      { subject: 'Aeration', value: selectedSoil.characteristics.aeration, fullMark: 100 },
      { subject: 'Nutrients', value: selectedSoil.characteristics.nutrients, fullMark: 100 },
    ];
  };

  const getNPKStatus = (value, type) => {
    const range = npkOptimalRanges[type];
    if (value < range.medium) return { status: 'Low', color: '#f44336' };
    if (value < range.high) return { status: 'Medium', color: '#FF9800' };
    return { status: 'High', color: '#4CAF50' };
  };

  const getpHStatus = () => {
    const ph = soilParameters.pH;
    if (ph < 5.5) return { status: 'Very Acidic', color: '#f44336', recommendation: 'Add lime to increase pH' };
    if (ph < 6.5) return { status: 'Acidic', color: '#FF9800', recommendation: 'Consider adding lime for pH-sensitive crops' };
    if (ph < 7.5) return { status: 'Neutral', color: '#4CAF50', recommendation: 'Optimal for most crops' };
    if (ph < 8.5) return { status: 'Alkaline', color: '#FF9800', recommendation: 'Add sulfur or organic matter' };
    return { status: 'Very Alkaline', color: '#f44336', recommendation: 'Add sulfur and gypsum to lower pH' };
  };

  const handleAnalyze = () => {
    setShowResults(true);
  };

  const getRecommendations = () => {
    const recommendations = [];
    const n = getNPKStatus(soilParameters.nitrogen, 'nitrogen');
    const p = getNPKStatus(soilParameters.phosphorus, 'phosphorus');
    const k = getNPKStatus(soilParameters.potassium, 'potassium');

    if (n.status === 'Low') {
      recommendations.push({
        type: 'fertilizer',
        title: 'Nitrogen Deficiency',
        description: 'Add urea or ammonium sulfate. Consider growing legumes as cover crops.',
        icon: '🌱',
      });
    }
    if (p.status === 'Low') {
      recommendations.push({
        type: 'fertilizer',
        title: 'Phosphorus Deficiency',
        description: 'Apply DAP or superphosphate. Add bone meal for organic option.',
        icon: '🦴',
      });
    }
    if (k.status === 'Low') {
      recommendations.push({
        type: 'fertilizer',
        title: 'Potassium Deficiency',
        description: 'Add muriate of potash (MOP). Wood ash is a good organic source.',
        icon: '🪵',
      });
    }
    if (soilParameters.organicCarbon < 0.5) {
      recommendations.push({
        type: 'organic',
        title: 'Low Organic Carbon',
        description: 'Add compost, farmyard manure, or green manure to improve soil health.',
        icon: '🌿',
      });
    }
    if (soilParameters.moisture < 30) {
      recommendations.push({
        type: 'water',
        title: 'Low Soil Moisture',
        description: 'Consider mulching and drip irrigation to conserve moisture.',
        icon: '💧',
      });
    }

    return recommendations;
  };

  return (
    <div className="soil-analysis-container">
      <div className="soil-header">
        <h1>🌱 Soil Analysis</h1>
        <p>Understand your soil better for optimal crop selection</p>
      </div>

      {/* Soil Type Selection */}
      <div className="soil-type-section">
        <h2>Select Your Soil Type</h2>
        <div className="soil-types-grid">
          {soilTypes.map(soil => (
            <div
              key={soil.id}
              className={`soil-type-card ${selectedSoilType === soil.id ? 'selected' : ''}`}
              onClick={() => setSelectedSoilType(soil.id)}
            >
              <span className="soil-icon">{soil.icon}</span>
              <h3>{soil.name}</h3>
              <p>{soil.description}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedSoil && (
        <>
          {/* Soil Characteristics */}
          <div className="soil-details-section">
            <div className="soil-info-card">
              <h3>{selectedSoil.icon} {selectedSoil.name} Characteristics</h3>
              <div className="info-grid">
                <div className="info-item">
                  <span className="info-label">Major Regions</span>
                  <div className="region-tags">
                    {selectedSoil.regions.map(region => (
                      <span key={region} className="region-tag">{region}</span>
                    ))}
                  </div>
                </div>
                <div className="info-item">
                  <span className="info-label">Suitable Crops</span>
                  <div className="crop-tags">
                    {selectedSoil.crops.map(crop => (
                      <span key={crop} className="crop-tag">{crop}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="radar-card">
              <h3>Soil Properties Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={getRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Properties" dataKey="value" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Soil Parameters Input */}
          <div className="parameters-section">
            <h2>📊 Enter Soil Test Values</h2>
            <p className="section-desc">Enter your soil test report values for detailed analysis</p>
            
            <div className="parameters-grid">
              <div className="param-card">
                <label>
                  <span className="param-icon">🌿</span>
                  Nitrogen (N) - kg/ha
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soilParameters.nitrogen}
                  onChange={(e) => setSoilParameters({...soilParameters, nitrogen: Number(e.target.value)})}
                />
                <div className="param-value">
                  <span>{soilParameters.nitrogen}</span>
                  <span className={`status ${getNPKStatus(soilParameters.nitrogen, 'nitrogen').status.toLowerCase()}`}>
                    {getNPKStatus(soilParameters.nitrogen, 'nitrogen').status}
                  </span>
                </div>
              </div>

              <div className="param-card">
                <label>
                  <span className="param-icon">🦴</span>
                  Phosphorus (P) - kg/ha
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soilParameters.phosphorus}
                  onChange={(e) => setSoilParameters({...soilParameters, phosphorus: Number(e.target.value)})}
                />
                <div className="param-value">
                  <span>{soilParameters.phosphorus}</span>
                  <span className={`status ${getNPKStatus(soilParameters.phosphorus, 'phosphorus').status.toLowerCase()}`}>
                    {getNPKStatus(soilParameters.phosphorus, 'phosphorus').status}
                  </span>
                </div>
              </div>

              <div className="param-card">
                <label>
                  <span className="param-icon">🪵</span>
                  Potassium (K) - kg/ha
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soilParameters.potassium}
                  onChange={(e) => setSoilParameters({...soilParameters, potassium: Number(e.target.value)})}
                />
                <div className="param-value">
                  <span>{soilParameters.potassium}</span>
                  <span className={`status ${getNPKStatus(soilParameters.potassium, 'potassium').status.toLowerCase()}`}>
                    {getNPKStatus(soilParameters.potassium, 'potassium').status}
                  </span>
                </div>
              </div>

              <div className="param-card">
                <label>
                  <span className="param-icon">⚗️</span>
                  Soil pH
                </label>
                <input
                  type="range"
                  min="4"
                  max="10"
                  step="0.1"
                  value={soilParameters.pH}
                  onChange={(e) => setSoilParameters({...soilParameters, pH: Number(e.target.value)})}
                />
                <div className="param-value">
                  <span>{soilParameters.pH.toFixed(1)}</span>
                  <span className="status" style={{ background: getpHStatus().color + '20', color: getpHStatus().color }}>
                    {getpHStatus().status}
                  </span>
                </div>
              </div>

              <div className="param-card">
                <label>
                  <span className="param-icon">🌿</span>
                  Organic Carbon (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={soilParameters.organicCarbon}
                  onChange={(e) => setSoilParameters({...soilParameters, organicCarbon: Number(e.target.value)})}
                />
                <div className="param-value">
                  <span>{soilParameters.organicCarbon.toFixed(1)}%</span>
                  <span className={`status ${soilParameters.organicCarbon < 0.5 ? 'low' : soilParameters.organicCarbon < 0.75 ? 'medium' : 'high'}`}>
                    {soilParameters.organicCarbon < 0.5 ? 'Low' : soilParameters.organicCarbon < 0.75 ? 'Medium' : 'High'}
                  </span>
                </div>
              </div>

              <div className="param-card">
                <label>
                  <span className="param-icon">💧</span>
                  Soil Moisture (%)
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={soilParameters.moisture}
                  onChange={(e) => setSoilParameters({...soilParameters, moisture: Number(e.target.value)})}
                />
                <div className="param-value">
                  <span>{soilParameters.moisture}%</span>
                  <span className={`status ${soilParameters.moisture < 30 ? 'low' : soilParameters.moisture < 60 ? 'medium' : 'high'}`}>
                    {soilParameters.moisture < 30 ? 'Dry' : soilParameters.moisture < 60 ? 'Optimal' : 'Wet'}
                  </span>
                </div>
              </div>
            </div>

            <button className="analyze-btn" onClick={handleAnalyze}>
              🔬 Analyze Soil
            </button>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="results-section">
              <h2>📋 Analysis Results</h2>
              
              {/* NPK Chart */}
              <div className="npk-chart-card">
                <h3>NPK Levels Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: 'Nitrogen', current: soilParameters.nitrogen, optimal: 50, unit: 'kg/ha' },
                      { name: 'Phosphorus', current: soilParameters.phosphorus, optimal: 40, unit: 'kg/ha' },
                      { name: 'Potassium', current: soilParameters.potassium, optimal: 45, unit: 'kg/ha' },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" name="Your Level" fill="#2196F3" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="optimal" name="Optimal Level" fill="#4CAF50" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* pH Scale */}
              <div className="ph-card">
                <h3>Soil pH Analysis</h3>
                <div className="ph-scale">
                  <div className="ph-bar">
                    <div className="ph-gradient"></div>
                    <div 
                      className="ph-marker"
                      style={{ left: `${((soilParameters.pH - 4) / 6) * 100}%` }}
                    >
                      <span className="ph-value">{soilParameters.pH.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="ph-labels">
                    <span>4 (Very Acidic)</span>
                    <span>7 (Neutral)</span>
                    <span>10 (Very Alkaline)</span>
                  </div>
                </div>
                <div className="ph-recommendation">
                  <span className="ph-status" style={{ color: getpHStatus().color }}>
                    {getpHStatus().status}
                  </span>
                  <p>{getpHStatus().recommendation}</p>
                </div>
              </div>

              {/* Crop pH Suitability */}
              <div className="crop-ph-card">
                <h3>Crop pH Suitability</h3>
                <div className="crop-ph-list">
                  {phRanges.map(crop => {
                    const isSuitable = soilParameters.pH >= crop.min && soilParameters.pH <= crop.max;
                    return (
                      <div key={crop.crop} className={`crop-ph-item ${isSuitable ? 'suitable' : 'unsuitable'}`}>
                        <span className="crop-name">{crop.crop}</span>
                        <div className="ph-range-bar">
                          <div 
                            className="ph-range-fill"
                            style={{
                              left: `${((crop.min - 4) / 6) * 100}%`,
                              width: `${((crop.max - crop.min) / 6) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className={`suitability-badge ${isSuitable ? 'yes' : 'no'}`}>
                          {isSuitable ? '✓ Suitable' : '✗ Adjust pH'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div className="recommendations-card">
                <h3>🎯 Recommendations</h3>
                {getRecommendations().length > 0 ? (
                  <div className="recommendations-list">
                    {getRecommendations().map((rec, index) => (
                      <div key={index} className={`recommendation-item ${rec.type}`}>
                        <span className="rec-icon">{rec.icon}</span>
                        <div className="rec-content">
                          <h4>{rec.title}</h4>
                          <p>{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-recommendations">
                    <span>✅</span>
                    <p>Your soil parameters are within optimal ranges! Continue maintaining good soil health practices.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {!selectedSoilType && (
        <div className="empty-state">
          <span className="empty-icon">🌍</span>
          <h3>Select a Soil Type</h3>
          <p>Choose your soil type above to see detailed analysis and recommendations</p>
        </div>
      )}
    </div>
  );
};

export default SoilAnalysis;
