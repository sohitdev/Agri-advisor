import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';
import './RecommendationsPage.css';

const RecommendationsPage = () => {
  // Removed unused 't' from useTranslation
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendations, environmentalSnapshot, locationInfo } = location.state || {};

  // Redirect to dashboard if no recommendations data
  const cropRecommendations = Array.isArray(recommendations)
    ? recommendations
    : recommendations?.recommendations || [];

  if (!cropRecommendations.length) {
    return (
      <div className="recommendations-page">
        <div className="recommendations-container">
          <div className="no-data-state">
            <div className="no-data-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2>No Recommendations Found</h2>
            <p>Please generate recommendations from the dashboard first</p>
            <Link to="/dashboard" className="btn-primary">
              Go to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const crops = cropRecommendations;
  const { soil, weather } = environmentalSnapshot || {};

  const formatCropName = (name) => {
    if (!name) return 'Unknown Crop';
    return String(name)
      .replace(/_/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const formatScore = (score) => {
    const numeric = Number(score);
    if (!Number.isFinite(numeric)) {
      return '0.00';
    }
    return numeric.toFixed(2);
  };

  const truncateText = (text, maxLength = 110) => {
    if (!text) {
      return 'No explanation available.';
    }
    if (text.length <= maxLength) {
      return text;
    }
    return `${text.substring(0, maxLength).trim()}...`;
  };

  return (
    <div className="recommendations-page">
      <div className="recommendations-container">
        {/* Header Section */}
        <div className="page-header">
          <button onClick={() => navigate('/dashboard')} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </button>
          
          <div className="header-content">
            <h1>Crop Recommendations</h1>
            {locationInfo && (
              <div className="location-badge">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{locationInfo.district}, {locationInfo.state}</span>
                <span className="season-tag">{locationInfo.season}</span>
              </div>
            )}
          </div>
        </div>

        {/* Environmental Summary */}
        {environmentalSnapshot && (
          <div className="environmental-summary">
            <div className="summary-card soil-summary">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 22h20M12 2v6m0 0l-3-3m3 3l3-3M7 11l5 5 5-5"></path>
                </svg>
              </div>
              <div className="summary-content">
                <h4>Soil Conditions</h4>
                <p>pH: {soil?.ph?.toFixed(1)} | N: {soil?.nitrogen?.toFixed(0)} | P: {soil?.phosphorus?.toFixed(0)} | K: {soil?.potassium?.toFixed(0)}</p>
              </div>
            </div>
            <div className="summary-card weather-summary">
              <div className="summary-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.686L4.9 19.1m12.786-1.414L19.1 19.1M22 12h-2"></path>
                  <circle cx="12" cy="12" r="4"></circle>
                </svg>
              </div>
              <div className="summary-content">
                <h4>Weather Conditions</h4>
                <p>Temp: {weather?.avgTemperature?.toFixed(1)}°C | Rain: {weather?.avgRainfall?.toFixed(0)}mm | Humidity: {weather?.avgHumidity?.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="results-info">
          <span className="results-count">{crops.length} crops recommended</span>
          <span className="results-hint">Click on any crop to see detailed analysis</span>
        </div>

        {/* Recommendations Grid */}
        <div className="recommendations-grid">
          {crops.map((crop, index) => (
            <div
              key={index}
              className="crop-card"
              onClick={() => navigate(`/recommendation/${index}`, {
                state: {
                  recommendation: crop,
                  environmentalSnapshot,
                  locationInfo,
                  rank: index + 1,
                  totalCrops: crops.length
                }
              })}
            >
              <div className="crop-rank">#{index + 1}</div>
              
              <div className="crop-header">
                <h3 className="crop-name">{formatCropName(crop.cropName)}</h3>
                <div className={`suitability-badge ${getSuitabilityClass(crop.suitabilityScore)}`}>
                  {formatScore(crop.suitabilityScore)}%
                </div>
              </div>

              <div className="crop-score-bar">
                <div 
                  className={`score-fill ${getSuitabilityClass(crop.suitabilityScore)}`}
                  style={{ width: `${crop.suitabilityScore}%` }}
                ></div>
              </div>

              <div className="crop-yield">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10m0 10l-3-3m3 3l3-3"></path>
                  <path d="M17.5 6.5c0 2.485-2.462 4.5-5.5 4.5S6.5 8.985 6.5 6.5 8.962 2 12 2s5.5 2.015 5.5 4.5z"></path>
                </svg>
                <span>{crop.yieldPrediction?.expected?.toLocaleString()} kg/ha expected</span>
              </div>

              <p className="crop-explanation">{truncateText(crop.explanation)}</p>

              {crop.environmentalFactors && (
                <div className="crop-factors">
                  <div className="factor">
                    <span className="factor-label">Soil</span>
                    <span className="factor-value">{crop.environmentalFactors.soilMatch}%</span>
                  </div>
                  <div className="factor">
                    <span className="factor-label">Weather</span>
                    <span className="factor-value">{crop.environmentalFactors.weatherMatch}%</span>
                  </div>
                  <div className="factor">
                    <span className="factor-label">History</span>
                    <span className="factor-value">{crop.environmentalFactors.historicalYield}%</span>
                  </div>
                </div>
              )}

              <div className="view-details">
                <span>View Details</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M5 12h14M12 5l7 7-7 7"></path>
                </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const getSuitabilityClass = (score) => {
  if (score >= 80) return 'excellent';
  if (score >= 60) return 'good';
  if (score >= 40) return 'moderate';
  return 'low';
};

export default RecommendationsPage;
