import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area, RadarChart, Radar,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import api from '../../utils/api';
import './Analytics.css';

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
      <div className="analytics-container">
        <div className="analytics-loading">
          <div className="loading-spinner"></div>
          <p>Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="analytics-container">
      {/* Debug: Show logged-in user info */}
      <div style={{ background: '#f6f6f6', padding: '8px 16px', borderRadius: 6, marginBottom: 12, fontSize: 14, color: '#333' }}>
        <strong>Logged in as:</strong> {user?.email || user?.name || user?._id || 'Unknown'}
      </div>
      {/* Header */}
      <div className="analytics-header">
        <div className="header-content">
          <h1>📊 Analytics Dashboard</h1>
          <p>Insights from your crop recommendations</p>
        </div>
        <div className="header-actions">
          {useDemoData && (
            <div className="demo-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 16v-4M12 8h.01"></path>
              </svg>
              Demo Data
            </div>
          )}
          {recommendations.length > 0 && (
            <button className="toggle-btn" onClick={toggleDemoData}>
              {useDemoData ? 'Show My Data' : 'Show Demo'}
            </button>
          )}
          <button className="refresh-btn" onClick={fetchAnalytics}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Demo Data Notice */}
      {useDemoData && recommendations.length === 0 && (
        <div className="demo-notice">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
            <path d="M2 17l10 5 10-5"></path>
            <path d="M2 12l10 5 10-5"></path>
          </svg>
          <div className="notice-content">
            <h4>You're viewing demo data</h4>
            <p>Generate crop recommendations to see your personalized analytics here.</p>
            <button onClick={() => navigate('/dashboard')} className="get-started-btn">
              Get Recommendations
            </button>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 20V10M18 20V4M6 20v-4" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>{analytics.totalRecommendations}</h3>
            <p>Total Recommendations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon blue">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>{analytics.cropDistribution.length}</h3>
            <p>Unique Crops</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>{analytics.seasonDistribution.length}</h3>
            <p>Seasons Covered</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon purple">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </div>
          <div className="stat-info">
            <h3>{analytics.stateDistribution.length}</h3>
            <p>States Analyzed</p>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Crop Distribution - Pie Chart */}
        <div className="chart-card">
          <h3>🌾 Crop Distribution</h3>
          <p className="chart-subtitle">Most recommended crop categories</p>
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>

        {/* Season Distribution - Bar Chart */}
        <div className="chart-card">
          <h3>🗓️ Season Distribution</h3>
          <p className="chart-subtitle">Recommendations by season</p>
          {analytics.seasonDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.seasonDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" name="Recommendations">
                  {analytics.seasonDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>

        {/* Monthly Trend - Area Chart */}
        <div className="chart-card wide">
          <h3>📈 Monthly Trend</h3>
          <p className="chart-subtitle">Recommendation activity over time</p>
          {analytics.monthlyTrend.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={analytics.monthlyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
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
            <div className="no-data">No data available</div>
          )}
        </div>

        {/* State Distribution - Horizontal Bar */}
        <div className="chart-card">
          <h3>📍 Top States</h3>
          <p className="chart-subtitle">Recommendations by location</p>
          {analytics.stateDistribution.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart layout="vertical" data={analytics.stateDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={100} />
                <Tooltip />
                <Bar dataKey="value" fill="#4CAF50" name="Recommendations" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>

        {/* Suitability Radar */}
        <div className="chart-card">
          <h3>🎯 Crop Suitability</h3>
          <p className="chart-subtitle">Average suitability scores</p>
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
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          ) : (
            <div className="no-data">No data available</div>
          )}
        </div>
      </div>

      {/* Recent Activity Table */}
      <div className="activity-section">
        <h3>🕐 Recent Activity</h3>
        {analytics.recentActivity.length > 0 ? (
          <div className="activity-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Location</th>
                  <th>Season</th>
                  <th>Top Recommendation</th>
                </tr>
              </thead>
              <tbody>
                {analytics.recentActivity.map((activity, index) => (
                  <tr key={index}>
                    <td>{activity.date}</td>
                    <td>{activity.location}</td>
                    <td>
                      <span className={`season-badge ${activity.season.toLowerCase().replace(' ', '-')}`}>
                        {activity.season}
                      </span>
                    </td>
                    <td>{activity.topCrop}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-data">No recent activity</div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <button onClick={() => navigate('/dashboard')} className="action-btn primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 5v14M5 12h14" />
          </svg>
          New Recommendation
        </button>
        <button onClick={() => navigate('/history')} className="action-btn secondary">
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
