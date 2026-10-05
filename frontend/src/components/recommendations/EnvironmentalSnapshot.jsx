import React from 'react';
import { useTranslation } from 'react-i18next';

const EnvironmentalSnapshot = ({ snapshot }) => {
  const { t } = useTranslation();

  if (!snapshot) {
    return null;
  }

  const { soil, weather } = snapshot;

  return (
    <div className="bg-white p-8 rounded-lg shadow-[0_2px_10px_rgba(0,0,0,0.1)]">
      <h2 className="text-[#2c3e50] mb-6 text-2xl">{t('environmentalSnapshot')}</h2>
      
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-8">
        <div className="bg-[#f8f9fa] p-6 rounded-lg">
          <h3 className="text-[#2c3e50] mb-4 text-[1.3rem]">Soil Properties</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="text-[#555] font-medium">pH:</span>
              <span className="text-[#2c3e50] font-semibold">{soil.ph?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="text-[#555] font-medium">Organic Carbon (%):</span>
              <span className="text-[#2c3e50] font-semibold">{soil.organicCarbon?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="text-[#555] font-medium">Nitrogen (kg/ha):</span>
              <span className="text-[#2c3e50] font-semibold">{soil.nitrogen?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="text-[#555] font-medium">Phosphorus (kg/ha):</span>
              <span className="text-[#2c3e50] font-semibold">{soil.phosphorus?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="text-[#555] font-medium">Potassium (kg/ha):</span>
              <span className="text-[#2c3e50] font-semibold">{soil.potassium?.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-[#f8f9fa] p-6 rounded-lg">
          <h3 className="text-[#2c3e50] mb-4 text-[1.3rem]">Weather Conditions</h3>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="text-[#555] font-medium">Avg Temperature (°C):</span>
              <span className="text-[#2c3e50] font-semibold">{weather.avgTemperature?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="text-[#555] font-medium">Avg Rainfall (mm):</span>
              <span className="text-[#2c3e50] font-semibold">{weather.avgRainfall?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between p-2 bg-white rounded">
              <span className="text-[#555] font-medium">Avg Humidity (%):</span>
              <span className="text-[#2c3e50] font-semibold">{weather.avgHumidity?.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnvironmentalSnapshot;

