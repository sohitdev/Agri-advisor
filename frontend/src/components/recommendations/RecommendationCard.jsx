import React from 'react';
import { useTranslation } from 'react-i18next';

const RecommendationCard = ({ recommendation, rank }) => {
  const { t } = useTranslation();
  const { cropName, suitabilityScore, yieldPrediction, explanation, environmentalFactors } = recommendation;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-md">
      <div className="flex items-center gap-4 mb-4 pb-4 border-b-2 border-zinc-200">
        <span className="bg-emerald-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-xl">#{rank}</span>
        <h3 className="text-zinc-900 m-0 text-2xl">{cropName}</h3>
      </div>
      
      <div className="flex flex-col gap-4">
        <div className="bg-zinc-50 p-4 rounded">
          <div className="text-[0.9rem] text-zinc-600 mb-2">{t('suitabilityScore')}</div>
          <div className="text-[2rem] font-bold text-[#27ae60] mb-2">{suitabilityScore}%</div>
          <div className="w-full h-2 bg-slate-200 rounded overflow-hidden">
            <div 
              className="h-full bg-[#27ae60] transition-[width] duration-300" 
              style={{ width: `${suitabilityScore}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 bg-emerald-50 rounded">
          <div className="text-[0.9rem] text-zinc-600 mb-2">{t('yieldPrediction')}</div>
          <div className="text-[1.2rem] font-semibold text-zinc-900 mb-1">
            {yieldPrediction.min} - {yieldPrediction.max} kg/hectare
          </div>
          <div className="text-[0.9rem] text-[#27ae60]">
            Expected: {yieldPrediction.expected} kg/hectare
          </div>
        </div>

        <div className="p-4 bg-amber-50 rounded">
          <h4 className="text-amber-800 mb-2">{t('why')}</h4>
          <p className="text-amber-800 leading-[1.6] m-0">{explanation}</p>
        </div>

        {environmentalFactors && (
          <div className="flex flex-col gap-2 p-4 bg-zinc-50 rounded">
            <div className="flex justify-between text-zinc-600">
              <span>Soil Match:</span>
              <span>{environmentalFactors.soilMatch}%</span>
            </div>
            <div className="flex justify-between text-zinc-600">
              <span>Weather Match:</span>
              <span>{environmentalFactors.weatherMatch}%</span>
            </div>
            <div className="flex justify-between text-zinc-600">
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

