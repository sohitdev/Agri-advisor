import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
// import { useTranslation } from 'react-i18next';

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
      <div className="min-h-screen bg-stone-50 w-full font-sans py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center py-16 px-8 bg-white rounded-lg shadow-sm">
            <div className="text-stone-900 mb-6 flex justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 className="text-stone-900 mb-2">No Recommendations Found</h2>
            <p className="text-stone-500 mb-6">Please generate recommendations from the dashboard first</p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 py-3.5 px-6 bg-stone-50 border border-stone-200 text-white border-none rounded-lg text-base font-semibold no-underline transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm">
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
    <div className="min-h-screen bg-stone-50 w-full font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="mb-8">
          <button onClick={() => navigate('/dashboard')} className="inline-flex items-center gap-2 py-2 px-4 bg-white border border-stone-200 rounded-lg text-stone-600 text-sm transition-all duration-300 mb-4 hover:bg-slate-100 hover:border-emerald-200 hover:text-stone-900">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Back to Dashboard
          </button>
          
          <div className="bg-white py-6 px-8 rounded-lg shadow-sm border border-[rgba(37,64,102,0.08)]">
            <h1 className="text-stone-900 m-0 mb-3 text-[1.5rem] md:text-emerald-600xl">Crop Recommendations</h1>
            {locationInfo && (
              <div className="inline-flex items-center gap-2 py-2 px-4 bg-emerald-50 border border-[rgba(37,64,102,0.1)] rounded-lg text-stone-600 text-[0.95rem]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{locationInfo.district}, {locationInfo.state}</span>
                <span className="py-1 px-3 bg-emerald-50 border border-emerald-200 text-stone-900 rounded-md text-[0.85rem] font-medium">{locationInfo.season}</span>
              </div>
            )}
          </div>
        </div>

        {/* Environmental Summary */}
        {environmentalSnapshot && (
          <div className="grid grid-cols-[repeat(au gap-4 mb-8 items-stretch">
            <div className="flex items-center gap-4 py-5 px-6 bg-white rounded-md shadow-sm border border-[rgba(37,64,102,0.08)]">
              <div className="w-12 h-12 flex items-center justify-center rounded-md bg-emerald-50 text-stone-900">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 22h20M12 2v6m0 0l-3-3m3 3l3-3M7 11l5 5 5-5"></path>
                </svg>
              </div>
              <div>
                <h4 className="text-stone-900 m-0 mb-1 text-[0.95rem]">Soil Conditions</h4>
                <p className="text-stone-500 m-0 text-[0.85rem]">pH: {soil?.ph?.toFixed(1)} | N: {soil?.nitrogen?.toFixed(0)} | P: {soil?.phosphorus?.toFixed(0)} | K: {soil?.potassium?.toFixed(0)}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 py-5 px-6 bg-white rounded-md shadow-sm border border-[rgba(37,64,102,0.08)]">
              <div className="w-12 h-12 flex items-center justify-center rounded-md bg-emerald-50 text-stone-900">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.686L4.9 19.1m12.786-1.414L19.1 19.1M22 12h-2"></path>
                  <circle cx="12" cy="12" r="4"></circle>
                </svg>
              </div>
              <div>
                <h4 className="text-stone-900 m-0 mb-1 text-[0.95rem]">Weather Conditions</h4>
                <p className="text-stone-500 m-0 text-[0.85rem]">Temp: {weather?.avgTemperature?.toFixed(1)}°C | Rain: {weather?.avgRainfall?.toFixed(0)}mm | Humidity: {weather?.avgHumidity?.toFixed(0)}%</p>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 px-2 flex-wrap gap-2 md:gap-3">
          <span className="text-[1.1rem] font-semibold text-stone-900">{crops.length} crops recommended</span>
          <span className="text-[0.9rem] text-stone-500">Click on any crop to see detailed analysis</span>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-[repeat(au gap-6 items-stretch">
          {crops.map((crop, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-lg p-6 shadow-sm transition-all duration-300 border border-[rgba(37,64,102,0.12)] flex flex-col h-full hover:-translate-y-0.5 hover:shadow-sm hover:border-[rgba(39,109,168,0.4)]"
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
              <div className="absolute -top-2.5 left-5 bg-emerald-50 border border-emerald-200 text-stone-900 py-1.5 px-3 rounded-lg font-bold text-[0.9rem]">#{index + 1}</div>
              
              <div className="flex justify-between items-center mt-2 mb-4">
                <h3 className="text-stone-900 m-0 text-[1.95rem] leading-[1.1]">{formatCropName(crop.cropName)}</h3>
                <div className={`py-1.5 px-3 rounded-lg font-bold text-base ${getSuitabilityBadgeClass(crop.suitabilityScore)}`}>
                  {formatScore(crop.suitabilityScore)}%
                </div>
              </div>

              <div className="w-full h-1.5 bg-slate-200 rounded-[3px] overflow-hidden mb-4">
                <div 
                  className={`h-full rounded-[3px] transition-[width] duration-500 ease-out ${getSuitabilityFillClass(crop.suitabilityScore)}`}
                  style={{ width: `${crop.suitabilityScore}%` }}
                ></div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-emerald-50 border border-[rgba(37,64,102,0.08)] rounded-lg mb-4 text-stone-900 font-medium">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 20V10m0 10l-3-3m3 3l3-3"></path>
                  <path d="M17.5 6.5c0 2.485-2.462 4.5-5.5 4.5S6.5 8.985 6.5 6.5 8.962 2 12 2s5.5 2.015 5.5 4.5z"></path>
                </svg>
                <span>{crop.yieldPrediction?.expected?.toLocaleString()} kg/ha expected</span>
              </div>

              <p className="text-stone-500 text-[0.9rem] leading-[1.5] mb-4">{truncateText(crop.explanation)}</p>

              {crop.environmentalFactors && (
                <div className="flex flex-wrap md:flex-nowrap gap-3 mb-4">
                  <div className="flex-1 text-center p-2 bg-emerald-50 border border-[rgba(37,64,102,0.08)] rounded-lg">
                    <span className="block text-[0.75rem] text-slate-400 mb-1">Soil</span>
                    <span className="font-semibold text-stone-900">{crop.environmentalFactors.soilMatch}%</span>
                  </div>
                  <div className="flex-1 text-center p-2 bg-emerald-50 border border-[rgba(37,64,102,0.08)] rounded-lg">
                    <span className="block text-[0.75rem] text-slate-400 mb-1">Weather</span>
                    <span className="font-semibold text-stone-900">{crop.environmentalFactors.weatherMatch}%</span>
                  </div>
                  <div className="flex-1 text-center p-2 bg-emerald-50 border border-[rgba(37,64,102,0.08)] rounded-lg">
                    <span className="block text-[0.75rem] text-slate-400 mb-1">History</span>
                    <span className="font-semibold text-stone-900">{crop.environmentalFactors.historicalYield}%</span>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 p-3 bg-emerald-50 text-stone-900 border border-emerald-200 rounded-lg font-medium transition-all duration-300 mt-auto group-hover:bg-emerald-50 group-hover:border-emerald-200">
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

const getSuitabilityBadgeClass = (score) => {
  if (score >= 80) return 'bg-emerald-50 text-stone-900';
  if (score >= 60) return 'bg-emerald-50 text-stone-900';
  if (score >= 40) return 'bg-emerald-600mber-50 text-emerald-600mber-800';
  return 'bg-emerald-50 text-stone-900';
};

const getSuitabilityFillClass = (score) => {
  if (score >= 80) return 'bg-emerald-500';
  if (score >= 60) return 'bg-emerald-400';
  if (score >= 40) return 'bg-emerald-500';
  return 'bg-emerald-500';
};

export default RecommendationsPage;

