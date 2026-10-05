import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const UserProfile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Farmer User',
    email: user?.email || 'farmer@example.com',
    phone: '+91 9876543210',
    location: 'Punjab, India',
    farmSize: '15 acres',
    cropTypes: ['Wheat', 'Rice', 'Cotton'],
    experience: '10+ years',
    bio: 'Passionate farmer with a decade of experience in sustainable agriculture practices.',
  });

  const [preferences, setPreferences] = useState({
    notifications: true,
    emailAlerts: true,
    smsAlerts: false,
    weatherAlerts: true,
    priceAlerts: true,
    language: 'en',
    currency: 'INR',
    measurementUnit: 'metric',
  });

  // Mock activity data
  const recentActivity = [
    { id: 1, type: 'recommendation', action: 'Got crop recommendation for Kharif season', time: '2 hours ago', icon: '🌾' },
    { id: 2, type: 'weather', action: 'Checked weather forecast for Punjab', time: '5 hours ago', icon: '☀️' },
    { id: 3, type: 'price', action: 'Viewed wheat market prices', time: 'Yesterday', icon: '📈' },
    { id: 4, type: 'soil', action: 'Analyzed soil parameters', time: '2 days ago', icon: '🌱' },
    { id: 5, type: 'recommendation', action: 'Saved cotton farming tips', time: '3 days ago', icon: '💾' },
  ];

  // Mock stats
  const userStats = {
    totalRecommendations: 24,
    savedCrops: 8,
    weatherChecks: 45,
    priceAlerts: 12,
  };

  const achievements = [
    { id: 1, title: 'First Steps', description: 'Made your first recommendation', icon: '🎯', earned: true },
    { id: 2, title: 'Weather Watcher', description: 'Checked weather 10 times', icon: '🌤️', earned: true },
    { id: 3, title: 'Price Tracker', description: 'Set 5 price alerts', icon: '📊', earned: true },
    { id: 4, title: 'Soil Expert', description: 'Analyzed soil for 5 different crops', icon: '🧪', earned: false },
    { id: 5, title: 'Crop Master', description: 'Got recommendations for 50 crops', icon: '👨‍🌾', earned: false },
    { id: 6, title: 'Community Helper', description: 'Shared 10 farming tips', icon: '🤝', earned: false },
  ];

  const handleSaveProfile = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved!');
  };

  const renderProfileTab = () => (
    <div className="bg-white rounded-[20px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
      <div className="flex items-center gap-8 pb-8 border-b border-[#eee] mb-8 flex-wrap max-md:flex-col max-md:text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-[100px] h-[100px] rounded-full bg-emerald-600 flex items-center justify-center text-white text-[2.5rem] font-bold">
            <span>{profileData.name.charAt(0).toUpperCase()}</span>
          </div>
          {isEditing && (
            <button className="change-w-[100px] h-[100px] rounded-full bg-emerald-600 flex items-center justify-center text-white text-[2.5rem] font-bold-btn">📷 Change Photo</button>
          )}
        </div>
        <div className="flex-1 max-md:text-center">
          <h2>{profileData.name}</h2>
          <p className="my-1 text-[#666]">📍 {profileData.location}</p>
          <p className="my-1 text-[#666]">👨‍🌾 {profileData.experience} of farming</p>
        </div>
        <button 
          className={`py-3 px-6 bg-[#f5f5f5] border-2 border-transparent rounded-xl cursor-pointer font-semibold transition-all duration-300 hover:bg-[#e0e0e0] ${isEditing ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : ''}`}
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
        >
          {isEditing ? '✓ Save Changes' : '✏️ Edit Profile'}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 max-md:grid-cols-1">
        <div className="flex flex-col gap-2">
          <label>Full Name</label>
          {isEditing ? (
            <input 
              type="text" 
              value={profileData.name}
              onChange={(e) => setProfileData({...profileData, name: e.target.value})}
            />
          ) : (
            <span>{profileData.name}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label>Email Address</label>
          <span>{profileData.email}</span>
        </div>

        <div className="flex flex-col gap-2">
          <label>Phone Number</label>
          {isEditing ? (
            <input 
              type="tel" 
              value={profileData.phone}
              onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
            />
          ) : (
            <span>{profileData.phone}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label>Location</label>
          {isEditing ? (
            <input 
              type="text" 
              value={profileData.location}
              onChange={(e) => setProfileData({...profileData, location: e.target.value})}
            />
          ) : (
            <span>{profileData.location}</span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label>Farm Size</label>
          {isEditing ? (
            <input 
              type="text" 
              value={profileData.farmSize}
              onChange={(e) => setProfileData({...profileData, farmSize: e.target.value})}
            />
          ) : (
            <span>{profileData.farmSize}</span>
          )}
        </div>

        <div className="flex flex-col gap-2 col-span-2 max-md:col-span-1">
          <label>Primary Crops</label>
          <div className="flex flex-wrap gap-2">
            {profileData.cropTypes.map((crop, index) => (
              <span key={index} className="bg-[#e8f5e9] text-[#2E7D32] py-2 px-4 rounded-[20px] text-[0.9rem]">{crop}</span>
            ))}
            {isEditing && <button className="bg-[#f5f5f5] border-2 border-dashed border-[#ccc] py-2 px-4 rounded-[20px] cursor-pointer transition-all duration-300 hover:border-emerald-600 hover:text-emerald-600">+ Add Crop</button>}
          </div>
        </div>

        <div className="flex flex-col gap-2 col-span-2 max-md:col-span-1">
          <label>Bio</label>
          {isEditing ? (
            <textarea 
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              rows={3}
            />
          ) : (
            <p className="m-0 text-[#555] leading-[1.6] p-3 bg-[#f8f9fa] rounded-lg">{profileData.bio}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-4 gap-6 max-md:grid-cols-2">
        <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <span className="text-[2.5rem] block mb-3">🌾</span>
          <span className="block text-[2rem] font-bold text-emerald-600 mb-1">{userStats.totalRecommendations}</span>
          <span className="text-[#666] text-[0.9rem]">Recommendations</span>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <span className="text-[2.5rem] block mb-3">💾</span>
          <span className="block text-[2rem] font-bold text-emerald-600 mb-1">{userStats.savedCrops}</span>
          <span className="text-[#666] text-[0.9rem]">Saved Crops</span>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <span className="text-[2.5rem] block mb-3">🌤️</span>
          <span className="block text-[2rem] font-bold text-emerald-600 mb-1">{userStats.weatherChecks}</span>
          <span className="text-[#666] text-[0.9rem]">Weather Checks</span>
        </div>
        <div className="bg-white rounded-2xl p-6 text-center shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <span className="text-[2.5rem] block mb-3">🔔</span>
          <span className="block text-[2rem] font-bold text-emerald-600 mb-1">{userStats.priceAlerts}</span>
          <span className="text-[#666] text-[0.9rem]">Price Alerts</span>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h3>🏆 Achievements</h3>
        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
          {achievements.map(achievement => (
            <div key={achievement.id} className={`p-5 rounded-xl text-center border-2 border-[#eee] relative ${achievement.unlocked ? 'bg-emerald-50 border-emerald-600' : 'locked'}`}>
              <span className="text-[2rem] block mb-2">{achievement.icon}</span>
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
              {achievement.earned && <span className="bg-emerald-50 border-emerald-600-badge">✓ Earned</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h3>📋 Recent Activity</h3>
        <div className="flex flex-col gap-4">
          {recentActivity.map(activity => (
            <div key={activity.id} className="flex items-center gap-4 p-4 bg-[#f8f9fa] rounded-lg">
              <span className="text-[1.5rem]">{activity.icon}</span>
              <div className="flex-1 flex justify-between items-center max-md:flex-col max-md:items-start max-md:gap-1">
                <span className="text-[#333]">{activity.action}</span>
                <span className="text-[#999] text-[0.85rem]">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="flex flex-col gap-8">
      <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h3>🔔 Notification Settings</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[#333]">Push Notifications</span>
              <span className="text-[0.85rem] text-[#666]">Receive push notifications in browser</span>
            </div>
            <label className="relative inline-block w-[50px] h-[28px]">
              <input 
                type="checkbox" 
                checked={preferences.notifications}
                onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
              />
              <span className="absolute cursor-pointer inset-0 bg-[#ccc] transition duration-400 rounded-[28px] peer-checked:bg-gradient-to-br peer-checked:from-[#9C27B0] peer-checked:to-[#7B1FA2] before:absolute before:content-[''] before:h-[20px] before:w-[20px] before:left-[4px] before:bottom-[4px] before:bg-white before:transition before:duration-400 before:rounded-full peer-checked:before:translate-x-[22px]"></span>
            </label>
          </div>

          <div className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[#333]">Email Alerts</span>
              <span className="text-[0.85rem] text-[#666]">Receive important updates via email</span>
            </div>
            <label className="relative inline-block w-[50px] h-[28px]">
              <input 
                type="checkbox" 
                checked={preferences.emailAlerts}
                onChange={(e) => setPreferences({...preferences, emailAlerts: e.target.checked})}
              />
              <span className="absolute cursor-pointer inset-0 bg-[#ccc] transition duration-400 rounded-[28px] peer-checked:bg-gradient-to-br peer-checked:from-[#9C27B0] peer-checked:to-[#7B1FA2] before:absolute before:content-[''] before:h-[20px] before:w-[20px] before:left-[4px] before:bottom-[4px] before:bg-white before:transition before:duration-400 before:rounded-full peer-checked:before:translate-x-[22px]"></span>
            </label>
          </div>

          <div className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[#333]">SMS Alerts</span>
              <span className="text-[0.85rem] text-[#666]">Get critical alerts via SMS</span>
            </div>
            <label className="relative inline-block w-[50px] h-[28px]">
              <input 
                type="checkbox" 
                checked={preferences.smsAlerts}
                onChange={(e) => setPreferences({...preferences, smsAlerts: e.target.checked})}
              />
              <span className="absolute cursor-pointer inset-0 bg-[#ccc] transition duration-400 rounded-[28px] peer-checked:bg-gradient-to-br peer-checked:from-[#9C27B0] peer-checked:to-[#7B1FA2] before:absolute before:content-[''] before:h-[20px] before:w-[20px] before:left-[4px] before:bottom-[4px] before:bg-white before:transition before:duration-400 before:rounded-full peer-checked:before:translate-x-[22px]"></span>
            </label>
          </div>

          <div className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[#333]">Weather Alerts</span>
              <span className="text-[0.85rem] text-[#666]">Get notified about weather changes</span>
            </div>
            <label className="relative inline-block w-[50px] h-[28px]">
              <input 
                type="checkbox" 
                checked={preferences.weatherAlerts}
                onChange={(e) => setPreferences({...preferences, weatherAlerts: e.target.checked})}
              />
              <span className="absolute cursor-pointer inset-0 bg-[#ccc] transition duration-400 rounded-[28px] peer-checked:bg-gradient-to-br peer-checked:from-[#9C27B0] peer-checked:to-[#7B1FA2] before:absolute before:content-[''] before:h-[20px] before:w-[20px] before:left-[4px] before:bottom-[4px] before:bg-white before:transition before:duration-400 before:rounded-full peer-checked:before:translate-x-[22px]"></span>
            </label>
          </div>

          <div className="flex justify-between items-center p-4 bg-[#f8f9fa] rounded-lg">
            <div className="flex flex-col gap-1">
              <span className="font-semibold text-[#333]">Price Alerts</span>
              <span className="text-[0.85rem] text-[#666]">Get notified when crop prices change</span>
            </div>
            <label className="relative inline-block w-[50px] h-[28px]">
              <input 
                type="checkbox" 
                checked={preferences.priceAlerts}
                onChange={(e) => setPreferences({...preferences, priceAlerts: e.target.checked})}
              />
              <span className="absolute cursor-pointer inset-0 bg-[#ccc] transition duration-400 rounded-[28px] peer-checked:bg-gradient-to-br peer-checked:from-[#9C27B0] peer-checked:to-[#7B1FA2] before:absolute before:content-[''] before:h-[20px] before:w-[20px] before:left-[4px] before:bottom-[4px] before:bg-white before:transition before:duration-400 before:rounded-full peer-checked:before:translate-x-[22px]"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
        <h3>⚙️ Preferences</h3>
        <div className="grid grid-cols-3 gap-4 max-md:grid-cols-1">
          <div className="flex flex-col gap-2">
            <label>Language</label>
            <select 
              value={preferences.language}
              onChange={(e) => setPreferences({...preferences, language: e.target.value})}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी (Hindi)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="te">తెలుగు (Telugu)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label>Currency</label>
            <select 
              value={preferences.currency}
              onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
            >
              <option value="INR">₹ INR (Indian Rupee)</option>
              <option value="USD">$ USD (US Dollar)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label>Measurement Units</label>
            <select 
              value={preferences.measurementUnit}
              onChange={(e) => setPreferences({...preferences, measurementUnit: e.target.value})}
            >
              <option value="metric">Metric (kg, hectares)</option>
              <option value="imperial">Imperial (lbs, acres)</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[20px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)] border-2 border-[#ffebee] bg-[#fff5f5]">
        <h3>⚠️ Danger Zone</h3>
        <div className="flex gap-4 max-md:flex-col">
          <button className="py-3 px-6 rounded-lg cursor-pointer font-semibold transition-all duration-300 bg-white border-2 border-[#f44336] text-[#f44336] hover:bg-[#ffebee]">🔄 Reset Preferences</button>
          <button className="py-3 px-6 rounded-lg cursor-pointer font-semibold transition-all duration-300 bg-white border-2 border-[#f44336] text-[#f44336] hover:bg-[#ffebee]">📤 Export My Data</button>
          <button className="py-3 px-6 rounded-lg cursor-pointer font-semibold transition-all duration-300 bg-[#f44336] border-2 border-[#f44336] text-white hover:bg-[#d32f2f]">🗑️ Delete Account</button>
        </div>
      </div>

      <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-xl transition-colors w-full mt-6" onClick={handleSavePreferences}>
        💾 Save All Settings
      </button>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-70px)] bg-slate-50 p-[clamp(1rem,2vw,2rem)]">
      <div className="text-center mb-8">
        <h1>👤 My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="flex justify-center gap-4 mb-8 flex-wrap max-md:flex-col">
        <button 
          className={`flex items-center gap-2 py-4 px-8 bg-white border-2 border-transparent rounded-xl cursor-pointer font-semibold transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="text-[1.2rem]">👤</span>
          Profile
        </button>
        <button 
          className={`flex items-center gap-2 py-4 px-8 bg-white border-2 border-transparent rounded-xl cursor-pointer font-semibold transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="text-[1.2rem]">📊</span>
          Stats & Activity
        </button>
        <button 
          className={`flex items-center gap-2 py-4 px-8 bg-white border-2 border-transparent rounded-xl cursor-pointer font-semibold transition-all duration-300 shadow-[0_4px_15px_rgba(0,0,0,0.05)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(0,0,0,0.1)] ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="text-[1.2rem]">⚙️</span>
          Settings
        </button>
      </div>

      <div className="max-w-[900px] mx-auto">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default UserProfile;
