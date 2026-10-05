import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import './UserProfile.css';

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
    <div className="profile-content">
      <div className="profile-header-section">
        <div className="avatar-section">
          <div className="avatar">
            <span>{profileData.name.charAt(0).toUpperCase()}</span>
          </div>
          {isEditing && (
            <button className="change-avatar-btn">📷 Change Photo</button>
          )}
        </div>
        <div className="profile-info">
          <h2>{profileData.name}</h2>
          <p className="profile-location">📍 {profileData.location}</p>
          <p className="profile-experience">👨‍🌾 {profileData.experience} of farming</p>
        </div>
        <button 
          className={`edit-btn ${isEditing ? 'save' : ''}`}
          onClick={() => isEditing ? handleSaveProfile() : setIsEditing(true)}
        >
          {isEditing ? '✓ Save Changes' : '✏️ Edit Profile'}
        </button>
      </div>

      <div className="profile-details">
        <div className="detail-group">
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

        <div className="detail-group">
          <label>Email Address</label>
          <span>{profileData.email}</span>
        </div>

        <div className="detail-group">
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

        <div className="detail-group">
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

        <div className="detail-group">
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

        <div className="detail-group full-width">
          <label>Primary Crops</label>
          <div className="crops-list">
            {profileData.cropTypes.map((crop, index) => (
              <span key={index} className="crop-badge">{crop}</span>
            ))}
            {isEditing && <button className="add-crop-btn">+ Add Crop</button>}
          </div>
        </div>

        <div className="detail-group full-width">
          <label>Bio</label>
          {isEditing ? (
            <textarea 
              value={profileData.bio}
              onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
              rows={3}
            />
          ) : (
            <p className="bio-text">{profileData.bio}</p>
          )}
        </div>
      </div>
    </div>
  );

  const renderStatsTab = () => (
    <div className="stats-content">
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">🌾</span>
          <span className="stat-number">{userStats.totalRecommendations}</span>
          <span className="stat-label">Recommendations</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">💾</span>
          <span className="stat-number">{userStats.savedCrops}</span>
          <span className="stat-label">Saved Crops</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🌤️</span>
          <span className="stat-number">{userStats.weatherChecks}</span>
          <span className="stat-label">Weather Checks</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🔔</span>
          <span className="stat-number">{userStats.priceAlerts}</span>
          <span className="stat-label">Price Alerts</span>
        </div>
      </div>

      <div className="achievements-section">
        <h3>🏆 Achievements</h3>
        <div className="achievements-grid">
          {achievements.map(achievement => (
            <div key={achievement.id} className={`achievement-card ${achievement.earned ? 'earned' : 'locked'}`}>
              <span className="achievement-icon">{achievement.icon}</span>
              <h4>{achievement.title}</h4>
              <p>{achievement.description}</p>
              {achievement.earned && <span className="earned-badge">✓ Earned</span>}
            </div>
          ))}
        </div>
      </div>

      <div className="activity-section">
        <h3>📋 Recent Activity</h3>
        <div className="activity-list">
          {recentActivity.map(activity => (
            <div key={activity.id} className="activity-item">
              <span className="activity-icon">{activity.icon}</span>
              <div className="activity-details">
                <span className="activity-action">{activity.action}</span>
                <span className="activity-time">{activity.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettingsTab = () => (
    <div className="settings-content">
      <div className="settings-section">
        <h3>🔔 Notification Settings</h3>
        <div className="settings-grid">
          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Push Notifications</span>
              <span className="setting-desc">Receive push notifications in browser</span>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={preferences.notifications}
                onChange={(e) => setPreferences({...preferences, notifications: e.target.checked})}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Email Alerts</span>
              <span className="setting-desc">Receive important updates via email</span>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={preferences.emailAlerts}
                onChange={(e) => setPreferences({...preferences, emailAlerts: e.target.checked})}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">SMS Alerts</span>
              <span className="setting-desc">Get critical alerts via SMS</span>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={preferences.smsAlerts}
                onChange={(e) => setPreferences({...preferences, smsAlerts: e.target.checked})}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Weather Alerts</span>
              <span className="setting-desc">Get notified about weather changes</span>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={preferences.weatherAlerts}
                onChange={(e) => setPreferences({...preferences, weatherAlerts: e.target.checked})}
              />
              <span className="slider"></span>
            </label>
          </div>

          <div className="setting-item">
            <div className="setting-info">
              <span className="setting-label">Price Alerts</span>
              <span className="setting-desc">Get notified when crop prices change</span>
            </div>
            <label className="toggle">
              <input 
                type="checkbox" 
                checked={preferences.priceAlerts}
                onChange={(e) => setPreferences({...preferences, priceAlerts: e.target.checked})}
              />
              <span className="slider"></span>
            </label>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3>⚙️ Preferences</h3>
        <div className="preferences-grid">
          <div className="preference-item">
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

          <div className="preference-item">
            <label>Currency</label>
            <select 
              value={preferences.currency}
              onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
            >
              <option value="INR">₹ INR (Indian Rupee)</option>
              <option value="USD">$ USD (US Dollar)</option>
            </select>
          </div>

          <div className="preference-item">
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

      <div className="settings-section danger-zone">
        <h3>⚠️ Danger Zone</h3>
        <div className="danger-actions">
          <button className="danger-btn outline">🔄 Reset Preferences</button>
          <button className="danger-btn outline">📤 Export My Data</button>
          <button className="danger-btn solid">🗑️ Delete Account</button>
        </div>
      </div>

      <button className="save-settings-btn" onClick={handleSavePreferences}>
        💾 Save All Settings
      </button>
    </div>
  );

  return (
    <div className="user-profile-container">
      <div className="profile-header">
        <h1>👤 My Profile</h1>
        <p>Manage your account settings and preferences</p>
      </div>

      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <span className="tab-icon">👤</span>
          Profile
        </button>
        <button 
          className={`tab-btn ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          <span className="tab-icon">📊</span>
          Stats & Activity
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          <span className="tab-icon">⚙️</span>
          Settings
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'profile' && renderProfileTab()}
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'settings' && renderSettingsTab()}
      </div>
    </div>
  );
};

export default UserProfile;
