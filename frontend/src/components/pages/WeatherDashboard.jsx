import React, { useState, useEffect } from 'react';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
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
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-[#e3f2fd] to-[#bbdefb] p-4 sm:p-8">
      <div className="text-center mb-8 px-4 sm:px-8">
        <h1 className="text-[1.8rem] sm:text-[2.5rem] text-[#1a1a2e] m-0 font-bold">🌤️ Weather Dashboard</h1>
        <p className="text-[#666] text-base sm:text-[1.1rem] mt-2">Real-time weather insights for smarter farming decisions</p>
      </div>

      {/* Location Selector */}
      <div className="flex flex-col sm:flex-row gap-6 max-w-[800px] mx-auto mb-8 flex-wrap">
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <label className="block font-semibold text-[#333] mb-3">Select State</label>
          <select
            className="w-full p-3 border-2 border-[#e0e0e0] rounded-xl text-base cursor-pointer transition-all duration-300 focus:border-[#2196F3] focus:outline-none"
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
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <label className="block font-semibold text-[#333] mb-3">Select District</label>
          <select
            className="w-full p-3 border-2 border-[#e0e0e0] rounded-xl text-base cursor-pointer transition-all duration-300 focus:border-[#2196F3] focus:outline-none"
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
        <div className="flex-1 bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <label className="block font-semibold text-[#333] mb-3">Forecast Period</label>
          <div className="flex gap-2">
            {[7, 14, 30].map(days => (
              <button
                key={days}
                className={`flex-1 p-3 border-2 rounded-xl bg-white cursor-pointer transition-all duration-300 font-medium hover:border-[#2196F3] ${
                  forecastDays === days ? 'bg-[#2196F3] border-[#2196F3] text-white' : 'border-[#e0e0e0]'
                }`}
                onClick={() => setForecastDays(days)}
              >
                {days} Days
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-16">
          <div className="w-[50px] h-[50px] border-4 border-[#e0e0e0] border-t-[#2196F3] rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading weather data...</p>
        </div>
      )}

      {!loading && selectedState && selectedDistrict && weatherData && (
        <>
          {/* Current Weather Card */}
          <div className="bg-gradient-to-br from-[#2196F3] to-[#1976D2] text-white rounded-[20px] p-6 sm:p-8 max-w-[1000px] mx-auto mb-8 shadow-[0_10px_40px_rgba(33,150,243,0.3)]">
            <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-6 mb-8">
              <div className="flex items-center gap-6">
                <span className="text-[4rem] sm:text-[5rem]">{getConditionIcon(currentWeather.condition)}</span>
                <div className="flex flex-col">
                  <span className="text-[3rem] sm:text-[4rem] font-bold leading-none">{currentWeather.temperature}°C</span>
                  <span className="text-base opacity-90 mt-2">Feels like {currentWeather.feelsLike}°C</span>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <h3 className="text-[1.8rem] m-0 font-bold">{currentWeather.condition}</h3>
                <p className="opacity-90 mt-2 mb-0">{selectedDistrict}, {selectedState}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 pt-6 border-t border-white/20">
              <div className="text-center">
                <span className="text-[1.5rem] block mb-2">💧</span>
                <span className="block text-[1.2rem] font-semibold">{currentWeather.humidity}%</span>
                <span className="block text-[0.8rem] opacity-80 mt-1">Humidity</span>
              </div>
              <div className="text-center">
                <span className="text-[1.5rem] block mb-2">💨</span>
                <span className="block text-[1.2rem] font-semibold">{currentWeather.windSpeed} km/h</span>
                <span className="block text-[0.8rem] opacity-80 mt-1">Wind {currentWeather.windDirection}</span>
              </div>
              <div className="text-center">
                <span className="text-[1.5rem] block mb-2">👁️</span>
                <span className="block text-[1.2rem] font-semibold">{currentWeather.visibility} km</span>
                <span className="block text-[0.8rem] opacity-80 mt-1">Visibility</span>
              </div>
              <div className="text-center">
                <span className="text-[1.5rem] block mb-2">🌡️</span>
                <span className="block text-[1.2rem] font-semibold">{currentWeather.pressure} hPa</span>
                <span className="block text-[0.8rem] opacity-80 mt-1">Pressure</span>
              </div>
              <div className="text-center">
                <span className="text-[1.5rem] block mb-2" style={{ color: getUVLevel(currentWeather.uvIndex).color }}>☀️</span>
                <span className="block text-[1.2rem] font-semibold">{currentWeather.uvIndex}</span>
                <span className="block text-[0.8rem] opacity-80 mt-1">UV {getUVLevel(currentWeather.uvIndex).level}</span>
              </div>
              <div className="text-center">
                <span className="text-[1.5rem] block mb-2">🌅</span>
                <span className="block text-[1.2rem] font-semibold">{currentWeather.sunrise}</span>
                <span className="block text-[0.8rem] opacity-80 mt-1">Sunrise</span>
              </div>
            </div>
          </div>

          {/* Agricultural Alerts */}
          {weatherData.some(day => getAgriAlert(day).length > 0) && (
            <div className="bg-white rounded-2xl p-6 max-w-[1000px] mx-auto mb-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h3 className="m-0 mb-4 text-[#1a1a2e] font-bold">🌱 Agricultural Alerts</h3>
              <div className="flex flex-col gap-3">
                {weatherData.slice(0, 3).flatMap((day, i) => 
                  getAgriAlert(day).map((alert, j) => {
                    const alertStyles = {
                      warning: 'bg-[#FF9800]/10 border-l-4 border-[#FF9800]',
                      danger: 'bg-[#f44336]/10 border-l-4 border-[#f44336]',
                      info: 'bg-[#2196F3]/10 border-l-4 border-[#2196F3]',
                    };
                    return (
                      <div key={`${i}-${j}`} className={`flex items-center gap-4 p-4 rounded-xl ${alertStyles[alert.type]}`}>
                        <span className="text-[1.5rem]">
                          {alert.type === 'warning' ? '⚠️' : alert.type === 'danger' ? '🚨' : 'ℹ️'}
                        </span>
                        <span>{alert.message}</span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* Weather Forecast Cards */}
          <div className="max-w-[1000px] mx-auto mb-8">
            <h3 className="text-[#1a1a2e] mb-4 font-bold">📅 {forecastDays}-Day Forecast</h3>
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
              {weatherData.slice(0, 7).map((day, index) => (
                <div key={index} className="bg-white rounded-2xl p-5 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
                  <div className="font-semibold text-[#666] mb-3">{day.day}</div>
                  <div className="text-[2.5rem] mb-3">{getConditionIcon(day.condition)}</div>
                  <div className="flex justify-center gap-2 mb-2">
                    <span className="text-[#f44336] font-semibold">{day.tempMax}°</span>
                    <span className="text-[#2196F3]">{day.tempMin}°</span>
                  </div>
                  <div className="text-[0.85rem] text-[#666]">
                    <span>💧 {day.rainfall}mm</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1200px] mx-auto mb-8">
            {/* Temperature Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h3 className="m-0 mb-4 text-[#1a1a2e] text-[1.1rem] font-bold">🌡️ Temperature Trend</h3>
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
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h3 className="m-0 mb-4 text-[#1a1a2e] text-[1.1rem] font-bold">🌧️ Rainfall Prediction</h3>
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
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h3 className="m-0 mb-4 text-[#1a1a2e] text-[1.1rem] font-bold">💨 Humidity & Wind Speed</h3>
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
            <div className="bg-white rounded-2xl p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h3 className="m-0 mb-4 text-[#1a1a2e] text-[1.1rem] font-bold">🌱 Soil Moisture Estimation</h3>
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
          <div className="max-w-[1000px] mx-auto">
            <h3 className="text-[#1a1a2e] mb-4 font-bold">🌾 Weather-Based Farming Tips</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <span className="text-[2.5rem] block mb-4">💧</span>
                <h4 className="m-0 mb-3 text-[#1a1a2e] font-bold">Irrigation</h4>
                <p className="m-0 text-[#666] text-[0.9rem] leading-relaxed">
                  {currentWeather.humidity > 70 
                    ? 'High humidity - reduce irrigation frequency' 
                    : 'Normal humidity - maintain regular watering schedule'}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <span className="text-[2.5rem] block mb-4">🌡️</span>
                <h4 className="m-0 mb-3 text-[#1a1a2e] font-bold">Temperature Management</h4>
                <p className="m-0 text-[#666] text-[0.9rem] leading-relaxed">
                  {currentWeather.temperature > 35 
                    ? 'Apply mulching to protect roots from heat' 
                    : 'Conditions favorable for most crops'}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <span className="text-[2.5rem] block mb-4">🌧️</span>
                <h4 className="m-0 mb-3 text-[#1a1a2e] font-bold">Rainfall Preparedness</h4>
                <p className="m-0 text-[#666] text-[0.9rem] leading-relaxed">
                  {weatherData.some(d => d.rainfall > 10) 
                    ? 'Rain expected - ensure proper drainage' 
                    : 'Low rainfall expected - plan irrigation accordingly'}
                </p>
              </div>
              <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <span className="text-[2.5rem] block mb-4">🐛</span>
                <h4 className="m-0 mb-3 text-[#1a1a2e] font-bold">Pest Control</h4>
                <p className="m-0 text-[#666] text-[0.9rem] leading-relaxed">
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
        <div className="text-center py-16 px-8 bg-white rounded-[20px] max-w-[500px] mx-auto shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <span className="text-[4rem] block mb-4">📍</span>
          <h3 className="m-0 mb-2 text-[#1a1a2e] font-bold">Select a Location</h3>
          <p className="m-0 text-[#666]">Choose your state and district to view weather information and agricultural insights</p>
        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
