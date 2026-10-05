import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';

const RecommendationDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendation, environmentalSnapshot, locationInfo, rank, totalCrops, fromHistory } = location.state || {};

  const keyframes = `
    @keyframes progress {
      0% { stroke-dasharray: 0, 100; }
    }
  `;

  if (!recommendation) {
    return (
      <div className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
        <div className="max-w-[1000px] mx-auto p-[clamp(1rem,2vw,2rem)] max-md:p-4">
          <div className="text-center py-16 px-8 bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)]">
            <div className="text-[#f39c12] mb-6 flex justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <h2 className="text-slate-900 mb-2 text-2xl font-bold">Recommendation Not Found</h2>
            <p className="text-[#7f8c8d] mb-6">The recommendation you're looking for doesn't exist</p>
            <Link to="/dashboard" className="inline-flex items-center gap-2 py-3.5 px-6 text-white no-underline rounded-lg font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_15px_rgba(39,174,96,0.4)]" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' }}>
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
    if (score >= 80) return { bg: 'bg-[#d4edda]', text: 'text-[#155724]', stroke: '#27ae60' };
    if (score >= 60) return { bg: 'bg-[#cce5ff]', text: 'text-[#004085]', stroke: '#3498db' };
    if (score >= 40) return { bg: 'bg-[#fff3cd]', text: 'text-[#856404]', stroke: '#f39c12' };
    return { bg: 'bg-[#f8d7da]', text: 'text-[#721c24]', stroke: '#e74c3c' };
  };

  const getSuitabilityLabel = (score) => {
    if (score >= 80) return 'Excellent Match';
    if (score >= 60) return 'Good Match';
    if (score >= 40) return 'Moderate Match';
    return 'Low Match';
  };

  const getRiskClass = (risk = '') => {
    const value = risk.toLowerCase();
    if (value.includes('high')) return 'bg-[#f8d7da] text-[#721c24]';
    if (value.includes('low')) return 'bg-[#d4edda] text-[#155724]';
    return 'bg-[#fff3cd] text-[#856404]';
  };

  const suit = getSuitabilityClass(suitabilityScore);

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2]">
      <style>{keyframes}</style>
      <div className="max-w-[1000px] mx-auto p-[clamp(1rem,2vw,2rem)] max-md:p-4">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
          <button 
            onClick={() => navigate(fromHistory ? '/history' : -1)} 
            className="inline-flex items-center gap-2 py-2 px-4 bg-white border border-[#e0e0e0] rounded-lg text-[#555] text-[0.9rem] cursor-pointer transition-all duration-300 hover:bg-[#f5f5f5] hover:border-[#27ae60] hover:text-[#27ae60]"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            {fromHistory ? 'Back to History' : 'Back to Results'}
          </button>
          
          {rank && totalCrops && (
            <div className="bg-white py-2 px-4 rounded-lg text-[#7f8c8d] text-[0.9rem]">
              Recommendation {rank} of {totalCrops}
            </div>
          )}
        </div>

        {/* Hero Section */}
        <div className="relative rounded-[20px] py-12 px-8 mb-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' }}>
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}></div>
          <div className="relative text-center text-white">
            <div className="inline-block bg-white/20 py-2 px-6 rounded-[20px] text-[1.2rem] font-bold mb-4">#{rank || 1}</div>
            <h1 className="text-[2.5rem] m-0 mb-4 drop-shadow-sm font-bold">{cropName}</h1>
            {locationInfo && (
              <div className="inline-flex items-center gap-2 bg-white/20 py-2 px-4 rounded-[20px] text-[0.95rem]">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <span>{locationInfo.district}, {locationInfo.state}</span>
                <span className="bg-white text-[#27ae60] py-1 px-3 rounded-xl font-semibold text-[0.85rem] ml-1">{locationInfo.season} Season</span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex flex-col gap-6">
          {/* Suitability Score Card */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
              <h2 className="m-0 text-slate-900 text-xl font-bold">Suitability Score</h2>
              <span className={`py-2 px-4 rounded-[20px] font-semibold text-[0.9rem] ${suit.bg} ${suit.text}`}>
                {getSuitabilityLabel(suitabilityScore)}
              </span>
            </div>
            <div className="flex items-center gap-8 flex-wrap">
              <div className="relative w-[140px] h-[140px] shrink-0">
                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                  <path className="fill-none stroke-[#eee] stroke-[3]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path 
                    className="fill-none stroke-[3] stroke-linecap-round" 
                    style={{ stroke: suit.stroke, strokeDasharray: `${suitabilityScore}, 100`, animation: 'progress 1s ease-out forwards' }}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" 
                  />
                </svg>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-2xl font-bold text-slate-900">{Number(suitabilityScore).toFixed(2)}%</div>
              </div>
              <div className="flex-1 min-w-[200px]">
                <p className="text-[#7f8c8d] leading-[1.6] m-0">This crop has a <strong className="text-slate-900">{getSuitabilityLabel(suitabilityScore).toLowerCase()}</strong> with your location's soil and weather conditions.</p>
              </div>
            </div>
          </div>

          {/* Yield Prediction Card */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <div className="flex items-center gap-3 mb-6 text-[#27ae60]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 20V10m0 10l-3-3m3 3l3-3"></path>
                <path d="M17.5 6.5c0 2.485-2.462 4.5-5.5 4.5S6.5 8.985 6.5 6.5 8.962 2 12 2s5.5 2.015 5.5 4.5z"></path>
              </svg>
              <h2 className="m-0 text-slate-900 text-xl font-bold">Yield Prediction</h2>
            </div>
            <div className="grid grid-cols-3 gap-6 mb-6 max-md:grid-cols-1">
              <div className="text-center p-5 bg-[#f8f9fa] rounded-xl">
                <span className="block text-[0.85rem] mb-2 opacity-80 text-[#6c757d]">Minimum</span>
                <span className="block text-[1.75rem] font-bold text-slate-900">{yieldPrediction?.min?.toLocaleString()}</span>
                <span className="block text-[0.8rem] mt-1 opacity-70 text-[#6c757d]">kg/hectare</span>
              </div>
              <div className="text-center p-5 rounded-xl text-white" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)' }}>
                <span className="block text-[0.85rem] mb-2 opacity-90">Expected</span>
                <span className="block text-[1.75rem] font-bold">{yieldPrediction?.expected?.toLocaleString()}</span>
                <span className="block text-[0.8rem] mt-1 opacity-80">kg/hectare</span>
              </div>
              <div className="text-center p-5 bg-[#f8f9fa] rounded-xl">
                <span className="block text-[0.85rem] mb-2 opacity-80 text-[#6c757d]">Maximum</span>
                <span className="block text-[1.75rem] font-bold text-slate-900">{yieldPrediction?.max?.toLocaleString()}</span>
                <span className="block text-[0.8rem] mt-1 opacity-70 text-[#6c757d]">kg/hectare</span>
              </div>
            </div>
            <div className="px-4">
              <div className="relative h-2 bg-[#ecf0f1] rounded mb-2">
                <div 
                  className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-[#27ae60] border-[3px] border-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
                  style={{ left: `${Math.min(100, Math.max(0, ((yieldPrediction?.expected - yieldPrediction?.min) / (yieldPrediction?.max - yieldPrediction?.min)) * 100))}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-[#95a5a6] text-[0.85rem]">
                <span>{yieldPrediction?.min?.toLocaleString()}</span>
                <span>{yieldPrediction?.max?.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Environmental Factors */}
          {environmentalFactors && (
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h2 className="m-0 mb-6 text-slate-900 text-xl font-bold">Environmental Compatibility</h2>
              <div className="flex flex-col gap-5">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0 bg-[#fff3e0] text-[#e65100]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 22h20M12 2v6m0 0l-3-3m3 3l3-3M7 11l5 5 5-5"></path>
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <span className="w-[120px] font-medium text-slate-900">Soil Match</span>
                    <div className="flex-1 h-2.5 bg-[#ecf0f1] rounded-[5px] overflow-hidden">
                      <div className="h-full rounded-[5px] transition-all duration-500 bg-gradient-to-r from-[#e65100] to-[#ff9800]" style={{ width: `${environmentalFactors.soilMatch}%` }}></div>
                    </div>
                    <span className="w-[50px] text-right font-bold text-slate-900">{environmentalFactors.soilMatch}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0 bg-[#e3f2fd] text-[#1565c0]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.686L4.9 19.1m12.786-1.414L19.1 19.1M22 12h-2"></path>
                      <circle cx="12" cy="12" r="4"></circle>
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <span className="w-[120px] font-medium text-slate-900">Weather Match</span>
                    <div className="flex-1 h-2.5 bg-[#ecf0f1] rounded-[5px] overflow-hidden">
                      <div className="h-full rounded-[5px] transition-all duration-500 bg-gradient-to-r from-[#1565c0] to-[#42a5f5]" style={{ width: `${environmentalFactors.weatherMatch}%` }}></div>
                    </div>
                    <span className="w-[50px] text-right font-bold text-slate-900">{environmentalFactors.weatherMatch}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center rounded-xl shrink-0 bg-[#f3e5f5] text-[#7b1fa2]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
                    </svg>
                  </div>
                  <div className="flex-1 flex items-center gap-4">
                    <span className="w-[120px] font-medium text-slate-900">Historical Yield</span>
                    <div className="flex-1 h-2.5 bg-[#ecf0f1] rounded-[5px] overflow-hidden">
                      <div className="h-full rounded-[5px] transition-all duration-500 bg-gradient-to-r from-[#7b1fa2] to-[#ba68c8]" style={{ width: `${environmentalFactors.historicalYield}%` }}></div>
                    </div>
                    <span className="w-[50px] text-right font-bold text-slate-900">{environmentalFactors.historicalYield}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Economic Estimate */}
          {economics && (
            <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-l-4 border-[#16a085]">
              <div className="flex justify-between items-start gap-4 mb-6 max-sm:flex-col">
                <div>
                  <span className="block text-[#16a085] text-[0.78rem] font-bold uppercase mb-[0.35rem]">Per hectare estimate</span>
                  <h2 className="m-0 text-slate-900 text-xl font-bold">Investment & Profit Potential</h2>
                </div>
                <span className={`shrink-0 py-2 px-4 rounded-[20px] text-[0.85rem] font-bold ${getRiskClass(economics.riskLevel)}`}>
                  {economics.riskLevel || 'Moderate'} Risk
                </span>
              </div>

              <div className="grid grid-cols-3 max-md:grid-cols-1 gap-4 mb-6">
                <div className="p-5 rounded-xl bg-[#fff8e1]">
                  <span className="block text-[#6c757d] text-[0.82rem] leading-[1.4]">Investment Needed</span>
                  <strong className="block text-slate-900 text-[1.45rem] my-[0.35rem]">{formatCurrency(economics.investment?.expected)}</strong>
                  <span className="block text-[#6c757d] text-[0.82rem]">{formatCurrencyRange(economics.investment?.range)}</span>
                </div>
                <div className="p-5 rounded-xl bg-[#e8f5e9]">
                  <span className="block text-[#6c757d] text-[0.82rem] leading-[1.4]">Expected Revenue</span>
                  <strong className="block text-slate-900 text-[1.45rem] my-[0.35rem]">{formatCurrency(economics.revenue?.expected)}</strong>
                  <span className="block text-[#6c757d] text-[0.82rem]">{formatCurrencyRange(economics.revenue?.range)}</span>
                </div>
                <div className={`p-5 rounded-xl ${(economics.profit?.expected || 0) < 0 ? 'bg-[#ffebee]' : 'bg-[#e0f2f1]'}`}>
                  <span className="block text-[#6c757d] text-[0.82rem] leading-[1.4]">Estimated Profit</span>
                  <strong className="block text-slate-900 text-[1.45rem] my-[0.35rem]">{formatCurrency(economics.profit?.expected)}</strong>
                  <span className="block text-[#6c757d] text-[0.82rem]">{economics.profit?.roiPercent || 0}% return on investment</span>
                </div>
              </div>

              <div className="grid grid-cols-[minmax(240px,0.9fr)_minmax(280px,1.1fr)] max-md:grid-cols-1 gap-6">
                <div className="bg-[#f8f9fa] rounded-xl p-5">
                  <h3 className="m-0 mb-4 text-slate-900 text-base font-bold">Cost Breakdown</h3>
                  <div className="flex flex-col gap-[0.65rem]">
                    {(economics.investment?.costBreakdown || []).map((item) => (
                      <div className="flex justify-between gap-4 text-[#555] text-[0.9rem]" key={item.key}>
                        <span>{formatCostLabel(item.key)}</span>
                        <strong className="shrink-0 text-slate-900">{formatCurrency(item.amount)}</strong>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#f8f9fa] rounded-xl p-5">
                  <h3 className="m-0 mb-4 text-slate-900 text-base font-bold">Planning Assumptions</h3>
                  <div className="grid grid-cols-3 max-sm:grid-cols-1 gap-3 mb-4">
                    <div className="bg-white rounded-lg p-[0.85rem]">
                      <span className="block text-[#7f8c8d] text-[0.78rem] mb-[0.3rem]">Sale price used</span>
                      <strong className="text-slate-900 text-[0.95rem]">Rs. {formatNumber(economics.revenue?.assumedPricePerKg)}/kg</strong>
                    </div>
                    <div className="bg-white rounded-lg p-[0.85rem]">
                      <span className="block text-[#7f8c8d] text-[0.78rem] mb-[0.3rem]">Yield used</span>
                      <strong className="text-slate-900 text-[0.95rem]">{formatNumber(economics.revenue?.expectedYieldKgPerHectare)} kg/ha</strong>
                    </div>
                    <div className="bg-white rounded-lg p-[0.85rem]">
                      <span className="block text-[#7f8c8d] text-[0.78rem] mb-[0.3rem]">Break-even yield</span>
                      <strong className="text-slate-900 text-[0.95rem]">{formatNumber(economics.profit?.breakEvenYieldKgPerHectare)} kg/ha</strong>
                    </div>
                  </div>
                  <p className="m-0 text-[#6c757d] leading-[1.6] text-[0.9rem]">
                    These are indicative estimates. Local mandi price, input quality, labour cost, irrigation,
                    transport, and crop quality can change actual profit.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Explanation Section */}
          <div className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-l-4 border-[#f39c12]">
            <div className="flex items-center gap-3 mb-4 text-[#f39c12]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 1 1 7.072 0l-.548.547A3.374 3.374 0 0 0 14 18.469V19a2 2 0 1 1-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
              </svg>
              <h2 className="m-0 text-slate-900 text-xl font-bold">Why This Crop?</h2>
            </div>
            <p className="text-[#555] leading-[1.8] text-[1.05rem] m-0">{explanation}</p>
          </div>

          {/* Environmental Data */}
          {environmentalSnapshot && (
            <div className="mt-4">
              <h2 className="m-0 mb-6 text-slate-900 text-xl font-bold">Location Environmental Data</h2>
              <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
                {/* Soil Data */}
                <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-[#f0f0f0] text-[#e65100]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 22h20M12 2v6m0 0l-3-3m3 3l3-3M7 11l5 5 5-5"></path>
                    </svg>
                    <h3 className="m-0 text-slate-900 text-[1.1rem]">Soil Properties</h3>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
                    <div className="text-center p-3 bg-[#f8f9fa] rounded-lg">
                      <span className="block text-[0.8rem] text-[#7f8c8d] mb-1.5">pH Level</span>
                      <span className="text-[1.1rem] font-semibold text-slate-900">{soil?.ph?.toFixed(2)}</span>
                    </div>
                    <div className="text-center p-3 bg-[#f8f9fa] rounded-lg">
                      <span className="block text-[0.8rem] text-[#7f8c8d] mb-1.5">Organic Carbon</span>
                      <span className="text-[1.1rem] font-semibold text-slate-900">{soil?.organicCarbon?.toFixed(2)}%</span>
                    </div>
                    <div className="text-center p-3 bg-[#f8f9fa] rounded-lg">
                      <span className="block text-[0.8rem] text-[#7f8c8d] mb-1.5">Nitrogen (N)</span>
                      <span className="text-[1.1rem] font-semibold text-slate-900">{soil?.nitrogen?.toFixed(0)} kg/ha</span>
                    </div>
                    <div className="text-center p-3 bg-[#f8f9fa] rounded-lg">
                      <span className="block text-[0.8rem] text-[#7f8c8d] mb-1.5">Phosphorus (P)</span>
                      <span className="text-[1.1rem] font-semibold text-slate-900">{soil?.phosphorus?.toFixed(0)} kg/ha</span>
                    </div>
                    <div className="text-center p-3 bg-[#f8f9fa] rounded-lg">
                      <span className="block text-[0.8rem] text-[#7f8c8d] mb-1.5">Potassium (K)</span>
                      <span className="text-[1.1rem] font-semibold text-slate-900">{soil?.potassium?.toFixed(0)} kg/ha</span>
                    </div>
                  </div>
                </div>

                {/* Weather Data */}
                <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                  <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-[#f0f0f0] text-[#1565c0]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.686L4.9 19.1m12.786-1.414L19.1 19.1M22 12h-2"></path>
                      <circle cx="12" cy="12" r="4"></circle>
                    </svg>
                    <h3 className="m-0 text-slate-900 text-[1.1rem]">Weather Conditions</h3>
                  </div>
                  <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-4">
                    <div className="text-center p-3 bg-[#f8f9fa] rounded-lg">
                      <span className="block text-[0.8rem] text-[#7f8c8d] mb-1.5">Avg Temperature</span>
                      <span className="text-[1.1rem] font-semibold text-slate-900">{weather?.avgTemperature?.toFixed(1)}°C</span>
                    </div>
                    <div className="text-center p-3 bg-[#f8f9fa] rounded-lg">
                      <span className="block text-[0.8rem] text-[#7f8c8d] mb-1.5">Avg Rainfall</span>
                      <span className="text-[1.1rem] font-semibold text-slate-900">{weather?.avgRainfall?.toFixed(0)} mm</span>
                    </div>
                    <div className="text-center p-3 bg-[#f8f9fa] rounded-lg">
                      <span className="block text-[0.8rem] text-[#7f8c8d] mb-1.5">Avg Humidity</span>
                      <span className="text-[1.1rem] font-semibold text-slate-900">{weather?.avgHumidity?.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-4 mt-4 max-md:flex-col">
            <button onClick={() => navigate('/dashboard')} className="flex-1 flex items-center justify-center gap-2 py-4 px-6 text-white border-none rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', boxShadow: '0 4px 15px rgba(39, 174, 96, 0.4)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
                <path d="M12 2v10h10"></path>
              </svg>
              Get New Recommendations
            </button>
            <button onClick={() => navigate('/history')} className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white text-slate-900 border-2 border-[#e0e0e0] rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:border-[#27ae60] hover:text-[#27ae60]">
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

export default RecommendationDetailPage;
