import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CropLibrary = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState(null);

  const cropCategories = [
    { id: 'all', name: 'All Crops', icon: '' },
    { id: 'cereals', name: 'Cereals', icon: '' },
    { id: 'pulses', name: 'Pulses', icon: '' },
    { id: 'oilseeds', name: 'Oilseeds', icon: '' },
    { id: 'vegetables', name: 'Vegetables', icon: '' },
    { id: 'fruits', name: 'Fruits', icon: '' },
    { id: 'spices', name: 'Spices', icon: '️' },
    { id: 'commercial', name: 'Commercial', icon: '' },
  ];

  const cropsData = [
    // Cereals
    {
      id: 1,
      name: 'Rice',
      category: 'cereals',
      scientificName: 'Oryza sativa',
      image: '',
      seasons: ['Kharif', 'Summer'],
      temperature: { min: 20, max: 35, optimal: '25-30°C' },
      rainfall: '150-300 cm',
      soil: 'Clayey loam, alluvial soil',
      waterRequirement: 'High (1200-1400 mm)',
      growingPeriod: '120-150 days',
      majorStates: ['West Bengal', 'Punjab', 'Uttar Pradesh', 'Bihar', 'Andhra Pradesh'],
      nutritionalValue: 'Rich in carbohydrates, contains protein, vitamins B1, B3, B6',
      marketPrice: '₹2,000-2,500/quintal',
      yieldPotential: '4-6 tonnes/hectare',
      tips: [
        'Transplant seedlings when they are 25-30 days old',
        'Maintain 5-7 cm water level in fields',
        'Apply balanced NPK fertilizers',
        'Control weeds within first 40 days'
      ]
    },
    {
      id: 2,
      name: 'Wheat',
      category: 'cereals',
      scientificName: 'Triticum aestivum',
      image: '',
      seasons: ['Rabi'],
      temperature: { min: 10, max: 25, optimal: '15-20°C' },
      rainfall: '50-100 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (450-650 mm)',
      growingPeriod: '120-150 days',
      majorStates: ['Uttar Pradesh', 'Punjab', 'Haryana', 'Madhya Pradesh', 'Rajasthan'],
      nutritionalValue: 'High in carbohydrates, protein, fiber, B vitamins',
      marketPrice: '₹2,125-2,400/quintal',
      yieldPotential: '4-5 tonnes/hectare',
      tips: [
        'Sow seeds in November for best yield',
        'First irrigation 20-25 days after sowing',
        'Apply nitrogen in split doses',
        'Harvest when grain moisture is 12-14%'
      ]
    },
    {
      id: 3,
      name: 'Maize',
      category: 'cereals',
      scientificName: 'Zea mays',
      image: '',
      seasons: ['Kharif', 'Rabi', 'Summer'],
      temperature: { min: 18, max: 32, optimal: '21-27°C' },
      rainfall: '50-100 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (500-800 mm)',
      growingPeriod: '80-110 days',
      majorStates: ['Karnataka', 'Rajasthan', 'Maharashtra', 'Bihar', 'Uttar Pradesh'],
      nutritionalValue: 'Rich in carbohydrates, fiber, vitamins A, B, E',
      marketPrice: '₹1,850-2,200/quintal',
      yieldPotential: '5-8 tonnes/hectare',
      tips: [
        'Plant in rows with 60-75 cm spacing',
        'Critical irrigation at flowering stage',
        'Intercrop with legumes for soil health',
        'Control stem borer with timely spraying'
      ]
    },
    {
      id: 4,
      name: 'Barley',
      category: 'cereals',
      scientificName: 'Hordeum vulgare',
      image: '',
      seasons: ['Rabi'],
      temperature: { min: 8, max: 22, optimal: '12-16°C' },
      rainfall: '30-50 cm',
      soil: 'Sandy loam to loamy soil',
      waterRequirement: 'Low (350-450 mm)',
      growingPeriod: '110-130 days',
      majorStates: ['Rajasthan', 'Uttar Pradesh', 'Madhya Pradesh', 'Haryana', 'Punjab'],
      nutritionalValue: 'High in fiber, selenium, manganese, B vitamins',
      marketPrice: '₹1,600-1,900/quintal',
      yieldPotential: '3-4 tonnes/hectare',
      tips: [
        'Drought tolerant - requires less water',
        'Best for areas with limited irrigation',
        'Sow in October-November',
        'Harvest when grains are hard'
      ]
    },
    {
      id: 5,
      name: 'Millets (Bajra)',
      category: 'cereals',
      scientificName: 'Pennisetum glaucum',
      image: '',
      seasons: ['Kharif'],
      temperature: { min: 25, max: 40, optimal: '30-35°C' },
      rainfall: '40-60 cm',
      soil: 'Sandy loam, well-drained soil',
      waterRequirement: 'Low (350-500 mm)',
      growingPeriod: '70-90 days',
      majorStates: ['Rajasthan', 'Maharashtra', 'Gujarat', 'Uttar Pradesh', 'Haryana'],
      nutritionalValue: 'High in protein, iron, calcium, fiber',
      marketPrice: '₹2,350-2,800/quintal',
      yieldPotential: '2-3 tonnes/hectare',
      tips: [
        'Excellent for drought-prone areas',
        'Deep root system helps water uptake',
        'Can grow in poor soil conditions',
        'Harvest when grains are physiologically mature'
      ]
    },
    // Pulses
    {
      id: 6,
      name: 'Chickpea (Gram)',
      category: 'pulses',
      scientificName: 'Cicer arietinum',
      image: '',
      seasons: ['Rabi'],
      temperature: { min: 15, max: 30, optimal: '20-25°C' },
      rainfall: '60-90 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Low (400-500 mm)',
      growingPeriod: '100-140 days',
      majorStates: ['Madhya Pradesh', 'Rajasthan', 'Maharashtra', 'Uttar Pradesh', 'Karnataka'],
      nutritionalValue: 'High protein, fiber, iron, phosphorus',
      marketPrice: '₹5,100-6,000/quintal',
      yieldPotential: '1.5-2.5 tonnes/hectare',
      tips: [
        'Grows well in residual soil moisture',
        'No irrigation needed if soil has good moisture',
        'Wilt resistant varieties recommended',
        'Harvest when pods turn brown'
      ]
    },
    {
      id: 7,
      name: 'Pigeon Pea (Arhar)',
      category: 'pulses',
      scientificName: 'Cajanus cajan',
      image: '',
      seasons: ['Kharif'],
      temperature: { min: 18, max: 35, optimal: '25-30°C' },
      rainfall: '60-100 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (600-700 mm)',
      growingPeriod: '150-180 days',
      majorStates: ['Maharashtra', 'Karnataka', 'Madhya Pradesh', 'Uttar Pradesh', 'Gujarat'],
      nutritionalValue: 'High protein, dietary fiber, potassium',
      marketPrice: '₹6,000-7,500/quintal',
      yieldPotential: '1.2-2 tonnes/hectare',
      tips: [
        'Can be intercropped with cereals',
        'Fixes nitrogen in soil',
        'Resistant to drought conditions',
        'Multiple harvests possible in some varieties'
      ]
    },
    // Oilseeds
    {
      id: 8,
      name: 'Groundnut',
      category: 'oilseeds',
      scientificName: 'Arachis hypogaea',
      image: '',
      seasons: ['Kharif', 'Rabi'],
      temperature: { min: 24, max: 33, optimal: '27-30°C' },
      rainfall: '50-75 cm',
      soil: 'Sandy loam, well-drained',
      waterRequirement: 'Moderate (500-700 mm)',
      growingPeriod: '100-130 days',
      majorStates: ['Gujarat', 'Rajasthan', 'Tamil Nadu', 'Andhra Pradesh', 'Karnataka'],
      nutritionalValue: 'High in protein, healthy fats, vitamin E',
      marketPrice: '₹5,500-6,500/quintal',
      yieldPotential: '2-3 tonnes/hectare',
      tips: [
        'Light and well-drained soil essential',
        'Avoid waterlogging at all costs',
        'Gypsum application improves quality',
        'Harvest when 75% pods mature'
      ]
    },
    {
      id: 9,
      name: 'Mustard',
      category: 'oilseeds',
      scientificName: 'Brassica juncea',
      image: '',
      seasons: ['Rabi'],
      temperature: { min: 10, max: 25, optimal: '15-20°C' },
      rainfall: '25-40 cm',
      soil: 'Loamy to clay loam soil',
      waterRequirement: 'Low (350-450 mm)',
      growingPeriod: '110-145 days',
      majorStates: ['Rajasthan', 'Uttar Pradesh', 'Haryana', 'Madhya Pradesh', 'Gujarat'],
      nutritionalValue: 'Rich in omega-3, vitamin E, minerals',
      marketPrice: '₹5,050-6,000/quintal',
      yieldPotential: '1.5-2.5 tonnes/hectare',
      tips: [
        'Sow in October-November',
        'Can tolerate frost conditions',
        'Aphid control is critical',
        'Harvest when 75% pods turn yellow'
      ]
    },
    {
      id: 10,
      name: 'Soybean',
      category: 'oilseeds',
      scientificName: 'Glycine max',
      image: '',
      seasons: ['Kharif'],
      temperature: { min: 20, max: 35, optimal: '26-30°C' },
      rainfall: '60-100 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (450-700 mm)',
      growingPeriod: '90-120 days',
      majorStates: ['Madhya Pradesh', 'Maharashtra', 'Rajasthan', 'Karnataka'],
      nutritionalValue: 'Complete protein, isoflavones, fiber',
      marketPrice: '₹3,950-4,800/quintal',
      yieldPotential: '2-3 tonnes/hectare',
      tips: [
        'Rhizobium seed treatment essential',
        'Fixes atmospheric nitrogen',
        'Avoid waterlogging during flowering',
        'Harvest at physiological maturity'
      ]
    },
    // Vegetables
    {
      id: 11,
      name: 'Potato',
      category: 'vegetables',
      scientificName: 'Solanum tuberosum',
      image: '',
      seasons: ['Rabi', 'Kharif'],
      temperature: { min: 15, max: 25, optimal: '18-22°C' },
      rainfall: '50-75 cm',
      soil: 'Well-drained sandy loam',
      waterRequirement: 'Moderate (500-700 mm)',
      growingPeriod: '75-120 days',
      majorStates: ['Uttar Pradesh', 'West Bengal', 'Bihar', 'Gujarat', 'Punjab'],
      nutritionalValue: 'Carbohydrates, vitamin C, potassium, B6',
      marketPrice: '₹800-1,500/quintal',
      yieldPotential: '20-35 tonnes/hectare',
      tips: [
        'Use certified disease-free seed tubers',
        'Earthing up is essential for tuber development',
        'Control late blight with fungicides',
        'Cure tubers before storage'
      ]
    },
    {
      id: 12,
      name: 'Tomato',
      category: 'vegetables',
      scientificName: 'Solanum lycopersicum',
      image: '',
      seasons: ['Rabi', 'Kharif', 'Summer'],
      temperature: { min: 18, max: 30, optimal: '21-24°C' },
      rainfall: '50-75 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (400-600 mm)',
      growingPeriod: '90-120 days',
      majorStates: ['Andhra Pradesh', 'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Gujarat'],
      nutritionalValue: 'Lycopene, vitamin C, potassium',
      marketPrice: '₹1,000-3,000/quintal',
      yieldPotential: '30-50 tonnes/hectare',
      tips: [
        'Stake plants for better yield',
        'Regular watering during fruiting',
        'Control early and late blight',
        'Harvest at breaker stage for transport'
      ]
    },
    {
      id: 13,
      name: 'Onion',
      category: 'vegetables',
      scientificName: 'Allium cepa',
      image: '',
      seasons: ['Rabi', 'Kharif'],
      temperature: { min: 15, max: 30, optimal: '20-25°C' },
      rainfall: '50-75 cm',
      soil: 'Loamy to clay loam, well-drained',
      waterRequirement: 'Moderate (350-550 mm)',
      growingPeriod: '120-150 days',
      majorStates: ['Maharashtra', 'Karnataka', 'Gujarat', 'Rajasthan', 'Bihar'],
      nutritionalValue: 'Quercetin, vitamin C, sulfur compounds',
      marketPrice: '₹1,000-3,500/quintal',
      yieldPotential: '25-40 tonnes/hectare',
      tips: [
        'Transplant seedlings at 6-8 weeks',
        'Stop irrigation 10 days before harvest',
        'Cure bulbs properly before storage',
        'Good storage extends market window'
      ]
    },
    // Fruits
    {
      id: 14,
      name: 'Banana',
      category: 'fruits',
      scientificName: 'Musa paradisiaca',
      image: '',
      seasons: ['Whole Year'],
      temperature: { min: 20, max: 35, optimal: '27-30°C' },
      rainfall: '100-200 cm',
      soil: 'Deep, well-drained loamy soil',
      waterRequirement: 'High (1800-2200 mm)',
      growingPeriod: '10-12 months',
      majorStates: ['Tamil Nadu', 'Maharashtra', 'Gujarat', 'Andhra Pradesh', 'Karnataka'],
      nutritionalValue: 'Potassium, vitamin B6, vitamin C, fiber',
      marketPrice: '₹1,500-2,500/quintal',
      yieldPotential: '50-60 tonnes/hectare',
      tips: [
        'Tissue culture plants give uniform yield',
        'Desuckering improves bunch weight',
        'Propping prevents wind damage',
        'Harvest at 75% maturity'
      ]
    },
    {
      id: 15,
      name: 'Mango',
      category: 'fruits',
      scientificName: 'Mangifera indica',
      image: '',
      seasons: ['Summer'],
      temperature: { min: 20, max: 40, optimal: '24-30°C' },
      rainfall: '75-250 cm',
      soil: 'Deep, well-drained alluvial soil',
      waterRequirement: 'Moderate (850-1000 mm)',
      growingPeriod: '3-6 months (flowering to harvest)',
      majorStates: ['Uttar Pradesh', 'Andhra Pradesh', 'Karnataka', 'Bihar', 'Gujarat'],
      nutritionalValue: 'Vitamin A, C, fiber, antioxidants',
      marketPrice: '₹3,000-8,000/quintal',
      yieldPotential: '10-15 tonnes/hectare',
      tips: [
        'Pruning after harvest improves flowering',
        'Control mango hopper and powdery mildew',
        'Paclobutrazol for regular bearing',
        'Harvest at mature green stage for export'
      ]
    },
    // Spices
    {
      id: 16,
      name: 'Turmeric',
      category: 'spices',
      scientificName: 'Curcuma longa',
      image: '',
      seasons: ['Kharif'],
      temperature: { min: 20, max: 35, optimal: '25-30°C' },
      rainfall: '150-200 cm',
      soil: 'Well-drained loamy or alluvial soil',
      waterRequirement: 'High (1500-2250 mm)',
      growingPeriod: '7-9 months',
      majorStates: ['Telangana', 'Andhra Pradesh', 'Tamil Nadu', 'Karnataka', 'Odisha'],
      nutritionalValue: 'Curcumin, antioxidants, anti-inflammatory',
      marketPrice: '₹7,000-12,000/quintal',
      yieldPotential: '20-30 tonnes/hectare (fresh)',
      tips: [
        'Plant mother rhizomes in May-June',
        'Mulching conserves moisture',
        'Harvest when leaves turn yellow',
        'Curing and polishing improves price'
      ]
    },
    {
      id: 17,
      name: 'Chilli',
      category: 'spices',
      scientificName: 'Capsicum annuum',
      image: '️',
      seasons: ['Kharif', 'Rabi'],
      temperature: { min: 20, max: 35, optimal: '25-30°C' },
      rainfall: '60-120 cm',
      soil: 'Well-drained loamy soil',
      waterRequirement: 'Moderate (600-1200 mm)',
      growingPeriod: '120-150 days',
      majorStates: ['Andhra Pradesh', 'Karnataka', 'Madhya Pradesh', 'Maharashtra', 'Tamil Nadu'],
      nutritionalValue: 'Vitamin C, capsaicin, vitamin A',
      marketPrice: '₹8,000-15,000/quintal (dry)',
      yieldPotential: '1.5-2.5 tonnes/hectare (dry)',
      tips: [
        'Transplant 40-45 day old seedlings',
        'Multiple pickings possible',
        'Control thrips and mites',
        'Dry in shade for better color'
      ]
    },
    // Commercial
    {
      id: 18,
      name: 'Sugarcane',
      category: 'commercial',
      scientificName: 'Saccharum officinarum',
      image: '',
      seasons: ['Whole Year'],
      temperature: { min: 20, max: 35, optimal: '27-32°C' },
      rainfall: '100-200 cm',
      soil: 'Deep loamy to clay loam soil',
      waterRequirement: 'Very High (1500-2500 mm)',
      growingPeriod: '12-18 months',
      majorStates: ['Uttar Pradesh', 'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Gujarat'],
      nutritionalValue: 'Sucrose, iron, calcium, potassium',
      marketPrice: '₹285-315/quintal (FRP)',
      yieldPotential: '80-120 tonnes/hectare',
      tips: [
        'Use disease-free seed sets',
        'Trash mulching conserves moisture',
        'Earthing up prevents lodging',
        'Harvest at peak maturity for max sugar'
      ]
    },
    {
      id: 19,
      name: 'Cotton',
      category: 'commercial',
      scientificName: 'Gossypium hirsutum',
      image: '️',
      seasons: ['Kharif'],
      temperature: { min: 21, max: 35, optimal: '25-30°C' },
      rainfall: '50-100 cm',
      soil: 'Black cotton soil, well-drained',
      waterRequirement: 'Moderate (700-1200 mm)',
      growingPeriod: '150-180 days',
      majorStates: ['Gujarat', 'Maharashtra', 'Telangana', 'Andhra Pradesh', 'Rajasthan'],
      nutritionalValue: 'Cottonseed oil - high in vitamin E',
      marketPrice: '₹6,000-7,000/quintal',
      yieldPotential: '2-3 tonnes/hectare (seed cotton)',
      tips: [
        'Bt cotton varieties resist bollworm',
        'Proper spacing improves boll development',
        'Control sucking pests early',
        'Pick at right maturity for best quality'
      ]
    },
    {
      id: 20,
      name: 'Jute',
      category: 'commercial',
      scientificName: 'Corchorus capsularis',
      image: '',
      seasons: ['Kharif'],
      temperature: { min: 24, max: 37, optimal: '30-34°C' },
      rainfall: '150-200 cm',
      soil: 'Sandy loam to clay loam, alluvial',
      waterRequirement: 'High (1000-1500 mm)',
      growingPeriod: '120-150 days',
      majorStates: ['West Bengal', 'Bihar', 'Assam', 'Odisha'],
      nutritionalValue: 'Fiber crop - not for food',
      marketPrice: '₹4,500-5,500/quintal',
      yieldPotential: '25-35 quintals/hectare',
      tips: [
        'Broadcast or line sowing',
        'Harvest at 50% flowering for best fiber',
        'Retting for 10-15 days',
        'Proper drying ensures quality'
      ]
    }
  ];

  const filteredCrops = cropsData.filter(crop => {
    const matchesCategory = selectedCategory === 'all' || crop.category === selectedCategory;
    const matchesSearch = crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          crop.scientificName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getSeasonClasses = (season) => {
    const s = season.toLowerCase().replace(' ', '-');
    switch (s) {
      case 'kharif': return 'bg-emerald-50/15 text-red-500';
      case 'rabi': return 'bg-emerald-50/15 text-stone-900';
      case 'summer': return 'bg-emerald-50/15 text-stone-900';
      case 'winter': return 'bg-emerald-500/15 text-emerald-500';
      case 'whole-year': return 'bg-emerald-50/15 text-stone-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 w-full font-sans py-12 px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[1.8rem] sm:text-[2.5rem] text-stone-900 m-0 font-bold"> Crop Information Library</h1>
        <p className="text-stone-500 text-base sm:text-[1.1rem] mt-2">Comprehensive guide to major crops grown in India</p>
      </div>

      {/* Search and Filter */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center bg-white p-4 sm:px-6 sm:py-4 rounded-md shadow-sm mb-4">
          <svg className="text-stone-900 mr-4 shrink-0" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder="Search crops..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border-none text-base outline-none w-full"
          />
        </div>

        <div className="flex flex-nowrap sm:flex-wrap gap-3 justify-start sm:justify-center overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {cropCategories.map(cat => (
            <button
              key={cat.id}
              className={`shrink-0 flex items-center gap-2 px-5 py-3 border-emerald-500 rounded-full transition-all duration-300 text-[0.9rem] ${
                selectedCategory === cat.id
                  ? 'bg-stone-50 border border-stone-200 text-white border-transparent'
                  : 'bg-white border-transparent hover:-translate-y-0.5 hover:shadow-sm'
              }`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              <span className="text-[1.2rem]">{cat.icon}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Crops Grid */}
      <div className="grid grid-cols-[repeat(au sm:grid-cols-[repeat(au gap-6 max-w-[1400px] mx-auto">
        {filteredCrops.map(crop => (
          <div 
            key={crop.id} 
            className="group bg-white rounded-lg overflow-hidden transition-all duration-300 shadow-sm hover:-translate-y-2 hover:shadow-sm"
            onClick={() => setSelectedCrop(crop)}
          >
            <div className="h-[120px] bg-stone-50 border border-stone-200 flex items-center justify-center text-[4rem]">
              {crop.image}
            </div>
            <div className="p-5">
              <h3 className="m-0 text-[1.3rem] text-stone-900 font-bold">{crop.name}</h3>
              <p className="text-stone-900 italic text-[0.85rem] mt-1 mb-3">{crop.scientificName}</p>
              <div className="flex gap-2 mb-3">
                {crop.seasons.slice(0, 2).map(season => (
                  <span key={season} className={`px-3 py-1 rounded-md text-[0.75rem] font-semibold ${getSeasonClasses(season)}`}>
                    {season}
                  </span>
                ))}
              </div>
              <div className="text-stone-500 text-[0.9rem]">
                ️ {crop.temperature.optimal}
              </div>
            </div>
            <div className="px-5 py-4 bg-stone-50 text-stone-900 font-semibold text-[0.9rem] text-center transition-all duration-300 group-hover:bg-emerald-50 group-hover:text-white">
              View Details →
            </div>
          </div>
        ))}
      </div>

      {filteredCrops.length === 0 && (
        <div className="text-center p-12 text-stone-500">
          <p>No crops found matching your search.</p>
        </div>
      )}

      {/* Crop Detail Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[1000] p-4 sm:p-8 backdrop-blur-[4px]" onClick={() => setSelectedCrop(null)}>
          <div className="bg-white rounded-lg max-w-[700px] w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto relative m-4 sm:m-0" onClick={e => e.stopPropagation()}>
            <button className="absolute top-4 right-4 bg-emerald-50 border-none rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 z-10 hover:bg-slate-200" onClick={() => setSelectedCrop(null)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="flex items-center gap-6 p-6 sm:p-8 bg-stone-50 border border-stone-200">
              <div className="text-[4rem]">{selectedCrop.image}</div>
              <div>
                <h2 className="m-0 text-[2rem] text-stone-900 font-bold">{selectedCrop.name}</h2>
                <p className="text-stone-500 italic mt-1">{selectedCrop.scientificName}</p>
              </div>
            </div>

            <div className="p-4 sm:p-6 sm:px-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="bg-stone-50 p-4 rounded-md text-center">
                  <span className="block text-stone-500 text-[0.85rem] mb-2">️ Temperature</span>
                  <span className="font-semibold text-stone-900 text-[0.95rem]">{selectedCrop.temperature.optimal}</span>
                </div>
                <div className="bg-stone-50 p-4 rounded-md text-center">
                  <span className="block text-stone-500 text-[0.85rem] mb-2"> Water Need</span>
                  <span className="font-semibold text-stone-900 text-[0.95rem]">{selectedCrop.waterRequirement}</span>
                </div>
                <div className="bg-stone-50 p-4 rounded-md text-center">
                  <span className="block text-stone-500 text-[0.85rem] mb-2">⏱️ Duration</span>
                  <span className="font-semibold text-stone-900 text-[0.95rem]">{selectedCrop.growingPeriod}</span>
                </div>
                <div className="bg-stone-50 p-4 rounded-md text-center">
                  <span className="block text-stone-500 text-[0.85rem] mb-2"> Yield</span>
                  <span className="font-semibold text-stone-900 text-[0.95rem]">{selectedCrop.yieldPotential}</span>
                </div>
              </div>

              {/* Seasons */}
              <div className="mb-6 pb-6 border-b border-emerald-200">
                <h4 className="m-0 mb-4 text-stone-900 text-[1.1rem] font-bold">️ Growing Seasons</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCrop.seasons.map(season => (
                    <span key={season} className={`px-4 py-2 rounded-full text-[0.85rem] font-semibold ${getSeasonClasses(season)}`}>
                      {season}
                    </span>
                  ))}
                </div>
              </div>

              {/* Soil & Rainfall */}
              <div className="mb-6 pb-6 border-b border-emerald-200">
                <h4 className="m-0 mb-4 text-stone-900 text-[1.1rem] font-bold"> Soil & Climate</h4>
                <p className="my-2 text-stone-600 leading-relaxed"><strong>Soil Type:</strong> {selectedCrop.soil}</p>
                <p className="my-2 text-stone-600 leading-relaxed"><strong>Rainfall:</strong> {selectedCrop.rainfall}</p>
                <p className="my-2 text-stone-600 leading-relaxed"><strong>Temperature Range:</strong> {selectedCrop.temperature.min}°C - {selectedCrop.temperature.max}°C</p>
              </div>

              {/* Major States */}
              <div className="mb-6 pb-6 border-b border-emerald-200">
                <h4 className="m-0 mb-4 text-stone-900 text-[1.1rem] font-bold"> Major Growing States</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCrop.majorStates.map(state => (
                    <span key={state} className="bg-emerald-50 text-stone-900 px-3 py-1.5 rounded-md text-[0.85rem]">{state}</span>
                  ))}
                </div>
              </div>

              {/* Market Info */}
              <div className="mb-6 pb-6 border-b border-emerald-200">
                <h4 className="m-0 mb-4 text-stone-900 text-[1.1rem] font-bold"> Market Information</h4>
                <p className="my-2 text-stone-600 leading-relaxed"><strong>Current Price:</strong> {selectedCrop.marketPrice}</p>
                <p className="my-2 text-stone-600 leading-relaxed"><strong>Nutritional Value:</strong> {selectedCrop.nutritionalValue}</p>
              </div>

              {/* Growing Tips */}
              <div className="mb-6">
                <h4 className="m-0 mb-4 text-stone-900 text-[1.1rem] font-bold"> Growing Tips</h4>
                <ul className="m-0 pl-6">
                  {selectedCrop.tips.map((tip, index) => (
                    <li key={index} className="text-stone-600 mb-2 leading-relaxed">{tip}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="p-6 sm:px-8 bg-stone-50 text-center">
              <button 
                className="bg-stone-50 border border-stone-200 text-white border-none px-8 py-4 rounded-md text-base font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:shadow-sm"
                onClick={() => navigate('/dashboard')}
              >
                Get Recommendation for this Crop
              </button>
            </div>
          </div>
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />
    </div>
  );
};

export default CropLibrary;
