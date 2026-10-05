import React, { useState } from 'react';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const SoilAnalysis = () => {
  const [selectedSoilType, setSelectedSoilType] = useState('');
  const [soilParameters, setSoilParameters] = useState({
    nitrogen: 50,
    phosphorus: 40,
    potassium: 45,
    pH: 6.5,
    organicCarbon: 0.5,
    moisture: 35,
  });
  const [showResults, setShowResults] = useState(false);

  // Soil types data
  const soilTypes = [
    {
      id: 'alluvial',
      name: 'Alluvial Soil',
      icon: '🏞️',
      description: 'Found in river valleys, highly fertile',
      regions: ['Punjab', 'Haryana', 'UP', 'Bihar', 'West Bengal'],
      crops: ['Rice', 'Wheat', 'Sugarcane', 'Cotton'],
      characteristics: {
        fertility: 85,
        waterRetention: 70,
        drainage: 75,
        aeration: 65,
        nutrients: 80,
      },
    },
    {
      id: 'black',
      name: 'Black Soil',
      icon: '⬛',
      description: 'Rich in clay, excellent moisture retention',
      regions: ['Maharashtra', 'Gujarat', 'MP', 'Karnataka'],
      crops: ['Cotton', 'Soybean', 'Groundnut', 'Wheat'],
      characteristics: {
        fertility: 75,
        waterRetention: 90,
        drainage: 50,
        aeration: 55,
        nutrients: 70,
      },
    },
    {
      id: 'red',
      name: 'Red Soil',
      icon: '🔴',
      description: 'Rich in iron, slightly acidic',
      regions: ['Tamil Nadu', 'Karnataka', 'Odisha', 'Chhattisgarh'],
      crops: ['Millets', 'Groundnut', 'Tobacco', 'Vegetables'],
      characteristics: {
        fertility: 60,
        waterRetention: 55,
        drainage: 80,
        aeration: 75,
        nutrients: 55,
      },
    },
    {
      id: 'laterite',
      name: 'Laterite Soil',
      icon: '🟤',
      description: 'Found in heavy rainfall areas, leached nutrients',
      regions: ['Kerala', 'Karnataka', 'Goa', 'Assam'],
      crops: ['Tea', 'Coffee', 'Rubber', 'Cashew'],
      characteristics: {
        fertility: 45,
        waterRetention: 40,
        drainage: 85,
        aeration: 80,
        nutrients: 40,
      },
    },
    {
      id: 'sandy',
      name: 'Sandy Soil',
      icon: '🏜️',
      description: 'Low water retention, needs frequent irrigation',
      regions: ['Rajasthan', 'Gujarat', 'Punjab'],
      crops: ['Bajra', 'Moong', 'Groundnut', 'Dates'],
      characteristics: {
        fertility: 35,
        waterRetention: 25,
        drainage: 95,
        aeration: 90,
        nutrients: 30,
      },
    },
    {
      id: 'clay',
      name: 'Clay Soil',
      icon: '🟫',
      description: 'Heavy, sticky when wet, rich in nutrients',
      regions: ['Maharashtra', 'Tamil Nadu', 'AP'],
      crops: ['Rice', 'Wheat', 'Sugarcane'],
      characteristics: {
        fertility: 70,
        waterRetention: 85,
        drainage: 35,
        aeration: 40,
        nutrients: 75,
      },
    },
  ];

  // NPK optimal ranges
  const npkOptimalRanges = {
    nitrogen: { low: 0, medium: 40, high: 60, optimal: '40-60 kg/ha' },
    phosphorus: { low: 0, medium: 30, high: 50, optimal: '30-50 kg/ha' },
    potassium: { low: 0, medium: 35, high: 55, optimal: '35-55 kg/ha' },
  };

  // pH optimal ranges for different crops
  const phRanges = [
    { crop: 'Rice', min: 5.5, max: 7.0, optimal: 6.5 },
    { crop: 'Wheat', min: 6.0, max: 7.5, optimal: 6.8 },
    { crop: 'Potato', min: 5.0, max: 6.5, optimal: 5.8 },
    { crop: 'Tomato', min: 6.0, max: 7.0, optimal: 6.5 },
    { crop: 'Cotton', min: 6.0, max: 8.0, optimal: 7.0 },
    { crop: 'Sugarcane', min: 6.0, max: 8.0, optimal: 6.5 },
  ];

  const selectedSoil = soilTypes.find(s => s.id === selectedSoilType);

  const getRadarData = () => {
    if (!selectedSoil) return [];
    return [
      { subject: 'Fertility', value: selectedSoil.characteristics.fertility, fullMark: 100 },
      { subject: 'Water Retention', value: selectedSoil.characteristics.waterRetention, fullMark: 100 },
      { subject: 'Drainage', value: selectedSoil.characteristics.drainage, fullMark: 100 },
      { subject: 'Aeration', value: selectedSoil.characteristics.aeration, fullMark: 100 },
      { subject: 'Nutrients', value: selectedSoil.characteristics.nutrients, fullMark: 100 },
    ];
  };

  const getNPKStatus = (value, type) => {
    const range = npkOptimalRanges[type];
    if (value < range.medium) return { status: 'Low', color: '#f44336', tailwind: 'bg-[#f44336]/15 text-[#f44336]' };
    if (value < range.high) return { status: 'Medium', color: '#FF9800', tailwind: 'bg-[#FF9800]/15 text-[#FF9800]' };
    return { status: 'High', color: '#4CAF50', tailwind: 'bg-[#4CAF50]/15 text-[#4CAF50]' };
  };

  const getpHStatus = () => {
    const ph = soilParameters.pH;
    if (ph < 5.5) return { status: 'Very Acidic', color: '#f44336', recommendation: 'Add lime to increase pH' };
    if (ph < 6.5) return { status: 'Acidic', color: '#FF9800', recommendation: 'Consider adding lime for pH-sensitive crops' };
    if (ph < 7.5) return { status: 'Neutral', color: '#4CAF50', recommendation: 'Optimal for most crops' };
    if (ph < 8.5) return { status: 'Alkaline', color: '#FF9800', recommendation: 'Add sulfur or organic matter' };
    return { status: 'Very Alkaline', color: '#f44336', recommendation: 'Add sulfur and gypsum to lower pH' };
  };

  const handleAnalyze = () => {
    setShowResults(true);
  };

  const getRecommendations = () => {
    const recommendations = [];
    const n = getNPKStatus(soilParameters.nitrogen, 'nitrogen');
    const p = getNPKStatus(soilParameters.phosphorus, 'phosphorus');
    const k = getNPKStatus(soilParameters.potassium, 'potassium');

    if (n.status === 'Low') {
      recommendations.push({
        type: 'border-l-[#4CAF50]',
        title: 'Nitrogen Deficiency',
        description: 'Add urea or ammonium sulfate. Consider growing legumes as cover crops.',
        icon: '🌱',
      });
    }
    if (p.status === 'Low') {
      recommendations.push({
        type: 'border-l-[#4CAF50]',
        title: 'Phosphorus Deficiency',
        description: 'Apply DAP or superphosphate. Add bone meal for organic option.',
        icon: '🦴',
      });
    }
    if (k.status === 'Low') {
      recommendations.push({
        type: 'border-l-[#4CAF50]',
        title: 'Potassium Deficiency',
        description: 'Add muriate of potash (MOP). Wood ash is a good organic source.',
        icon: '🪵',
      });
    }
    if (soilParameters.organicCarbon < 0.5) {
      recommendations.push({
        type: 'border-l-[#795548]',
        title: 'Low Organic Carbon',
        description: 'Add compost, farmyard manure, or green manure to improve soil health.',
        icon: '🌿',
      });
    }
    if (soilParameters.moisture < 30) {
      recommendations.push({
        type: 'border-l-[#2196F3]',
        title: 'Low Soil Moisture',
        description: 'Consider mulching and drip irrigation to conserve moisture.',
        icon: '💧',
      });
    }

    return recommendations;
  };

  return (
    <div className="min-h-[calc(100vh-70px)] bg-gradient-to-br from-[#e8f5e9] to-[#c8e6c9] p-[clamp(1rem,2vw,2rem)]">
      <div className="text-center mb-8">
        <h1 className="text-[2.5rem] text-[#1a1a2e] m-0 max-md:text-[1.8rem]">🌱 Soil Analysis</h1>
        <p className="text-[#666] text-[1.1rem] mt-2">Understand your soil better for optimal crop selection</p>
      </div>

      {/* Soil Type Selection */}
      <div className="max-w-[1200px] mx-auto mb-8">
        <h2 className="text-[#1a1a2e] mb-6 text-center text-2xl font-bold">Select Your Soil Type</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(180px,1fr))] gap-4 max-md:grid-cols-2">
          {soilTypes.map(soil => (
            <div
              key={soil.id}
              className={`bg-white rounded-[16px] p-6 text-center cursor-pointer transition-all duration-300 border-3 shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] ${selectedSoilType === soil.id ? 'border-[#4CAF50] bg-gradient-to-br from-[rgba(76,175,80,0.1)] to-[rgba(46,125,50,0.05)]' : 'border-transparent'}`}
              onClick={() => setSelectedSoilType(soil.id)}
            >
              <span className="text-[3rem] block mb-3">{soil.icon}</span>
              <h3 className="m-0 mb-2 text-[1rem] text-[#1a1a2e] font-bold">{soil.name}</h3>
              <p className="m-0 text-[0.8rem] text-[#666] leading-[1.4]">{soil.description}</p>
            </div>
          ))}
        </div>
      </div>

      {selectedSoil && (
        <>
          {/* Soil Characteristics */}
          <div className="grid grid-cols-2 gap-6 max-w-[1200px] mx-auto mb-8 items-stretch max-lg:grid-cols-1">
            <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h3 className="m-0 mb-6 text-[#1a1a2e] text-xl font-bold">{selectedSoil.icon} {selectedSoil.name} Characteristics</h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-3">
                  <span className="font-semibold text-[#333] text-[0.9rem]">Major Regions</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedSoil.regions.map(region => (
                      <span key={region} className="bg-[#e3f2fd] text-[#1976d2] py-1.5 px-3 rounded-[15px] text-[0.85rem]">{region}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <span className="font-semibold text-[#333] text-[0.9rem]">Suitable Crops</span>
                  <div className="flex flex-wrap gap-2">
                    {selectedSoil.crops.map(crop => (
                      <span key={crop} className="bg-[#e8f5e9] text-[#2E7D32] py-1.5 px-3 rounded-[15px] text-[0.85rem]">{crop}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[16px] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
              <h3 className="m-0 mb-6 text-[#1a1a2e] text-xl font-bold">Soil Properties Radar</h3>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={getRadarData()}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="Properties" dataKey="value" stroke="#4CAF50" fill="#4CAF50" fillOpacity={0.5} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Soil Parameters Input */}
          <div className="max-w-[1200px] mx-auto mb-8 bg-white rounded-[20px] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
            <h2 className="m-0 text-[#1a1a2e] text-2xl font-bold">📊 Enter Soil Test Values</h2>
            <p className="text-[#666] mt-2 mb-6">Enter your soil test report values for detailed analysis</p>
            
            <div className="grid grid-cols-3 gap-6 mb-8 max-lg:grid-cols-2 max-md:grid-cols-1">
              <div className="bg-[#f8f9fa] rounded-[12px] p-5">
                <label className="flex items-center gap-2 font-semibold text-[#333] mb-4 text-[0.9rem]">
                  <span className="text-[1.2rem]">🌿</span>
                  Nitrogen (N) - kg/ha
                </label>
                <input
                  className="w-full h-[8px] rounded-[4px] bg-[#e0e0e0] outline-none appearance-none cursor-pointer accent-[#4CAF50]"
                  type="range"
                  min="0"
                  max="100"
                  value={soilParameters.nitrogen}
                  onChange={(e) => setSoilParameters({...soilParameters, nitrogen: Number(e.target.value)})}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[1.5rem] font-bold text-[#1a1a2e]">{soilParameters.nitrogen}</span>
                  <span className={`py-1 px-3 rounded-[15px] text-[0.75rem] font-semibold ${getNPKStatus(soilParameters.nitrogen, 'nitrogen').tailwind}`}>
                    {getNPKStatus(soilParameters.nitrogen, 'nitrogen').status}
                  </span>
                </div>
              </div>

              <div className="bg-[#f8f9fa] rounded-[12px] p-5">
                <label className="flex items-center gap-2 font-semibold text-[#333] mb-4 text-[0.9rem]">
                  <span className="text-[1.2rem]">🦴</span>
                  Phosphorus (P) - kg/ha
                </label>
                <input
                  className="w-full h-[8px] rounded-[4px] bg-[#e0e0e0] outline-none appearance-none cursor-pointer accent-[#4CAF50]"
                  type="range"
                  min="0"
                  max="100"
                  value={soilParameters.phosphorus}
                  onChange={(e) => setSoilParameters({...soilParameters, phosphorus: Number(e.target.value)})}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[1.5rem] font-bold text-[#1a1a2e]">{soilParameters.phosphorus}</span>
                  <span className={`py-1 px-3 rounded-[15px] text-[0.75rem] font-semibold ${getNPKStatus(soilParameters.phosphorus, 'phosphorus').tailwind}`}>
                    {getNPKStatus(soilParameters.phosphorus, 'phosphorus').status}
                  </span>
                </div>
              </div>

              <div className="bg-[#f8f9fa] rounded-[12px] p-5">
                <label className="flex items-center gap-2 font-semibold text-[#333] mb-4 text-[0.9rem]">
                  <span className="text-[1.2rem]">🪵</span>
                  Potassium (K) - kg/ha
                </label>
                <input
                  className="w-full h-[8px] rounded-[4px] bg-[#e0e0e0] outline-none appearance-none cursor-pointer accent-[#4CAF50]"
                  type="range"
                  min="0"
                  max="100"
                  value={soilParameters.potassium}
                  onChange={(e) => setSoilParameters({...soilParameters, potassium: Number(e.target.value)})}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[1.5rem] font-bold text-[#1a1a2e]">{soilParameters.potassium}</span>
                  <span className={`py-1 px-3 rounded-[15px] text-[0.75rem] font-semibold ${getNPKStatus(soilParameters.potassium, 'potassium').tailwind}`}>
                    {getNPKStatus(soilParameters.potassium, 'potassium').status}
                  </span>
                </div>
              </div>

              <div className="bg-[#f8f9fa] rounded-[12px] p-5">
                <label className="flex items-center gap-2 font-semibold text-[#333] mb-4 text-[0.9rem]">
                  <span className="text-[1.2rem]">⚗️</span>
                  Soil pH
                </label>
                <input
                  className="w-full h-[8px] rounded-[4px] bg-[#e0e0e0] outline-none appearance-none cursor-pointer accent-[#4CAF50]"
                  type="range"
                  min="4"
                  max="10"
                  step="0.1"
                  value={soilParameters.pH}
                  onChange={(e) => setSoilParameters({...soilParameters, pH: Number(e.target.value)})}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[1.5rem] font-bold text-[#1a1a2e]">{soilParameters.pH.toFixed(1)}</span>
                  <span className="py-1 px-3 rounded-[15px] text-[0.75rem] font-semibold" style={{ background: getpHStatus().color + '20', color: getpHStatus().color }}>
                    {getpHStatus().status}
                  </span>
                </div>
              </div>

              <div className="bg-[#f8f9fa] rounded-[12px] p-5">
                <label className="flex items-center gap-2 font-semibold text-[#333] mb-4 text-[0.9rem]">
                  <span className="text-[1.2rem]">🌿</span>
                  Organic Carbon (%)
                </label>
                <input
                  className="w-full h-[8px] rounded-[4px] bg-[#e0e0e0] outline-none appearance-none cursor-pointer accent-[#4CAF50]"
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={soilParameters.organicCarbon}
                  onChange={(e) => setSoilParameters({...soilParameters, organicCarbon: Number(e.target.value)})}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[1.5rem] font-bold text-[#1a1a2e]">{soilParameters.organicCarbon.toFixed(1)}%</span>
                  <span className={`py-1 px-3 rounded-[15px] text-[0.75rem] font-semibold ${soilParameters.organicCarbon < 0.5 ? 'bg-[#f44336]/15 text-[#f44336]' : soilParameters.organicCarbon < 0.75 ? 'bg-[#FF9800]/15 text-[#FF9800]' : 'bg-[#4CAF50]/15 text-[#4CAF50]'}`}>
                    {soilParameters.organicCarbon < 0.5 ? 'Low' : soilParameters.organicCarbon < 0.75 ? 'Medium' : 'High'}
                  </span>
                </div>
              </div>

              <div className="bg-[#f8f9fa] rounded-[12px] p-5">
                <label className="flex items-center gap-2 font-semibold text-[#333] mb-4 text-[0.9rem]">
                  <span className="text-[1.2rem]">💧</span>
                  Soil Moisture (%)
                </label>
                <input
                  className="w-full h-[8px] rounded-[4px] bg-[#e0e0e0] outline-none appearance-none cursor-pointer accent-[#4CAF50]"
                  type="range"
                  min="0"
                  max="100"
                  value={soilParameters.moisture}
                  onChange={(e) => setSoilParameters({...soilParameters, moisture: Number(e.target.value)})}
                />
                <div className="flex justify-between items-center mt-3">
                  <span className="text-[1.5rem] font-bold text-[#1a1a2e]">{soilParameters.moisture}%</span>
                  <span className={`py-1 px-3 rounded-[15px] text-[0.75rem] font-semibold ${soilParameters.moisture < 30 ? 'bg-[#f44336]/15 text-[#f44336]' : soilParameters.moisture < 60 ? 'bg-[#FF9800]/15 text-[#FF9800]' : 'bg-[#4CAF50]/15 text-[#4CAF50]'}`}>
                    {soilParameters.moisture < 30 ? 'Dry' : soilParameters.moisture < 60 ? 'Optimal' : 'Wet'}
                  </span>
                </div>
              </div>
            </div>

            <button className="block w-full max-w-[300px] mx-auto p-4 bg-gradient-to-br from-[#4CAF50] to-[#2E7D32] text-white border-none rounded-[12px] text-[1.1rem] font-semibold cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_25px_rgba(76,175,80,0.3)]" onClick={handleAnalyze}>
              🔬 Analyze Soil
            </button>
          </div>

          {/* Results Section */}
          {showResults && (
            <div className="max-w-[1200px] mx-auto">
              <h2 className="text-[#1a1a2e] mb-6 text-2xl font-bold">📋 Analysis Results</h2>
              
              {/* NPK Chart */}
              <div className="bg-white rounded-[16px] p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <h3 className="m-0 mb-6 text-[#1a1a2e] text-xl font-bold">NPK Levels Comparison</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={[
                      { name: 'Nitrogen', current: soilParameters.nitrogen, optimal: 50, unit: 'kg/ha' },
                      { name: 'Phosphorus', current: soilParameters.phosphorus, optimal: 40, unit: 'kg/ha' },
                      { name: 'Potassium', current: soilParameters.potassium, optimal: 45, unit: 'kg/ha' },
                    ]}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[0, 100]} />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="current" name="Your Level" fill="#2196F3" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="optimal" name="Optimal Level" fill="#4CAF50" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* pH Scale */}
              <div className="bg-white rounded-[16px] p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <h3 className="m-0 mb-6 text-[#1a1a2e] text-xl font-bold">Soil pH Analysis</h3>
                <div className="mb-6">
                  <div className="relative h-[30px] rounded-[15px] overflow-visible">
                    <div className="h-full rounded-[15px] bg-gradient-to-r from-[#f44336] via-[#FFEB3B] to-[#9C27B0]"></div>
                    <div 
                      className="absolute -top-[10px] -translate-x-1/2 flex flex-col items-center after:content-[''] after:w-[4px] after:h-[50px] after:bg-[#1a1a2e] after:rounded-[2px]"
                      style={{ left: `${((soilParameters.pH - 4) / 6) * 100}%` }}
                    >
                      <span className="bg-[#1a1a2e] text-white py-1 px-3 rounded-[15px] font-semibold text-[0.9rem] mb-1">{soilParameters.pH.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="flex justify-between mt-2 text-[0.8rem] text-[#666]">
                    <span>4 (Very Acidic)</span>
                    <span>7 (Neutral)</span>
                    <span>10 (Very Alkaline)</span>
                  </div>
                </div>
                <div className="bg-[#f8f9fa] p-4 rounded-[10px] text-center">
                  <span className="font-bold text-[1.2rem]" style={{ color: getpHStatus().color }}>
                    {getpHStatus().status}
                  </span>
                  <p className="mt-2 mb-0 text-[#666]">{getpHStatus().recommendation}</p>
                </div>
              </div>

              {/* Crop pH Suitability */}
              <div className="bg-white rounded-[16px] p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <h3 className="m-0 mb-6 text-[#1a1a2e] text-xl font-bold">Crop pH Suitability</h3>
                <div className="flex flex-col gap-4">
                  {phRanges.map(crop => {
                    const isSuitable = soilParameters.pH >= crop.min && soilParameters.pH <= crop.max;
                    return (
                      <div key={crop.crop} className={`flex items-center gap-4 p-3 bg-[#f8f9fa] rounded-[10px] max-md:flex-wrap`}>
                        <span className="min-w-[100px] font-semibold text-[#333]">{crop.crop}</span>
                        <div className="flex-1 h-[10px] bg-[#e0e0e0] rounded-[5px] relative max-md:order-3 max-md:w-full max-md:flex-none">
                          <div 
                            className="absolute h-full bg-gradient-to-r from-[#4CAF50] to-[#8BC34A] rounded-[5px]"
                            style={{
                              left: `${((crop.min - 4) / 6) * 100}%`,
                              width: `${((crop.max - crop.min) / 6) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <span className={`text-[0.8rem] font-semibold py-1 px-3 rounded-[15px] min-w-[100px] text-center ${isSuitable ? 'bg-[#4CAF50]/15 text-[#4CAF50]' : 'bg-[#f44336]/15 text-[#f44336]'}`}>
                          {isSuitable ? '✓ Suitable' : '✗ Adjust pH'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-[16px] p-6 mb-6 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
                <h3 className="m-0 mb-6 text-[#1a1a2e] text-xl font-bold">🎯 Recommendations</h3>
                {getRecommendations().length > 0 ? (
                  <div className="flex flex-col gap-4">
                    {getRecommendations().map((rec, index) => (
                      <div key={index} className={`flex items-start gap-4 p-4 rounded-[12px] bg-[#f8f9fa] border-l-4 ${rec.type}`}>
                        <span className="text-[2rem]">{rec.icon}</span>
                        <div className="flex flex-col gap-2">
                          <h4 className="m-0 text-[#1a1a2e] font-bold text-[1.1rem]">{rec.title}</h4>
                          <p className="m-0 text-[#666] leading-[1.5]">{rec.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center p-8 bg-[rgba(76,175,80,0.1)] rounded-[12px]">
                    <span className="text-[3rem] block mb-4">✅</span>
                    <p className="m-0 text-[#2E7D32] font-medium">Your soil parameters are within optimal ranges! Continue maintaining good soil health practices.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {!selectedSoilType && (
        <div className="text-center p-[4rem_2rem] bg-white rounded-[20px] max-w-[500px] mx-auto my-8 shadow-[0_4px_20px_rgba(0,0,0,0.08)]">
          <span className="text-[4rem] block mb-4">🌍</span>
          <h3 className="m-0 mb-2 text-[#1a1a2e] text-xl font-bold">Select a Soil Type</h3>
          <p className="m-0 text-[#666]">Choose your soil type above to see detailed analysis and recommendations</p>
        </div>
      )}
    </div>
  );
};

export default SoilAnalysis;
