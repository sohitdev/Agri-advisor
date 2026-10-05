import React from 'react';
import { useTranslation } from 'react-i18next';
import './RecommendationCard.css';

const RecommendationCard = ({ recommendation, rank }) => {
  const { t } = useTranslation();
  const { cropName, suitabilityScore, yieldPrediction, explanation, environmentalFactors } = recommendation;

  return (
    <div className="recommendation-card">
      <div className="card-header">
        <span className="rank-badge">#{rank}</span>
        <h3 className="crop-name">{cropName}</h3>
      </div>
      
      <div className="card-body">
        <div className="score-section">
          <div className="score-label">{t('suitabilityScore')}</div>
          <div className="score-value">{suitabilityScore}%</div>
          <div className="score-bar">
            <div 
              className="score-fill" 
              style={{ width: `${suitabilityScore}%` }}
            ></div>
          </div>
        </div>

        <div className="yield-section">
          <div className="yield-label">{t('yieldPrediction')}</div>
          <div className="yield-value">
            {yieldPrediction.min} - {yieldPrediction.max} kg/hectare
          </div>
          <div className="yield-expected">
            Expected: {yieldPrediction.expected} kg/hectare
          </div>
        </div>

        <div className="explanation-section">
          <h4>{t('why')}</h4>
          <p>{explanation}</p>
        </div>

        {environmentalFactors && (
          <div className="factors-section">
            <div className="factor-item">
              <span>Soil Match:</span>
              <span>{environmentalFactors.soilMatch}%</span>
            </div>
            <div className="factor-item">
              <span>Weather Match:</span>
              <span>{environmentalFactors.weatherMatch}%</span>
            </div>
            <div className="factor-item">
              <span>Historical Yield:</span>
              <span>{environmentalFactors.historicalYield}%</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecommendationCard;


