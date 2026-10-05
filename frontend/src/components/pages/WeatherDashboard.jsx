
import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import './WeatherDashboard.css';
import indiaStatesDistricts from '../../data/indiaStatesDistricts.json';

const WeatherDashboard = () => {
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [forecastDays, setForecastDays] = useState(7);

  // Get all states
  const states = Object.keys(indiaStatesDistricts);
  // Get districts for selected state
  const districts = selectedState ? indiaStatesDistricts[selectedState] : [];

  // Sample weather data generator
  const generateWeatherData = (days) => {
    const baseTemp = 25 + Math.random() * 10;
    const data = [];
    const conditions = ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Heavy Rain', 'Thunderstorm'];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      
      data.push({
        date: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        tempMax: Math.round(baseTemp + Math.random() * 8),
        tempMin: Math.round(baseTemp - 5 + Math.random() * 5),
        humidity: Math.round(50 + Math.random() * 40),
        rainfall: Math.random() > 0.6 ? Math.round(Math.random() * 30) : 0,
        windSpeed: Math.round(5 + Math.random() * 20),
        uvIndex: Math.round(3 + Math.random() * 8),
        condition: conditions[Math.floor(Math.random() * conditions.length)],
        soilMoisture: Math.round(30 + Math.random() * 50),
      });
    }
    return data;
  };

  // Current weather data
  const [currentWeather, setCurrentWeather] = useState({
    temperature: 28,
    feelsLike: 31,
    humidity: 65,
    windSpeed: 12,
    windDirection: 'NW',
    pressure: 1013,
    visibility: 10,
    uvIndex: 7,
    condition: 'Partly Cloudy',
    sunrise: '06:15 AM',
    sunset: '06:45 PM',
  });

  useEffect(() => {
    if (selectedState && selectedDistrict) {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setWeatherData(generateWeatherData(forecastDays));
        setCurrentWeather({
          temperature: Math.round(25 + Math.random() * 10),
          feelsLike: Math.round(28 + Math.random() * 8),
          humidity: Math.round(50 + Math.random() * 40),
          windSpeed: Math.round(8 + Math.random() * 15),
          windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
          pressure: Math.round(1008 + Math.random() * 15),
          visibility: Math.round(8 + Math.random() * 5),
          uvIndex: Math.round(4 + Math.random() * 6),
          condition: ['Sunny', 'Partly Cloudy', 'Cloudy'][Math.floor(Math.random() * 3)],
          sunrise: '06:15 AM',
          sunset: '06:45 PM',
        });
        setLoading(false);
      }, 1000);
    }
  }, [selectedState, selectedDistrict, forecastDays]);

  const getConditionIcon = (condition) => {
    const icons = {
      'Sunny': '☀️',
      'Partly Cloudy': '⛅',
      'Cloudy': '☁️',
      'Light Rain': '🌧️',
      'Heavy Rain': '⛈️',
      'Thunderstorm': '🌩️',
    };
    return icons[condition] || '🌤️';
  };

  const getUVLevel = (index) => {
    if (index <= 2) return { level: 'Low', color: '#4CAF50' };
    if (index <= 5) return { level: 'Moderate', color: '#FFC107' };
    if (index <= 7) return { level: 'High', color: '#FF9800' };
    if (index <= 10) return { level: 'Very High', color: '#f44336' };
    return { level: 'Extreme', color: '#9c27b0' };
  };

  const getAgriAlert = (weather) => {
    const alerts = [];
    if (weather.rainfall > 20) {
      alerts.push({ type: 'warning', message: 'Heavy rainfall expected - avoid spraying pesticides' });
    }
    if (weather.tempMax > 38) {
      alerts.push({ type: 'danger', message: 'Extreme heat - provide shade for crops and increase irrigation' });
    }
    if (weather.humidity > 85) {
      alerts.push({ type: 'info', message: 'High humidity - monitor for fungal diseases' });
    }
    if (weather.windSpeed > 25) {
      alerts.push({ type: 'warning', message: 'Strong winds expected - secure greenhouses and supports' });
    }
    return alerts;
  };

  return (
    <div className="weather-dashboard">
      <div className="weather-header">
        <h1>🌤️ Weather Dashboard</h1>
        <p>Real-time weather insights for smarter farming decisions</p>
      </div>

      {/* Location Selector */}
      <div className="location-selector">
        <div className="selector-card">
          <label>Select State</label>
          <select
            value={selectedState}
            onChange={e => {
              setSelectedState(e.target.value);
              setSelectedDistrict('');
            }}
          >
            <option value="">Choose a state...</option>
            {states.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </div>
        <div className="selector-card">
          <label>Select District</label>
          <select
            value={selectedDistrict}
            onChange={e => setSelectedDistrict(e.target.value)}
            disabled={!selectedState}
          >
            <option value="">{selectedState ? 'Choose a district...' : 'Select state first'}</option>
            {districts.map(district => (
              <option key={district} value={district}>{district}</option>
            ))}
          </select>
        </div>
        <div className="selector-card">
          <label>Forecast Period</label>
          <div className="period-buttons">
            {[7, 14, 30].map(days => (
              <button
                key={days}
                className={forecastDays === days ? 'active' : ''}
                onClick={() => setForecastDays(days)}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {!loading && selectedState && selectedDistrict && weatherData && (
        <>
          {/* Current Weather Card */}
          <div className="current-weather-card">
            <div className="current-main">
              <div className="temp-section">
                <span className="weather-icon">{getConditionIcon(currentWeather.condition)}</span>
                <div className="temp-info">
                  <span className="current-temp">{currentWeather.temperature}°C</span>
                  <span className="feels-like">Feels like {currentWeather.feelsLike}°C</span>
                </div>
              </div>
              <div className="condition-text">
                <h3>{currentWeather.condition}</h3>
                <p>{selectedDistrict}, {selectedState}</p>
              </div>
            </div>
            
            <div className="current-details">
              <div className="detail-item">
                <span className="detail-icon">💧</span>
                <span className="detail-value">{currentWeather.humidity}%</span>
                <span className="detail-label">Humidity</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">💨</span>
                <span className="detail-value">{currentWeather.windSpeed} km/h</span>
                <span className="detail-label">Wind {currentWeather.windDirection}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">👁️</span>
                <span className="detail-value">{currentWeather.visibility} km</span>
                <span className="detail-label">Visibility</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🌡️</span>
                <span className="detail-value">{currentWeather.pressure} hPa</span>
                <span className="detail-label">Pressure</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon" style={{ color: getUVLevel(currentWeather.uvIndex).color }}>☀️</span>
                <span className="detail-value">{currentWeather.uvIndex}</span>
                <span className="detail-label">UV {getUVLevel(currentWeather.uvIndex).level}</span>
              </div>
              <div className="detail-item">
                <span className="detail-icon">🌅</span>
                <span className="detail-value">{currentWeather.sunrise}</span>
                <span className="detail-label">Sunrise</span>
              </div>
            </div>
          </div>

          {/* Agricultural Alerts */}
          {weatherData.some(day => getAgriAlert(day).length > 0) && (
            <div className="agri-alerts">
              <h3>🌱 Agricultural Alerts</h3>
              <div className="alerts-list">
                {weatherData.slice(0, 3).flatMap((day, i) => 
                  getAgriAlert(day).map((alert, j) => (
                    <div key={`${i}-${j}`} className={`alert-item ${alert.type}`}>
                      <span className="alert-icon">
                        {alert.type === 'warning' ? '⚠️' : alert.type === 'danger' ? '🚨' : 'ℹ️'}
                      </span>
                      <span>{alert.message}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Weather Forecast Cards */}
          <div className="forecast-section">
            <h3>📅 {forecastDays}-Day Forecast</h3>
            <div className="forecast-cards">
              {weatherData.slice(0, 7).map((day, index) => (
                <div key={index} className="forecast-card">
                  <div className="forecast-day">{day.day}</div>
                  <div className="forecast-icon">{getConditionIcon(day.condition)}</div>
                  <div className="forecast-temps">
                    <span className="temp-high">{day.tempMax}°</span>
                    <span className="temp-low">{day.tempMin}°</span>
                  </div>
                  <div className="forecast-rain">
                    <span>💧 {day.rainfall}mm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            {/* Temperature Chart */}
            <div className="chart-card">
              <h3>🌡️ Temperature Trend</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={['auto', 'auto']} unit="°C" />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="tempMax" name="Max Temp" stroke="#f44336" fill="rgba(244, 67, 54, 0.2)" />
                  <Area type="monotone" dataKey="tempMin" name="Min Temp" stroke="#2196F3" fill="rgba(33, 150, 243, 0.2)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            {/* Rainfall Chart */}
            <div className="chart-card">
              <h3>🌧️ Rainfall Prediction</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis unit="mm" />
                  <Tooltip />
                  <Bar dataKey="rainfall" name="Rainfall" fill="#4CAF50" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Humidity & Wind Chart */}
            <div className="chart-card">
              <h3>💨 Humidity & Wind Speed</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis yAxisId="left" unit="%" />
                  <YAxis yAxisId="right" orientation="right" unit=" km/h" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="humidity" name="Humidity %" stroke="#9C27B0" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="windSpeed" name="Wind Speed" stroke="#FF9800" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Soil Moisture Chart */}
            <div className="chart-card">
              <h3>🌱 Soil Moisture Estimation</h3>
              <ResponsiveContainer width="100%" height={250}>
                <AreaChart data={weatherData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 100]} unit="%" />
                  <Tooltip />
                  <Area type="monotone" dataKey="soilMoisture" name="Soil Moisture" stroke="#795548" fill="rgba(121, 85, 72, 0.3)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Farming Tips */}
          <div className="farming-tips">
            <h3>🌾 Weather-Based Farming Tips</h3>
            <div className="tips-grid">
              <div className="tip-card">
                <span className="tip-icon">💧</span>
                <h4>Irrigation</h4>
                <p>
                  {currentWeather.humidity > 70 
                    ? 'High humidity - reduce irrigation frequency' 
                    : 'Normal humidity - maintain regular watering schedule'}
                </p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🌡️</span>
                <h4>Temperature Management</h4>
                <p>
                  {currentWeather.temperature > 35 
                    ? 'Apply mulching to protect roots from heat' 
                    : 'Conditions favorable for most crops'}
                </p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🌧️</span>
                <h4>Rainfall Preparedness</h4>
                <p>
                  {weatherData.some(d => d.rainfall > 10) 
                    ? 'Rain expected - ensure proper drainage' 
                    : 'Low rainfall expected - plan irrigation accordingly'}
                </p>
              </div>
              <div className="tip-card">
                <span className="tip-icon">🐛</span>
                <h4>Pest Control</h4>
                <p>
                  {currentWeather.humidity > 80 
                    ? 'High humidity increases pest risk - monitor closely' 
                    : 'Moderate conditions - routine monitoring sufficient'}
                </p>
              </div>
            </div>
          </div>
        </>
      )}

      {!(selectedState && selectedDistrict) && (
        <div className="empty-state">
          <span className="empty-icon">📍</span>
          <h3>Select a Location</h3>
          <p>Choose your state and district to view weather information and agricultural insights</p>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
