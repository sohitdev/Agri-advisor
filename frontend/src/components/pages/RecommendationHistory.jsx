import React from 'react';
import { useQuery } from 'react-query';
// import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import './RecommendationHistory.css';

const RecommendationHistory = () => {
  // Removed unused 't' from useTranslation
  const navigate = useNavigate();
  
  const { data, isLoading, error } = useQuery(
    'recommendationHistory', 
    async () => {
      const res = await api.get('/recommendations');
      return res.data;
    },
    {
      onSuccess: (data) => {
        if (data?.recommendations?.length > 0) {
          toast.success(`Loaded ${data.recommendations.length} recommendation${data.recommendations.length > 1 ? 's' : ''}`);
        }
      },
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to load recommendation history');
      },
      retry: 1,
      staleTime: 2 * 60 * 1000 // Cache for 2 minutes
    }
  );

  if (isLoading) {
    return (
      <div className="history-page">
        <div className="history-container">
          <div className="loading-state">
            <div className="loading-spinner">
              <div className="spinner-large"></div>
            </div>
            <h2>Loading your history...</h2>
            <p>Please wait while we fetch your recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="history-page">
        <div className="history-container">
          <div className="error-state">
            <div className="error-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2>Oops! Something went wrong</h2>
            <p>We couldn't load your recommendation history</p>
            <button onClick={() => window.location.reload()} className="btn-retry">
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="history-page">
      <div className="history-container">
        <div className="history-header-section">
          <div className="history-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
            </svg>
          </div>
          <div>
            <h1>Recommendation History</h1>
            <p className="history-subtitle">
              View all your past crop recommendations
            </p>
          </div>
        </div>

        {data?.recommendations?.length === 0 ? (
          <div className="no-history-state">
            <div className="empty-icon">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </div>
            <h2>No Recommendations Yet</h2>
            <p>Start by getting your first crop recommendation from the dashboard</p>
            <a href="/" className="btn-primary">
              Get Recommendations
            </a>
          </div>
        ) : (
          <>
            <div className="history-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{data.recommendations.length}</h3>
                  <p>Total Recommendations</p>
                </div>
              </div>
            </div>

            <div className="history-list">
              {data.recommendations.map((rec, index) => (
                <div 
                  key={rec._id} 
                  className="history-item" 
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/history/${rec._id}`)}
                >
                  <div className="history-item-header">
                    <div className="location-info">
                      <div className="location-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <h3>{rec.location?.state || 'Unknown'} - {rec.location?.district || 'Unknown'}</h3>
                    </div>
                    <div className="meta-info">
                      <span className="season-badge">{rec.season}</span>
                      <span className="date-badge">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                          <line x1="16" y1="2" x2="16" y2="6"></line>
                          <line x1="8" y1="2" x2="8" y2="6"></line>
                          <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        {new Date(rec.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Selected Crop Badge */}
                  {rec.selectedCrop && (
                    <div className="selected-crop-banner">
                      <div className="selected-crop-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <div className="selected-crop-info">
                        <span className="selected-label">Your Choice:</span>
                        <span className="selected-crop-name">{rec.selectedCrop?.cropName}</span>
                      </div>
                    </div>
                  )}

                  <div className="history-recommendations">
                    <h4>Top Recommendations:</h4>
                    <div className="recommendations-grid">
                      {(rec.recommendations || []).slice(0, 3).map((recItem, idx) => (
                        <div key={idx} className="history-rec-item">
                          <div className="rec-rank">#{idx + 1}</div>
                          <div className="rec-details">
                            <span className="rec-crop">{recItem.cropName}</span>
                            <div className="rec-score-bar">
                              <div 
                                className="rec-score-fill" 
                                style={{ width: `${recItem.suitabilityScore}%` }}
                              ></div>
                            </div>
                          </div>
                          <div className="rec-score">{Number(recItem.suitabilityScore).toFixed(2)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(rec.recommendations?.length || 0) > 3 && (
                    <div className="more-crops">
                      <span>+{(rec.recommendations?.length || 0) - 3} more crops</span>
                    </div>
                  )}

                  <div className="view-details-btn">
                    <span>View Full Details</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M12 5l7 7-7 7"></path>
                    </svg>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RecommendationHistory;