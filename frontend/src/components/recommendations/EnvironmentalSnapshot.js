import React from 'react';
import { useTranslation } from 'react-i18next';
import './EnvironmentalSnapshot.css';

const EnvironmentalSnapshot = ({ snapshot }) => {
  const { t } = useTranslation();

  if (!snapshot) {
    return null;
  }

  const { soil, weather } = snapshot;

  return (
    <div className="environmental-snapshot">
      <h2 className="section-title">{t('environmentalSnapshot')}</h2>
      
      <div className="snapshot-grid">
        <div className="snapshot-card">
          <h3>Soil Properties</h3>
          <div className="snapshot-data">
            <div className="data-item">
              <span className="data-label">pH:</span>
              <span className="data-value">{soil.ph?.toFixed(2)}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Organic Carbon (%):</span>
              <span className="data-value">{soil.organicCarbon?.toFixed(2)}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Nitrogen (kg/ha):</span>
              <span className="data-value">{soil.nitrogen?.toFixed(2)}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Phosphorus (kg/ha):</span>
              <span className="data-value">{soil.phosphorus?.toFixed(2)}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Potassium (kg/ha):</span>
              <span className="data-value">{soil.potassium?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="snapshot-card">
          <h3>Weather Conditions</h3>
          <div className="snapshot-data">
            <div className="data-item">
              <span className="data-label">Avg Temperature (°C):</span>
              <span className="data-value">{weather.avgTemperature?.toFixed(2)}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Avg Rainfall (mm):</span>
              <span className="data-value">{weather.avgRainfall?.toFixed(2)}</span>
            </div>
            <div className="data-item">
              <span className="data-label">Avg Humidity (%):</span>
              <span className="data-value">{weather.avgHumidity?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalSnapshot;


