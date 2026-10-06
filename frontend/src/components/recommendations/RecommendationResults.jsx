import React from 'react';
import { useTranslation } from 'react-i18next';
import RecommendationCard from './RecommendationCard';

const RecommendationResults = ({ recommendations }) => {
  const { t } = useTranslation();

  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <h2 className="text-zinc-900 mb-6 text-2xl">{t('recommendations')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-[repeat(auto-fill,minmax(350px,1fr))] gap-6">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={index} recommendation={rec} rank={index + 1} />
        ))}
      </div>
    </div>
  );
};

export default RecommendationResults;

