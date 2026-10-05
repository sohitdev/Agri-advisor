import React from 'react';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../utils/api';

const RecommendationHistory = () => {
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

  const keyframes = `
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInDown { from { opacity: 0; transform: translateY(-20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes slideInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  `;

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-80px)] p-[clamp(1rem,2vw,2rem)] max-sm:p-4 max-md:p-6 relative" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <style>{keyframes}</style>
        <div className="max-w-[1200px] mx-auto" style={{ animation: 'fadeInUp 0.6s ease' }}>
          <div className="text-center py-16 px-8 bg-white rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', animation: 'fadeIn 0.6s ease' }}>
            <div className="mb-8 flex justify-center">
              <div className="w-[60px] h-[60px] rounded-full border-4 border-[rgba(52,152,219,0.2)] border-t-[#3498db]" style={{ animation: 'spin 1s linear infinite' }}></div>
            </div>
            <h2 className="text-[#2c3e50] m-0 mb-2 text-2xl">Loading your history...</h2>
            <p className="text-[#7f8c8d] m-0">Please wait while we fetch your recommendations</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-80px)] p-[clamp(1rem,2vw,2rem)] max-sm:p-4 max-md:p-6 relative" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <style>{keyframes}</style>
        <div className="max-w-[1200px] mx-auto" style={{ animation: 'fadeInUp 0.6s ease' }}>
          <div className="text-center py-16 px-8 bg-white rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', animation: 'fadeIn 0.6s ease' }}>
            <div className="text-[#e74c3c] mb-6 flex justify-center">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
            </div>
            <h2 className="text-[#2c3e50] m-0 mb-2 text-2xl">Oops! Something went wrong</h2>
            <p className="text-[#7f8c8d] m-0 mb-8">We couldn't load your recommendation history</p>
            <button 
              onClick={() => window.location.reload()} 
              className="py-3 px-8 text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#3498db] focus-visible:outline-offset-2"
              style={{ background: 'linear-gradient(135deg, #3498db, #5dade2)', boxShadow: '0 4px 12px rgba(52, 152, 219, 0.3)' }}
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-[clamp(1rem,2vw,2rem)] max-sm:p-4 max-md:p-6 relative" style={{ background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <style>{keyframes}</style>
      <div className="max-w-[1200px] mx-auto" style={{ animation: 'fadeInUp 0.6s ease' }}>
        <div className="flex items-center gap-6 mb-8 bg-white p-8 max-md:p-6 max-sm:p-5 rounded-2xl flex-wrap max-md:flex-col max-md:text-center" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', animation: 'slideInDown 0.6s ease' }}>
          <div 
            className="w-[70px] h-[70px] max-md:w-[60px] max-md:h-[60px] rounded-2xl flex items-center justify-center text-white shrink-0 transition-all duration-300 hover:scale-105 hover:rotate-3"
            style={{ background: 'linear-gradient(135deg, #3498db, #5dade2)', boxShadow: '0 4px 16px rgba(52, 152, 219, 0.3)' }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path>
            </svg>
          </div>
          <div>
            <h1 className="m-0 mb-2 text-[2rem] max-md:text-[1.75rem] max-sm:text-[1.5rem] font-bold text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(135deg, #2c3e50 0%, #3498db 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Recommendation History
            </h1>
            <p className="text-[#7f8c8d] m-0 text-base max-sm:text-[0.9rem]">
              View all your past crop recommendations
            </p>
          </div>
        </div>

        {data?.recommendations?.length === 0 ? (
          <div className="text-center py-16 px-8 bg-white rounded-2xl" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', animation: 'fadeIn 0.6s ease' }}>
            <div className="text-[#95a5a6] mb-6 flex justify-center">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
            </div>
            <h2 className="text-[#2c3e50] m-0 mb-2 text-2xl">No Recommendations Yet</h2>
            <p className="text-[#7f8c8d] m-0 mb-8">Start by getting your first crop recommendation from the dashboard</p>
            <a 
              href="/" 
              className="inline-flex items-center gap-2 py-3.5 px-8 text-white no-underline rounded-lg text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-[#3498db] focus-visible:outline-offset-2"
              style={{ background: 'linear-gradient(135deg, #27ae60, #2ecc71)', boxShadow: '0 4px 12px rgba(39, 174, 96, 0.3)' }}
            >
              Get Recommendations
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-6 mb-8">
              <div className="bg-white p-6 max-sm:p-5 rounded-xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-1" style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', animation: 'slideInUp 0.6s ease' }}>
                <div className="w-[50px] h-[50px] max-sm:w-[45px] max-sm:h-[45px] rounded-xl flex items-center justify-center text-white shrink-0" style={{ background: 'linear-gradient(135deg, #27ae60, #2ecc71)' }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 11l3 3L22 4"></path>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
                  </svg>
                </div>
                <div>
                  <h3 className="m-0 mb-1 text-[2rem] max-sm:text-[1.75rem] text-[#2c3e50] font-bold">{data.recommendations.length}</h3>
                  <p className="m-0 text-[#7f8c8d] text-[0.9rem]">Total Recommendations</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              {data.recommendations.map((rec, index) => (
                <div 
                  key={rec._id} 
                  className="bg-white p-8 max-md:p-6 max-sm:p-5 rounded-2xl relative overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-1 group" 
                  style={{ boxShadow: '0 2px 12px rgba(0, 0, 0, 0.08)', animation: 'slideInUp 0.6s ease both', animationDelay: `${index * 0.1}s` }}
                  onClick={() => navigate(`/history/${rec._id}`)}
                >
                  <div className="absolute top-0 left-0 w-1 h-full origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100" style={{ background: 'linear-gradient(135deg, #3498db, #5dade2)' }}></div>

                  <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b-2 border-[#ecf0f1] flex-wrap max-md:flex-col max-md:items-start">
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 max-sm:w-[35px] max-sm:h-[35px] rounded-lg flex items-center justify-center text-white shrink-0" style={{ background: 'linear-gradient(135deg, #3498db, #5dade2)' }}>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                          <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                      </div>
                      <h3 className="text-[#2c3e50] m-0 text-xl max-md:text-[1.1rem] max-sm:text-[1rem] font-semibold">{rec.location?.state || 'Unknown'} - {rec.location?.district || 'Unknown'}</h3>
                    </div>
                    <div className="flex items-center gap-4 flex-wrap max-md:w-full max-md:justify-between">
                      <span className="text-white py-2 px-4 max-sm:py-1.5 max-sm:px-3 rounded-lg text-[0.9rem] max-sm:text-[0.85rem] font-semibold inline-flex items-center" style={{ background: 'linear-gradient(135deg, #3498db, #5dade2)', boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)' }}>{rec.season}</span>
                      <span className="text-[#7f8c8d] text-[0.9rem] max-sm:text-[0.85rem] flex items-center gap-2 py-2 px-4 max-sm:py-1.5 max-sm:px-3 bg-[#f8f9fa] rounded-lg">
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

                  {rec.selectedCrop && (
                    <div className="flex items-center gap-3 py-3.5 px-5 bg-gradient-to-br from-[#d4edda] to-[#c3e6cb] border-2 border-[#27ae60] rounded-xl mb-4">
                      <div className="w-9 h-9 bg-[#27ae60] rounded-full flex items-center justify-center text-white shrink-0">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                          <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[0.75rem] text-[#155724] font-medium uppercase tracking-wide">Your Choice:</span>
                        <span className="text-[1.1rem] font-bold text-[#155724]">{rec.selectedCrop?.cropName}</span>
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="text-[#2c3e50] m-0 mb-4 text-base font-semibold">Top Recommendations:</h4>
                    <div className="flex flex-col gap-3">
                      {(rec.recommendations || []).slice(0, 3).map((recItem, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-4 max-md:flex-wrap rounded-lg transition-all duration-300 hover:translate-x-1" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #ecf0f1 100%)' }}>
                          <div className="text-white w-9 h-9 max-sm:w-8 max-sm:h-8 max-sm:text-[0.85rem] rounded-lg flex items-center justify-center text-[0.9rem] font-bold shrink-0" style={{ background: 'linear-gradient(135deg, #3498db, #5dade2)', boxShadow: '0 2px 8px rgba(52, 152, 219, 0.3)' }}>#{idx + 1}</div>
                          <div className="flex-1 flex flex-col gap-2 min-w-0">
                            <span className="font-semibold text-[#2c3e50] text-base max-sm:text-[0.95rem]">{recItem.cropName}</span>
                            <div className="w-full h-1.5 bg-[#e0e0e0] rounded-full overflow-hidden">
                              <div 
                                className="h-full rounded-full transition-all duration-600 ease-out" 
                                style={{ width: `${recItem.suitabilityScore}%`, background: 'linear-gradient(90deg, #27ae60, #2ecc71)' }}
                              ></div>
                            </div>
                          </div>
                          <div className="text-[#27ae60] font-bold text-[1.1rem] max-sm:text-[1rem] shrink-0">{Number(recItem.suitabilityScore).toFixed(2)}%</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {(rec.recommendations?.length || 0) > 3 && (
                    <div className="mt-4 pt-4 border-t border-[#ecf0f1] text-center">
                      <span className="text-[#7f8c8d] text-[0.9rem] italic">+{(rec.recommendations?.length || 0) - 3} more crops</span>
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 py-3.5 px-6 text-white rounded-lg font-semibold text-[0.95rem] mt-5 transition-all duration-300 cursor-pointer hover:-translate-y-0.5" style={{ background: 'linear-gradient(135deg, #27ae60 0%, #2ecc71 100%)', boxShadow: '0 4px 12px rgba(39, 174, 96, 0.4)' }}>
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
