import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import './RecommendationDetailPage.css';

const RecommendationDetailPage = () => {
  // Removed unused 't' from useTranslation
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendation, environmentalSnapshot, locationInfo, rank, totalCrops, fromHistory } = location.state || {};

  // Redirect if no data
  if (!recommendation) {
    return (
      <div className="detail-page">
        <div className="detail-container">
          <div className="no-data-state">
            <div className="no-data-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2>Recommendation Not Found</h2>
            <p>The recommendation you're looking for doesn't exist</p>
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { cropName, suitabilityScore, yieldPrediction, explanation, environmentalFactors } = recommendation;
  const { soil, weather } = environmentalSnapshot || {};

  const economics = recommendation.economics || buildFallbackEconomics(cropName, yieldPrediction);

  const getSuitabilityClass = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'moderate';
    return 'low';
  };

  const getSuitabilityLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Moderate Match';
    return 'Low Match';
  };

  return (
    <div className="detail-page">
      <div className="detail-container">
        {/* Navigation */}
        <div className="detail-navigation">
          <button 
            onClick={() => navigate(fromHistory ? '/history' : -1)} 
            className="back-button"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            {fromHistory ? 'Back to History' : 'Back to Results'}
          </button>
          
          {rank && totalCrops && (
            <div className="navigation-info">
              Recommendation {rank} of {totalCrops}
            </div>
          )}
        </div>

        {/* Hero Section */}
        <div className="detail-hero">
          <div className="hero-background"></div>
          <div className="hero-content">
            <div className="hero-rank">#{rank || 1}</div>
            <h1 className="hero-title">{cropName}</h1>
            {locationInfo && (
              <div className="hero-location">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{locationInfo.district}, {locationInfo.state}</span>
                <span className="hero-season">{locationInfo.season} Season</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="detail-content">
          {/* Suitability Score Card */}
          <div className="score-card">
            <div className="score-header">
              <h2>Suitability Score</h2>
              <span className={`score-badge ${getSuitabilityClass(suitabilityScore)}`}>
                {getSuitabilityLabel(suitabilityScore)}
              </span>
            </div>
            <div className="score-display">
              <div className="score-circle">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`circle ${getSuitabilityClass(suitabilityScore)}`}
                    strokeDasharray={`${suitabilityScore}, 100`}
                    d="M18 2.0845
                      a 15.9155 15.9155 0 0 1 0 31.831
                      a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="score-text">{Number(suitabilityScore).toFixed(2)}%</div>
              </div>
              <div className="score-info">
                <p>This crop has a <strong>{getSuitabilityLabel(suitabilityScore).toLowerCase()}</strong> with your location's soil and weather conditions.</p>
              </div>
            </div>
          </div>

          {/* Yield Prediction Card */}
          <div className="yield-card">
            <div className="yield-header">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20V10m0 10l-3-3m3 3l3-3"></path>
                <path d="M17.5 6.5c0 2.485-2.462 4.5-5.5 4.5S6.5 8.985 6.5 6.5 8.962 2 12 2s5.5 2.015 5.5 4.5z"></path>
              </svg>
              <h2>Yield Prediction</h2>
            </div>
            <div className="yield-stats">
              <div className="yield-stat">
                <span className="stat-label">Minimum</span>
                <span className="stat-value">{yieldPrediction?.min?.toLocaleString()}</span>
                <span className="stat-unit">kg/hectare</span>
              </div>
              <div className="yield-stat expected">
                <span className="stat-label">Expected</span>
                <span className="stat-value">{yieldPrediction?.expected?.toLocaleString()}</span>
                <span className="stat-unit">kg/hectare</span>
              </div>
              <div className="yield-stat">
                <span className="stat-label">Maximum</span>
                <span className="stat-value">{yieldPrediction?.max?.toLocaleString()}</span>
                <span className="stat-unit">kg/hectare</span>
              </div>
            </div>
            <div className="yield-bar">
              <div className="yield-range">
                <div 
                  className="yield-indicator"
                  style={{ 
                    left: `${((yieldPrediction?.expected - yieldPrediction?.min) / (yieldPrediction?.max - yieldPrediction?.min)) * 100}%` 
                  }}
                ></div>
              </div>
              <div className="yield-labels">
                <span>{yieldPrediction?.min?.toLocaleString()}</span>
                <span>{yieldPrediction?.max?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Environmental Factors */}
          {environmentalFactors && (
            <div className="factors-card">
              <h2>Environmental Compatibility</h2>
              <div className="factors-grid">
                <div className="factor-item">
                  <div className="factor-icon soil-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 22h20M12 2v6m0 0l-3-3m3 3l3-3M7 11l5 5 5-5"></path>
                    </svg>
                  </div>
                  <div className="factor-details">
                    <span className="factor-name">Soil Match</span>
                    <div className="factor-bar">
                      <div 
                        className="factor-fill soil-fill"
                        style={{ width: `${environmentalFactors.soilMatch}%` }}
                      ></div>
                    </div>
                    <span className="factor-percent">{environmentalFactors.soilMatch}%</span>
                  </div>
                </div>
                <div className="factor-item">
                  <div className="factor-icon weather-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.686L4.9 19.1m12.786-1.414L19.1 19.1M22 12h-2"></path>
                      <circle cx="12" cy="12" r="4"></circle>
                    </svg>
                  </div>
                  <div className="factor-details">
                    <span className="factor-name">Weather Match</span>
                    <div className="factor-bar">
                      <div 
                        className="factor-fill weather-fill"
                        style={{ width: `${environmentalFactors.weatherMatch}%` }}
                      ></div>
                    </div>
                    <span className="factor-percent">{environmentalFactors.weatherMatch}%</span>
                  </div>
                </div>
                <div className="factor-item">
                  <div className="factor-icon history-icon">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                    </svg>
                  </div>
                  <div className="factor-details">
                    <span className="factor-name">Historical Yield</span>
                    <div className="factor-bar">
                      <div 
                        className="factor-fill history-fill"
                        style={{ width: `${environmentalFactors.historicalYield}%` }}
                      ></div>
                    </div>
                    <span className="factor-percent">{environmentalFactors.historicalYield}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Economic Estimate */}
          {economics && (
            <div className="economics-card">
              <div className="economics-header">
                <div>
                  <span className="section-kicker">Per hectare estimate</span>
                  <h2>Investment & Profit Potential</h2>
                </div>
                <span className={`risk-badge ${getRiskClass(economics.riskLevel)}`}>
                  {economics.riskLevel || 'Moderate'} Risk
                </span>
              </div>

              <div className="economics-stats">
                <div className="economics-stat investment">
                  <span className="economics-label">Investment Needed</span>
                  <strong>{formatCurrency(economics.investment?.expected)}</strong>
                  <span>{formatCurrencyRange(economics.investment?.range)}</span>
                </div>
                <div className="economics-stat revenue">
                  <span className="economics-label">Expected Revenue</span>
                  <strong>{formatCurrency(economics.revenue?.expected)}</strong>
                  <span>{formatCurrencyRange(economics.revenue?.range)}</span>
                </div>
                <div className={`economics-stat profit ${(economics.profit?.expected || 0) < 0 ? 'loss' : ''}`}>
                  <span className="economics-label">Estimated Profit</span>
                  <strong>{formatCurrency(economics.profit?.expected)}</strong>
                  <span>{economics.profit?.roiPercent || 0}% return on investment</span>
                </div>
              </div>

              <div className="economics-details">
                <div className="economics-breakdown">
                  <h3>Cost Breakdown</h3>
                  <div className="cost-list">
                    {(economics.investment?.costBreakdown || []).map((item) => (
                      <div className="cost-item" key={item.key}>
                        <span>{formatCostLabel(item.key)}</span>
                        <strong>{formatCurrency(item.amount)}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="economics-assumptions">
                  <h3>Planning Assumptions</h3>
                  <div className="assumption-grid">
                    <div>
                      <span>Sale price used</span>
                      <strong>Rs. {formatNumber(economics.revenue?.assumedPricePerKg)}/kg</strong>
                    </div>
                    <div>
                      <span>Yield used</span>
                      <strong>{formatNumber(economics.revenue?.expectedYieldKgPerHectare)} kg/ha</strong>
                    </div>
                    <div>
                      <span>Break-even yield</span>
                      <strong>{formatNumber(economics.profit?.breakEvenYieldKgPerHectare)} kg/ha</strong>
                    </div>
                  </div>
                  <p className="economics-note">
                    These are indicative estimates. Local mandi price, input quality, labour cost, irrigation,
                    transport, and crop quality can change actual profit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Explanation Section */}
          <div className="explanation-card">
            <div className="explanation-header">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <h2>Why This Crop?</h2>
            </div>
            <p className="explanation-text">{explanation}</p>
          </div>

          {/* Environmental Data */}
          {environmentalSnapshot && (
            <div className="environment-section">
              <h2>Location Environmental Data</h2>
              <div className="environment-grid">
                {/* Soil Data */}
                <div className="environment-card soil-data">
                  <div className="env-card-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 22h20M12 2v6m0 0l-3-3m3 3l3-3M7 11l5 5 5-5"></path>
                    </svg>
                    <h3>Soil Properties</h3>
                  </div>
                  <div className="env-data-grid">
                    <div className="env-data-item">
                      <span className="env-label">pH Level</span>
                      <span className="env-value">{soil?.ph?.toFixed(2)}</span>
                    </div>
                    <div className="env-data-item">
                      <span className="env-label">Organic Carbon</span>
                      <span className="env-value">{soil?.organicCarbon?.toFixed(2)}%</span>
                    </div>
                    <div className="env-data-item">
                      <span className="env-label">Nitrogen (N)</span>
                      <span className="env-value">{soil?.nitrogen?.toFixed(0)} kg/ha</span>
                    </div>
                    <div className="env-data-item">
                      <span className="env-label">Phosphorus (P)</span>
                      <span className="env-value">{soil?.phosphorus?.toFixed(0)} kg/ha</span>
                    </div>
                    <div className="env-data-item">
                      <span className="env-label">Potassium (K)</span>
                      <span className="env-value">{soil?.potassium?.toFixed(0)} kg/ha</span>
                    </div>
                  </div>
                </div>

                {/* Weather Data */}
                <div className="environment-card weather-data">
                  <div className="env-card-header">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.686L4.9 19.1m12.786-1.414L19.1 19.1M22 12h-2"></path>
                      <circle cx="12" cy="12" r="4"></circle>
                    </svg>
                    <h3>Weather Conditions</h3>
                  </div>
                  <div className="env-data-grid">
                    <div className="env-data-item">
                      <span className="env-label">Avg Temperature</span>
                      <span className="env-value">{weather?.avgTemperature?.toFixed(1)}°C</span>
                    </div>
                    <div className="env-data-item">
                      <span className="env-label">Avg Rainfall</span>
                      <span className="env-value">{weather?.avgRainfall?.toFixed(0)} mm</span>
                    </div>
                    <div className="env-data-item">
                      <span className="env-label">Avg Humidity</span>
                      <span className="env-value">{weather?.avgHumidity?.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="action-buttons">
            <button onClick={() => navigate('/dashboard')} className="btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
                <path d="M12 2v10h10"></path>
              </svg>
              Get New Recommendations
            </button>
            <button onClick={() => navigate('/history')} className="btn-outline">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
              </svg>
              View History
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const fallbackEconomicsByCrop = {
  rice: { investment: 62000, price: 23, risk: 'Moderate' },
  paddy: { investment: 62000, price: 23, risk: 'Moderate' },
  wheat: { investment: 52000, price: 24, risk: 'Low to Moderate' },
  maize: { investment: 48000, price: 21, risk: 'Moderate' },
  potato: { investment: 145000, price: 14, risk: 'High' },
  onion: { investment: 120000, price: 16, risk: 'High' },
  tomato: { investment: 135000, price: 18, risk: 'High' },
  sugarcane: { investment: 125000, price: 3.7, risk: 'Moderate' },
  cotton: { investment: 78000, price: 70, risk: 'High' },
  mustard: { investment: 41000, price: 55, risk: 'Low to Moderate' },
  soybean: { investment: 45000, price: 48, risk: 'Moderate' },
  gram: { investment: 39000, price: 65, risk: 'Moderate' },
  banana: { investment: 175000, price: 12, risk: 'Moderate to High' },
  chillies: { investment: 110000, price: 70, risk: 'High' },
  turmeric: { investment: 115000, price: 75, risk: 'Moderate to High' }
};

const buildFallbackEconomics = (cropName, yieldPrediction = {}) => {
  const normalized = String(cropName || '').toLowerCase();
  const key = Object.keys(fallbackEconomicsByCrop).find((item) => normalized.includes(item));
  const base = fallbackEconomicsByCrop[key] || { investment: 50000, price: 18, risk: 'Moderate' };
  const rawYield = Number(yieldPrediction?.expected) || 0;
  const expectedYieldKg = rawYield > 0 && rawYield < 100 ? rawYield * 1000 : rawYield;
  const revenue = expectedYieldKg * base.price;
  const profit = revenue - base.investment;
  const roi = base.investment > 0 ? Math.round((profit / base.investment) * 100) : 0;
  const costParts = [
    ['seed', 0.18],
    ['fertilizer', 0.22],
    ['labour', 0.28],
    ['irrigation', 0.1],
    ['cropProtection', 0.1],
    ['machinery', 0.07],
    ['harvestPostHarvest', 0.05]
  ];

  return {
    investment: {
      expected: roundToNearest(base.investment),
      range: buildRange(base.investment, 0.15),
      costBreakdown: costParts.map(([part, share]) => ({
        key: part,
        amount: roundToNearest(base.investment * share)
      }))
    },
    revenue: {
      expected: roundToNearest(revenue),
      range: buildRange(revenue, 0.2),
      assumedPricePerKg: base.price,
      expectedYieldKgPerHectare: Math.round(expectedYieldKg)
    },
    profit: {
      expected: roundToNearest(profit),
      range: buildRange(profit, 0.25),
      roiPercent: roi,
      breakEvenYieldKgPerHectare: Math.round(base.investment / base.price)
    },
    riskLevel: base.risk
  };
};

const roundToNearest = (value, nearest = 100) => Math.round((Number(value) || 0) / nearest) * nearest;

const buildRange = (value, spread) => ({
  min: roundToNearest((Number(value) || 0) * (1 - spread)),
  max: roundToNearest((Number(value) || 0) * (1 + spread))
});

const formatNumber = (value) => Number(value || 0).toLocaleString('en-IN');

const formatCurrency = (value) => `Rs. ${formatNumber(value)}`;

const formatCurrencyRange = (range) => {
  if (!range) return 'Range not available';
  return `${formatCurrency(range.min)} - ${formatCurrency(range.max)}`;
};

const formatCostLabel = (key) => {
  const labels = {
    seed: 'Seed / planting material',
    fertilizer: 'Fertilizer & manure',
    labour: 'Labour',
    irrigation: 'Irrigation',
    cropProtection: 'Crop protection',
    machinery: 'Machinery',
    harvestPostHarvest: 'Harvest & transport'
  };
  return labels[key] || key;
};

const getRiskClass = (risk = '') => {
  const value = risk.toLowerCase();
  if (value.includes('high')) return 'high';
  if (value.includes('low')) return 'low';
  return 'moderate';
};

export default RecommendationDetailPage;
