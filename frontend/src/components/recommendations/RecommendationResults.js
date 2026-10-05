import React from 'react';
import { useTranslation } from 'react-i18next';
import RecommendationCard from './RecommendationCard';
import './RecommendationResults.css';

const RecommendationResults = ({ recommendations }) => {
  const { t } = useTranslation();

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="recommendation-results">
      <h2 className="section-title">{t('recommendations')}</h2>
      <div className="recommendations-grid">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={index} recommendation={rec} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationResults;


