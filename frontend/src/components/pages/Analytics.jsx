import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import api from '../../utils/api';

const Analytics = () => {
  const { user, loading: authLoading } = useAuth();
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Listen for token changes (login/logout)
  useEffect(() => {
    const onStorage = () => setToken(localStorage.getItem('token'));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState([]);
  const [useDemoData, setUseDemoData] = useState(false);
  const [analytics, setAnalytics] = useState({
    totalRecommendations: 0,
    cropDistribution: [],
    seasonDistribution: [],
    monthlyTrend: [],
    stateDistribution: [],
    avgSuitabilityByCategory: [],
    recentActivity: []
  });

  // Demo data for visualization
  const demoAnalytics = {
    totalRecommendations: 24,
    cropDistribution: [
      { name: 'Rice', value: 8 },
      { name: 'Wheat', value: 6 },
      { name: 'Maize', value: 4 },
      { name: 'Cotton', value: 3 },
      { name: 'Sugarcane', value: 2 },
      { name: 'Soybean', value: 1 }
    ],
    seasonDistribution: [
      { name: 'Kharif', value: 10, fill: '#FF6B6B' },
      { name: 'Rabi', value: 8, fill: '#4ECDC4' },
      { name: 'Summer', value: 4, fill: '#FFE66D' },
      { name: 'Winter', value: 2, fill: '#95E1D3' }
    ],
    monthlyTrend: [
      { month: 'Aug 2025', recommendations: 3 },
      { month: 'Sep 2025', recommendations: 5 },
      { month: 'Oct 2025', recommendations: 4 },
      { month: 'Nov 2025', recommendations: 6 },
      { month: 'Dec 2025', recommendations: 3 },
      { month: 'Jan 2026', recommendations: 3 }
    ],
    stateDistribution: [
      { name: 'Maharashtra', value: 6 },
      { name: 'Punjab', value: 5 },
      { name: 'Uttar Pradesh', value: 4 },
      { name: 'Karnataka', value: 3 },
      { name: 'Gujarat', value: 2 }
    ],
    avgSuitabilityByCategory: [
      { category: 'Rice', suitability: 92, fullMark: 100 },
      { category: 'Wheat', suitability: 88, fullMark: 100 },
      { category: 'Maize', suitability: 85, fullMark: 100 },
      { category: 'Cotton', suitability: 78, fullMark: 100 },
      { category: 'Sugarcane', suitability: 72, fullMark: 100 }
    ],
    recentActivity: [
      { date: '28/01/2026', location: 'Pune, Maharashtra', season: 'Rabi', topCrop: 'Wheat' },
      { date: '25/01/2026', location: 'Ludhiana, Punjab', season: 'Rabi', topCrop: 'Wheat' },
      { date: '22/01/2026', location: 'Lucknow, Uttar Pradesh', season: 'Rabi', topCrop: 'Mustard' },
      { date: '20/01/2026', location: 'Bengaluru, Karnataka', season: 'Rabi', topCrop: 'Ragi' },
      { date: '18/01/2026', location: 'Ahmedabad, Gujarat', season: 'Rabi', topCrop: 'Cumin' }
    ]
  };

  // Colors for charts
  const COLORS = ['#2E7D32', '#4CAF50', '#81C784', '#A5D6A7', '#C8E6C9', '#1B5E20', '#388E3C', '#66BB6A'];
  const SEASON_COLORS = {
    'Kharif': '#FF6B6B',
    'Rabi': '#4ECDC4',
    'Summer': '#FFE66D',
    'Winter': '#95E1D3',
    'Autumn': '#F38181',
    'Whole Year': '#AA96DA'
  };

  useEffect(() => {
    // Reset state when user or token changes
    setRecommendations([]);
    setAnalytics({
      totalRecommendations: 0,
      cropDistribution: [],
      seasonDistribution: [],
      monthlyTrend: [],
      stateDistribution: [],
      avgSuitabilityByCategory: [],
      recentActivity: []
    });
    setUseDemoData(false);
    if (!authLoading && user && token) {
      fetchAnalytics();
    }
    // eslint-disable-next-line
  }, [user, authLoading, token]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.get('/recommendations/history');
      const data = res.data.recommendations || [];
      setRecommendations(data);

      if (data.length === 0) {
        // No real data, show demo data by default
        setUseDemoData(true);
        setAnalytics(demoAnalytics);
      } else {
        setUseDemoData(false);
        processAnalytics(data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // On error, show demo data
      setUseDemoData(true);
      setAnalytics(demoAnalytics);
    } finally {
      setLoading(false);
    }
  };

  const toggleDemoData = () => {
    if (useDemoData && recommendations.length > 0) {
      setUseDemoData(false);
      processAnalytics(recommendations);
    } else {
      setUseDemoData(true);
      setAnalytics(demoAnalytics);
    }
  };

  const processAnalytics = (data) => {
    // Total recommendations
    const totalRecommendations = data.length;

    // Crop distribution
    const cropCount = {};
    data.forEach(rec => {
      rec.recommendations?.forEach(crop => {
        const name = crop.cropName || 'Unknown';
        cropCount[name] = (cropCount[name] || 0) + 1;
      });
    });
    const cropDistribution = Object.entries(cropCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    // Season distribution
    const seasonCount = {};
    data.forEach(rec => {
      const season = rec.season || 'Unknown';
      seasonCount[season] = (seasonCount[season] || 0) + 1;
    });
    const seasonDistribution = Object.entries(seasonCount)
      .map(([name, value]) => ({ name, value, fill: SEASON_COLORS[name] || '#888' }));

    // Monthly trend (last 6 months)
    const monthlyCount = {};
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    data.forEach(rec => {
      const date = new Date(rec.createdAt);
      const monthYear = `${months[date.getMonth()]} ${date.getFullYear()}`;
      monthlyCount[monthYear] = (monthlyCount[monthYear] || 0) + 1;
    });
    const monthlyTrend = Object.entries(monthlyCount)
      .map(([month, count]) => ({ month, recommendations: count }))
      .slice(-6);

    // State distribution
    const stateCount = {};
    data.forEach(rec => {
      const state = rec.location?.state || 'Unknown';
      stateCount[state] = (stateCount[state] || 0) + 1;
    });
    const stateDistribution = Object.entries(stateCount)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);

    // Average suitability by crop category
    const suitabilitySum = {};
    const suitabilityCount = {};
    data.forEach(rec => {
      rec.recommendations?.forEach(crop => {
        const name = crop.cropName || 'Unknown';
        suitabilitySum[name] = (suitabilitySum[name] || 0) + (crop.suitabilityScore || 0);
        suitabilityCount[name] = (suitabilityCount[name] || 0) + 1;
      });
    });
    const avgSuitabilityByCategory = Object.keys(suitabilitySum)
      .map(name => ({
        category: name.replace('CEREALS_', '').replace('_', ' '),
        suitability: Math.round(suitabilitySum[name] / suitabilityCount[name]),
        fullMark: 100
      }))
      .slice(0, 6);

    // Recent activity
    const recentActivity = data.slice(0, 5).map(rec => ({
      date: new Date(rec.createdAt).toLocaleDateString(),
      location: `${rec.location?.district || ''}, ${rec.location?.state || ''}`,
      season: rec.season || 'N/A',
      topCrop: rec.recommendations?.[0]?.cropName || 'N/A'
    }));

    setAnalytics({
      totalRecommendations,
      cropDistribution,
      seasonDistribution,
      monthlyTrend,
      stateDistribution,
      avgSuitabilityByCategory,
      recentActivity
    });
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-stone-50 w-full font-sans py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <div className="w-[50px] h-[50px] border-4 border-stone-200 border-t-[#2E7D32] rounded-full animate-spin"></div>
          <p className="mt-4 text-stone-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

  const getSeasonBadgeClass = (season) => {
    switch (season.toLowerCase().replace(' ', '-')) {
      case 'kharif': return 'bg-orange-100 text-orange-700';
      case 'rabi': return 'bg-sky-100 text-sky-700';
      case 'summer': return 'bg-yellow-100 text-yellow-700';
      case 'winter': return 'bg-teal-100 text-teal-700';
      case 'autumn': return 'bg-red-100 text-red-700';
      case 'whole-year': return 'bg-stone-100 text-stone-700';
      default: return 'bg-gray-200 text-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 w-full font-sans py-12 px-4 sm:px-6 lg:px-8">
      {/* Debug: Show logged-in user info */}
      <div style={{ background: '#f6f6f6', padding: '8px 16px', borderRadius: 6, marginBottom: 12, fontSize: 14, color: '#333' }}>
        <strong>Logged in as:</strong> {user?.email || user?.name || user?._id || 'Unknown'}
      </div>
      {/* Header */}
      <div className="flex justify-between items-center mb-8 pb-4 border-b-2 border-[rgba(46,125,50,0.1)] flex-wrap gap-4 max-md:flex-col max-md:text-center">
        <div>
          <h1 className="text-emerald-600xl text-stone-900 m-0 flex items-center gap-2 max-md:text-xl"> Analytics Dashboard</h1>
          <p className="text-stone-500 mt-2 mb-0">Insights from your crop recommendations</p>
        </div>
        <div className="flex items-center gap-4 flex-wrap justify-end">
          {useDemoData && (
            <div className="flex items-center gap-2 py-2 px-4 bg-stone-50 border border-stone-200 text-stone-900 rounded-full text-[0.85rem] font-semibold">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4M12 8h.01"></path>
              </svg>
              Demo Data
            </div>
          )}
          {recommendations.length > 0 && (
            <button className="py-2.5 px-5 bg-slate-100 border-emerald-500 border-emerald-200 text-stone-600 rounded-md font-semibold transition-all duration-300 hover:bg-slate-200 hover:border-emerald-200" onClick={toggleDemoData}>
              {useDemoData ? 'Show My Data' : 'Show Demo'}
            </button>
          )}
          <button className="flex items-center gap-2 py-3 px-6 bg-white border-emerald-500 border-emerald-200 text-stone-900 rounded-md font-semibold transition-all duration-300 hover:bg-emerald-50 hover:text-white" onClick={fetchAnalytics}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Demo Data Notice */}
      {useDemoData && recommendations.length === 0 && (
        <div className="flex items-center gap-6 p-6 px-8 bg-stone-50 border border-stone-200 border-emerald-500 border-emerald-200 rounded-lg mb-8">
          <svg className="text-stone-900 shrink-0 w-[48px] h-[48px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <div>
            <h4 className="m-0 mb-2 text-stone-900 text-[1.1rem]">You're viewing demo data</h4>
            <p className="m-0 mb-4 text-stone-900">Generate crop recommendations to see your personalized analytics here.</p>
            <button onClick={() => navigate('/dashboard')} className="py-2.5 px-6 bg-emerald-50 text-white border-none rounded-lg font-semibold transition-all duration-300 hover:bg-emerald-50 hover:-translate-y-0.5">
              Get Recommendations
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-[repeat(au gap-6 mb-8 items-stretch max-md:grid-cols-2 max-sm:grid-cols-1">
        <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm max-md:flex-col max-md:text-center max-md:p-4">
          <div className="w-[60px] h-[60px] rounded-lg flex items-center justify-center text-white bg-stone-50 border border-stone-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10M18 20V4M6 20v-4" />
            </svg>
          </div>
          <div>
            <h3 className="text-emerald-600xl text-stone-900 m-0 font-bold max-md:text-xl">{analytics.totalRecommendations}</h3>
            <p className="text-stone-500 m-0 text-[0.9rem]">Total Recommendations</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm max-md:flex-col max-md:text-center max-md:p-4">
          <div className="w-[60px] h-[60px] rounded-lg flex items-center justify-center text-white bg-stone-50 border border-stone-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div>
            <h3 className="text-emerald-600xl text-stone-900 m-0 font-bold max-md:text-xl">{analytics.cropDistribution.length}</h3>
            <p className="text-stone-500 m-0 text-[0.9rem]">Unique Crops</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm max-md:flex-col max-md:text-center max-md:p-4">
          <div className="w-[60px] h-[60px] rounded-lg flex items-center justify-center text-white bg-stone-50 border border-stone-200">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div>
            <h3 className="text-emerald-600xl text-stone-900 m-0 font-bold max-md:text-xl">{analytics.seasonDistribution.length}</h3>
            <p className="text-stone-500 m-0 text-[0.9rem]">Seasons Covered</p>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 flex items-center gap-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-sm max-md:flex-col max-md:text-center max-md:p-4">
          <div className="w-[60px] h-[60px] rounded-lg flex items-center justify-center text-white">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div>
            <h3 className="text-emerald-600xl text-stone-900 m-0 font-bold max-md:text-xl">{analytics.stateDistribution.length}</h3>
            <p className="text-stone-500 m-0 text-[0.9rem]">States Analyzed</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6 mb-8 items-stretch max-lg:grid-cols-1">
        {/* Crop Distribution - Pie Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-full">
          <h3 className="text-[1.2rem] text-stone-900 m-0 mb-1 flex items-center gap-2"> Crop Distribution</h3>
          <p className="text-stone-900 text-[0.85rem] m-0 mb-4">Most recommended crop categories</p>
          {analytics.cropDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.cropDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name.replace('CEREALS_', '')} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {analytics.cropDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip wrapperClassName="recharts-default-tooltip bg-white border border-emerald-200 rounded-lg shadow-sm" itemStyle={{fontWeight:600, color:'#333'}} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-stone-900 text-[1rem] bg-emerald-50 rounded-md">No data available</div>
          )}
        </div>

        {/* Season Distribution - Bar Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-full">
          <h3 className="text-[1.2rem] text-stone-900 m-0 mb-1 flex items-center gap-2">️ Season Distribution</h3>
          <p className="text-stone-900 text-[0.85rem] m-0 mb-4">Recommendations by season</p>
          {analytics.seasonDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.seasonDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip wrapperClassName="recharts-default-tooltip bg-white border border-emerald-200 rounded-lg shadow-sm" itemStyle={{fontWeight:600, color:'#333'}} />
                <Bar dataKey="value" name="Recommendations">
                  {analytics.seasonDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-stone-900 text-[1rem] bg-emerald-50 rounded-md">No data available</div>
          )}
        </div>

        {/* Monthly Trend - Area Chart */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-full col-span-2 max-lg:col-span-1">
          <h3 className="text-[1.2rem] text-stone-900 m-0 mb-1 flex items-center gap-2"> Monthly Trend</h3>
          <p className="text-stone-900 text-[0.85rem] m-0 mb-4">Recommendation activity over time</p>
          {analytics.monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip wrapperClassName="recharts-default-tooltip bg-white border border-emerald-200 rounded-lg shadow-sm" itemStyle={{fontWeight:600, color:'#333'}} />
                <Area 
                  type="monotone" 
                  dataKey="recommendations" 
                  stroke="#2E7D32" 
                  fill="url(#colorGreen)" 
                  name="Recommendations"
                />
                <defs>
                  <linearGradient id="colorGreen" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#2E7D32" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-stone-900 text-[1rem] bg-emerald-50 rounded-md">No data available</div>
          )}
        </div>

        {/* State Distribution - Horizontal Bar */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-full">
          <h3 className="text-[1.2rem] text-stone-900 m-0 mb-1 flex items-center gap-2"> Top States</h3>
          <p className="text-stone-900 text-[0.85rem] m-0 mb-4">Recommendations by location</p>
          {analytics.stateDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={analytics.stateDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip wrapperClassName="recharts-default-tooltip bg-white border border-emerald-200 rounded-lg shadow-sm" itemStyle={{fontWeight:600, color:'#333'}} />
                <Bar dataKey="value" fill="#4CAF50" name="Recommendations" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-stone-900 text-[1rem] bg-emerald-50 rounded-md">No data available</div>
          )}
        </div>

        {/* Suitability Radar */}
        <div className="bg-white rounded-lg p-6 shadow-sm h-full">
          <h3 className="text-[1.2rem] text-stone-900 m-0 mb-1 flex items-center gap-2"> Crop Suitability</h3>
          <p className="text-stone-900 text-[0.85rem] m-0 mb-4">Average suitability scores</p>
          {analytics.avgSuitabilityByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={analytics.avgSuitabilityByCategory}>
                <PolarGrid />
                <PolarAngleAxis dataKey="category" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar 
                  name="Suitability" 
                  dataKey="suitability" 
                  stroke="#2E7D32" 
                  fill="#4CAF50" 
                  fillOpacity={0.5} 
                />
                <Tooltip wrapperClassName="recharts-default-tooltip bg-white border border-emerald-200 rounded-lg shadow-sm" itemStyle={{fontWeight:600, color:'#333'}} />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[200px] text-stone-900 text-[1rem] bg-emerald-50 rounded-md">No data available</div>
          )}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-lg p-6 shadow-sm mb-8">
        <h3 className="text-[1.2rem] text-stone-900 m-0 mb-4 flex items-center gap-2"> Recent Activity</h3>
        {analytics.recentActivity.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-4 text-left border-b border-emerald-200 bg-stone-50 font-semibold text-stone-800">Date</th>
                  <th className="p-4 text-left border-b border-emerald-200 bg-stone-50 font-semibold text-stone-800">Location</th>
                  <th className="p-4 text-left border-b border-emerald-200 bg-stone-50 font-semibold text-stone-800">Season</th>
                  <th className="p-4 text-left border-b border-emerald-200 bg-stone-50 font-semibold text-stone-800">Top Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentActivity.map((activity, index) => (
                  <tr key={index} className="hover:bg-stone-50">
                    <td className="p-4 text-left border-b border-emerald-200">{activity.date}</td>
                    <td className="p-4 text-left border-b border-emerald-200">{activity.location}</td>
                    <td className="p-4 text-left border-b border-emerald-200">
                      <span className={`py-1 px-3 rounded-full text-[0.8rem] font-semibold ${getSeasonBadgeClass(activity.season)}`}>
                        {activity.season}
                      </span>
                    </td>
                    <td className="p-4 text-left border-b border-emerald-200">{activity.topCrop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex items-center justify-center h-[200px] text-stone-900 text-[1rem] bg-emerald-50 rounded-md">No recent activity</div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="flex gap-4 justify-center max-md:flex-col">
        <button onClick={() => navigate('/dashboard')} className="flex items-center justify-center gap-2 py-4 px-8 rounded-md text-[1rem] font-semibold transition-all duration-300 bg-stone-50 border border-stone-200 text-white border-none hover:-translate-y-0.5 hover:shadow-sm">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Recommendation
        </button>
        <button onClick={() => navigate('/history')} className="flex items-center justify-center gap-2 py-4 px-8 rounded-md text-[1rem] font-semibold transition-all duration-300 bg-white text-stone-900 border-emerald-500 border-emerald-200 hover:bg-emerald-50">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 6v6l4 2" />
          </svg>
          View History
        </button>
      </div>
    </div>
  );
};

export default Analytics;
