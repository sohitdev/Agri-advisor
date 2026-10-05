import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
// import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './HistoryDetailPage.css';

const HistoryDetailPage = () => {
  // Removed unused 't' from useTranslation
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [selectingCrop, setSelectingCrop] = useState(null);

  const { data, isLoading, error } = useQuery(
    ['recommendation', id],
    async () => {
      const res = await api.get(`/recommendations/${id}`);
      return res.data;
    },
    {
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to load recommendation');
      },
      retry: 1,
    }
  );

  // Mutation for selecting a crop - MUST be before any conditional returns
  const selectCropMutation = useMutation(
    async (cropName) => {
      const res = await api.put(`/recommendations/${id}/select-crop`, { cropName });
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recommendation', id]);
        queryClient.invalidateQueries('recommendationHistory');
        toast.success('Crop selected successfully!');
        setSelectingCrop(null);
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to select crop');
        setSelectingCrop(null);
      }
    }
  );

  // Mutation for removing selection - MUST be before any conditional returns
  const removeSelectionMutation = useMutation(
    async () => {
      const res = await api.delete(`/recommendations/${id}/select-crop`);
      return res.data;
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['recommendation', id]);
        queryClient.invalidateQueries('recommendationHistory');
        toast.success('Selection removed');
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to remove selection');
      }
    }
  );

  // Helper functions
  const handleSelectCrop = (e, cropName) => {
    e.stopPropagation();
    setSelectingCrop(cropName);
    selectCropMutation.mutate(cropName);
  };

  const handleRemoveSelection = (e) => {
    e.stopPropagation();
    removeSelectionMutation.mutate();
  };

  const getSuitabilityClass = (score) => {
    if (score >= 80) return 'excellent';
    if (score >= 60) return 'good';
    if (score >= 40) return 'moderate';
    return 'low';
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="history-detail-page">
        <div className="detail-container">
          <div className="loading-state">
            <div className="loading-spinner">
              <div className="spinner-large"></div>
            </div>
            <h2>Loading recommendation...</h2>
            <p>Please wait while we fetch the details</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !data?.recommendation) {
    return (
      <div className="history-detail-page">
        <div className="detail-container">
          <div className="error-state">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2>Recommendation Not Found</h2>
            <p>The recommendation you're looking for doesn't exist or has been deleted</p>
            <Link to="/history" className="btn-primary">
              Back to History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Extract data
  const { recommendation } = data;
  const location = recommendation?.location || {};
  const season = recommendation?.season || 'Unknown';
  const crops = recommendation?.recommendations || [];
  const environmentalSnapshot = recommendation?.environmentalSnapshot || {};
  const createdAt = recommendation?.createdAt;
  const selectedCrop = recommendation?.selectedCrop;

  return (
    <div className="history-detail-page">
      <div className="detail-container">
        {/* Navigation */}
        <div className="detail-navigation">
          <button onClick={() => navigate('/history')} className="back-button">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Back to History
          </button>
        </div>

        {/* Header */}
        <div className="detail-header">
          <div className="header-info">
            <div className="location-info">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <h1>{location?.district || 'Unknown District'}, {location?.state || 'Unknown State'}</h1>
                <div className="meta-tags">
                  <span className="season-tag">{season} Season</span>
                  <span className="date-tag">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'Unknown Date'}
                  </span>
                </div>
              </div>
            </div>
            <div className="crop-count">
              <span className="count-number">{crops?.length || 0}</span>
              <span className="count-label">Crops Recommended</span>
            </div>
          </div>
        </div>

        {/* Selected Crop Card */}
        {selectedCrop && (
          <div className="selected-crop-card">
            <div className="selected-crop-header">
              <div className="selected-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="selected-info">
                <span className="selected-label">Your Selected Crop</span>
                <h3 className="selected-name">{selectedCrop.cropName}</h3>
                <span className="selected-date">
                  Selected on {new Date(selectedCrop.selectedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <button 
              className="btn-remove-selection"
              onClick={handleRemoveSelection}
              disabled={removeSelectionMutation.isLoading}
            >
              {removeSelectionMutation.isLoading ? 'Removing...' : 'Change Selection'}
            </button>
          </div>
        )}

        {/* Environmental Snapshot */}
        {environmentalSnapshot && (
          <div className="environmental-section">
            <h2>Environmental Conditions</h2>
            <div className="env-cards">
              <div className="env-card soil-card">
                <div className="env-card-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 22h20M12 2v6m0 0l-3-3m3 3l3-3M7 11l5 5 5-5"></path>
                  </svg>
                  <h3>Soil Properties</h3>
                </div>
                <div className="env-data">
                  <div className="env-item">
                    <span className="env-label">pH</span>
                    <span className="env-value">{environmentalSnapshot.soil?.ph?.toFixed(2)}</span>
                  </div>
                  <div className="env-item">
                    <span className="env-label">Organic Carbon</span>
                    <span className="env-value">{environmentalSnapshot.soil?.organicCarbon?.toFixed(2)}%</span>
                  </div>
                  <div className="env-item">
                    <span className="env-label">Nitrogen</span>
                    <span className="env-value">{environmentalSnapshot.soil?.nitrogen?.toFixed(0)} kg/ha</span>
                  </div>
                  <div className="env-item">
                    <span className="env-label">Phosphorus</span>
                    <span className="env-value">{environmentalSnapshot.soil?.phosphorus?.toFixed(0)} kg/ha</span>
                  </div>
                  <div className="env-item">
                    <span className="env-label">Potassium</span>
                    <span className="env-value">{environmentalSnapshot.soil?.potassium?.toFixed(0)} kg/ha</span>
                  </div>
                </div>
              </div>
              <div className="env-card weather-card">
                <div className="env-card-header">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.686L4.9 19.1m12.786-1.414L19.1 19.1M22 12h-2"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                  </svg>
                  <h3>Weather Conditions</h3>
                </div>
                <div className="env-data">
                  <div className="env-item">
                    <span className="env-label">Avg Temperature</span>
                    <span className="env-value">{environmentalSnapshot.weather?.avgTemperature?.toFixed(1)}°C</span>
                  </div>
                  <div className="env-item">
                    <span className="env-label">Avg Rainfall</span>
                    <span className="env-value">{environmentalSnapshot.weather?.avgRainfall?.toFixed(0)} mm</span>
                  </div>
                  <div className="env-item">
                    <span className="env-label">Avg Humidity</span>
                    <span className="env-value">{environmentalSnapshot.weather?.avgHumidity?.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div className="recommendations-section">
          <h2>Recommended Crops</h2>
          <p className="section-hint">Click on a crop to see details, or select it as your choice</p>
          <div className="crops-grid">
            {crops?.map((crop, index) => {
              const isSelected = selectedCrop?.cropName === crop.cropName;
              const isSelecting = selectingCrop === crop.cropName;
              
              return (
                <div
                  key={index}
                  className={`crop-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => navigate(`/recommendation/${index}`, {
                    state: {
                      recommendation: crop,
                      environmentalSnapshot,
                      locationInfo: { ...location, season },
                      rank: index + 1,
                      totalCrops: crops.length,
                      fromHistory: true,
                      historyId: id
                    }
                  })}
                >
                  {isSelected && (
                    <div className="selected-badge">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Your Choice
                    </div>
                  )}
                  <div className="crop-rank">#{index + 1}</div>
                  <div className="crop-main">
                    <h3 className="crop-name">{crop.cropName}</h3>
                    <div className={`score-badge ${getSuitabilityClass(crop.suitabilityScore)}`}>
                      {Number(crop.suitabilityScore).toFixed(2)}%
                    </div>
                  </div>
                  <div className="crop-score-bar">
                    <div 
                      className={`score-fill ${getSuitabilityClass(crop.suitabilityScore)}`}
                      style={{ width: `${crop.suitabilityScore}%` }}
                    ></div>
                  </div>
                  <div className="crop-yield">
                    <span>Expected Yield:</span>
                    <strong>{crop.yieldPrediction?.expected?.toLocaleString()} kg/ha</strong>
                  </div>
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
                  <div className="crop-card-actions">
                    <button 
                      className={`btn-select-crop ${isSelected ? 'selected' : ''}`}
                      onClick={(e) => handleSelectCrop(e, crop.cropName)}
                      disabled={isSelecting || isSelected}
                    >
                      {isSelecting ? (
                        <>
                          <span className="btn-spinner"></span>
                          Selecting...
                        </>
                      ) : isSelected ? (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                          Selected
                        </>
                      ) : (
                        <>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
                          </svg>
                          Select This Crop
                        </>
                      )}
                    </button>
                    <div className="view-detail">
                      <span>View Details</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M5 12h14M12 5l7 7-7 7"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Actions */}
        <div className="action-buttons">
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
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
            Back to History
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryDetailPage;
