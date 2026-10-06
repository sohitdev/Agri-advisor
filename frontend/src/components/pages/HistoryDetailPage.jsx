import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const HistoryDetailPage = () => {
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
    if (score >= 80) return { bg: 'bg-emerald-50', text: 'text-stone-900', fill: 'bg-emerald-500' };
    if (score >= 60) return { bg: 'bg-emerald-50', text: 'text-stone-900', fill: 'bg-emerald-500' };
    if (score >= 40) return { bg: 'bg-amber-50', text: 'text-emerald-600mber-800', fill: 'bg-emerald-500' };
    return { bg: 'bg-emerald-50', text: 'text-stone-900', fill: 'bg-emerald-500' };
  };

  const keyframes = `
    @keyframes spin { to { transform: rotate(360deg); } }
  `;

  if (isLoading) {
    return (
      <div className="min-h-[100dvh] p-8 max-md:p-4" >
        <style>{keyframes}</style>
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16 px-8 bg-white rounded-lg" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <div className="mb-6">
              <div className="w-[50px] h-[50px] mx-auto rounded-full border-4 border-stone-200 border-t-[#27ae60]" style={{ animation: 'spin 1s linear infinite' }}></div>
            </div>
            <h2 className="text-stone-900 m-0 mb-2">Loading recommendation...</h2>
            <p className="text-stone-500">Please wait while we fetch the details</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.recommendation) {
    return (
      <div className="min-h-[100dvh] p-8 max-md:p-4" >
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16 px-8 bg-white rounded-lg" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
            <div className="text-red-500 mb-6 flex justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-stone-900 m-0 mb-2">Recommendation Not Found</h2>
            <p className="text-stone-500 mb-6">The recommendation you're looking for doesn't exist or has been deleted</p>
            <Link to="/history" className="inline-flex items-center gap-2 py-3.5 px-6 text-white no-underline rounded-md font-semibold transition-all duration-300 hover:-translate-y-0.5" >
              Back to History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { recommendation } = data;
  const location = recommendation?.location || {};
  const season = recommendation?.season || 'Unknown';
  const crops = recommendation?.recommendations || [];
  const environmentalSnapshot = recommendation?.environmentalSnapshot || {};
  const createdAt = recommendation?.createdAt;
  const selectedCrop = recommendation?.selectedCrop;

  return (
    <div className="min-h-[100dvh] p-8 max-md:p-4" >
      <style>{keyframes}</style>
      <div className="max-w-7xl mx-auto">
        {/* Navigation */}
        <div className="mb-6">
          <button onClick={() => navigate('/history')} className="inline-flex items-center gap-2 py-2 px-4 bg-white border border-stone-200 rounded-lg text-stone-600 text-sm transition-all duration-300 hover:bg-slate-100 hover:border-emerald-200 hover:text-stone-900">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"></path>
            </svg>
            Back to History
          </button>
        </div>

        {/* Header */}
        <div className="bg-white rounded-lg py-6 px-8 mb-6" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
          <div className="flex justify-between items-center max-md:flex-col max-md:gap-4">
            <div className="flex items-start gap-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-red-500 mt-1 shrink-0">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <div>
                <h1 className="text-stone-900 m-0 mb-2 text-emerald-600xl">{location?.district || 'Unknown District'}, {location?.state || 'Unknown State'}</h1>
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="inline-block py-1.5 px-3 text-white rounded-md text-[0.85rem] font-medium" >{season} Season</span>
                  <span className="inline-flex items-center gap-1.5 py-1.5 px-3 bg-emerald-50 text-stone-500 rounded-md text-[0.85rem]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    {createdAt ? new Date(createdAt).toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
                    }) : 'Unknown Date'}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-center py-4 px-6 rounded-md text-white max-md:w-full" >
              <span className="block text-emerald-600xl font-bold">{crops?.length || 0}</span>
              <span className="text-[0.85rem] opacity-90">Crops Recommended</span>
            </div>
          </div>
        </div>

        {/* Selected Crop Card */}
        {selectedCrop && (
          <div className="flex justify-between items-center border-emerald-500 border-emerald-200 rounded-lg py-6 px-8 mb-6 max-md:flex-col max-md:items-start max-md:gap-4" >
            <div className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] bg-emerald-50 rounded-full flex items-center justify-center text-white shrink-0">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[0.8rem] text-stone-900 font-medium uppercase tracking-[0.5px]">Your Selected Crop</span>
                <h3 className="text-emerald-600xl font-bold text-stone-900 m-0">{selectedCrop.cropName}</h3>
                <span className="text-[0.85rem] text-stone-900">
                  Selected on {new Date(selectedCrop.selectedAt).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                  })}
                </span>
              </div>
            </div>
            <button 
              className="py-3 px-5 bg-white text-stone-900 border-emerald-500 border-emerald-200 rounded-lg font-semibold transition-all duration-300 hover:bg-emerald-50 hover:text-white disabled:opacity-60 disabled:cursor-not-allowed max-md:w-full"
              onClick={handleRemoveSelection}
              disabled={removeSelectionMutation.isLoading}
            >
              {removeSelectionMutation.isLoading ? 'Removing...' : 'Change Selection'}
            </button>
          </div>
        )}

        {/* Environmental Snapshot */}
        {environmentalSnapshot && (
          <div className="mb-8">
            <h2 className="text-stone-900 m-0 mb-4 text-xl">Environmental Conditions</h2>
            <div className="grid grid-cols-[repeat(au gap-6">
              <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-emerald-200 text-stone-900">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 22h20M12 2v6m0 0l-3-3m3 3l3-3M7 11l5 5 5-5"></path>
                  </svg>
                  <h3 className="m-0 text-stone-900 text-[1.1rem]">Soil Properties</h3>
                </div>
                <div className="grid grid-cols-[repeat(au gap-4">
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <span className="block text-[0.75rem] text-stone-500 mb-1">pH</span>
                    <span className="text-base font-semibold text-stone-900">{environmentalSnapshot.soil?.ph?.toFixed(2)}</span>
                  </div>
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <span className="block text-[0.75rem] text-stone-500 mb-1">Organic Carbon</span>
                    <span className="text-base font-semibold text-stone-900">{environmentalSnapshot.soil?.organicCarbon?.toFixed(2)}%</span>
                  </div>
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <span className="block text-[0.75rem] text-stone-500 mb-1">Nitrogen</span>
                    <span className="text-base font-semibold text-stone-900">{environmentalSnapshot.soil?.nitrogen?.toFixed(0)} kg/ha</span>
                  </div>
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <span className="block text-[0.75rem] text-stone-500 mb-1">Phosphorus</span>
                    <span className="text-base font-semibold text-stone-900">{environmentalSnapshot.soil?.phosphorus?.toFixed(0)} kg/ha</span>
                  </div>
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <span className="block text-[0.75rem] text-stone-500 mb-1">Potassium</span>
                    <span className="text-base font-semibold text-stone-900">{environmentalSnapshot.soil?.potassium?.toFixed(0)} kg/ha</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-white rounded-lg p-6" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)' }}>
                <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-emerald-200 text-stone-900">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 2v2m0 16v2M4 12H2m4.314-5.686L4.9 4.9m12.786 1.414L19.1 4.9M6.314 17.686L4.9 19.1m12.786-1.414L19.1 19.1M22 12h-2"></path>
                    <circle cx="12" cy="12" r="4"></circle>
                  </svg>
                  <h3 className="m-0 text-stone-900 text-[1.1rem]">Weather Conditions</h3>
                </div>
                <div className="grid grid-cols-[repeat(au gap-4">
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <span className="block text-[0.75rem] text-stone-500 mb-1">Avg Temperature</span>
                    <span className="text-base font-semibold text-stone-900">{environmentalSnapshot.weather?.avgTemperature?.toFixed(1)}°C</span>
                  </div>
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <span className="block text-[0.75rem] text-stone-500 mb-1">Avg Rainfall</span>
                    <span className="text-base font-semibold text-stone-900">{environmentalSnapshot.weather?.avgRainfall?.toFixed(0)} mm</span>
                  </div>
                  <div className="text-center p-3 bg-stone-50 rounded-lg">
                    <span className="block text-[0.75rem] text-stone-500 mb-1">Avg Humidity</span>
                    <span className="text-base font-semibold text-stone-900">{environmentalSnapshot.weather?.avgHumidity?.toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <h2 className="text-stone-900 m-0 mb-2 text-xl">Recommended Crops</h2>
          <p className="text-stone-500 text-[0.9rem] m-0 mb-4">Click on a crop to see details, or select it as your choice</p>
          <div className="grid grid-cols-[repeat(au max-md:grid-cols-1 gap-6 mb-8">
            {crops?.map((crop, index) => {
              const isSelected = selectedCrop?.cropName === crop.cropName;
              const isSelecting = selectingCrop === crop.cropName;
              const suitClass = getSuitabilityClass(crop.suitabilityScore);
              
              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-lg p-6 transition-all duration-300 border-emerald-500 ${isSelected ? 'border-emerald-200' : 'border-transparent hover:-translate-y-1 hover:border-emerald-200'}`}
                  style={{ 
                    boxShadow: isSelected ? 'none' : '0 4px 15px rgba(0, 0, 0, 0.08)',
                    background: isSelected ? 'white' : 'white' 
                  }}
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
                    <div className="absolute -top-2.5 right-5 flex items-center gap-1.5 bg-emerald-50 text-white py-1.5 px-3 rounded-full font-semibold text-[0.8rem]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      Your Choice
                    </div>
                  )}
                  <div className="absolute -top-2.5 left-5 text-white py-1.5 px-3 rounded-full font-bold text-[0.9rem]" >#{index + 1}</div>
                  
                  <div className="flex justify-between items-center mt-2 mb-4">
                    <h3 className="text-stone-900 m-0 text-xl">{crop.cropName}</h3>
                    <div className={`py-1.5 px-3 rounded-full font-bold text-[0.95rem] ${suitClass.bg} ${suitClass.text}`}>
                      {Number(crop.suitabilityScore).toFixed(2)}%
                    </div>
                  </div>
                  
                  <div className="w-full h-1.5 bg-slate-200 rounded-sm overflow-hidden mb-4">
                    <div 
                      className={`h-full rounded-sm transition-all duration-500 ease-in-out  ${suitClass.fill}`}
                      style={{ width: `${crop.suitabilityScore}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex justify-between p-3 bg-stone-50 rounded-lg mb-4 text-stone-600 text-[0.9rem]">
                    <span>Expected Yield:</span>
                    <strong className="text-stone-900">{crop.yieldPrediction?.expected?.toLocaleString()} kg/ha</strong>
                  </div>
                  
                  {crop.environmentalFactors && (
                    <div className="flex gap-2 mb-4">
                      <div className="flex-1 text-center p-2 bg-stone-50 rounded-lg">
                        <span className="block text-[0.7rem] text-slate-400 mb-1">Soil</span>
                        <span className="font-semibold text-stone-900 text-[0.9rem]">{crop.environmentalFactors.soilMatch}%</span>
                      </div>
                      <div className="flex-1 text-center p-2 bg-stone-50 rounded-lg">
                        <span className="block text-[0.7rem] text-slate-400 mb-1">Weather</span>
                        <span className="font-semibold text-stone-900 text-[0.9rem]">{crop.environmentalFactors.weatherMatch}%</span>
                      </div>
                      <div className="flex-1 text-center p-2 bg-stone-50 rounded-lg">
                        <span className="block text-[0.7rem] text-slate-400 mb-1">History</span>
                        <span className="font-semibold text-stone-900 text-[0.9rem]">{crop.environmentalFactors.historicalYield}%</span>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-2 mt-auto">
                    <button 
                      className={`flex items-center justify-center gap-2 p-3 border-emerald-500 rounded-lg font-semibold text-[0.9rem] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed ${isSelected ? 'bg-emerald-50 text-white border-emerald-200' : 'bg-white text-emerald-500 border-emerald-600 hover:bg-emerald-500 hover:text-white'}`}
                      onClick={(e) => handleSelectCrop(e, crop.cropName)}
                      disabled={isSelecting || isSelected}
                    >
                      {isSelecting ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-emerald-500 border-transparent border-t-current animate-[spin_0.8s_linear_infinite]"></div>
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
                    <div className="flex items-center justify-center gap-2 p-3 text-white rounded-lg font-medium text-[0.9rem] transition-all duration-300 hover:opacity-90" >
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
        <div className="flex gap-4 max-md:flex-col">
          <button onClick={() => navigate('/dashboard')} className="flex-1 flex items-center justify-center gap-2 py-4 px-6 text-white border-none rounded-md text-base font-semibold transition-all duration-300 hover:-translate-y-0.5" >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path>
              <path d="M12 2v10h10"></path>
            </svg>
            Get New Recommendations
          </button>
          <button onClick={() => navigate('/history')} className="flex-1 flex items-center justify-center gap-2 py-4 px-6 bg-white text-stone-900 border-emerald-500 border-stone-200 rounded-md text-base font-semibold transition-all duration-300 hover:border-emerald-200 hover:text-stone-900">
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
