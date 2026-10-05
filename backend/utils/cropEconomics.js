const DEFAULT_ECONOMICS = {
  investmentPerHectare: 50000,
  farmgatePricePerKg: 18,
  riskLevel: 'Moderate',
  components: {
    seed: 0.18,
    fertilizer: 0.22,
    labour: 0.28,
    irrigation: 0.1,
    cropProtection: 0.1,
    machinery: 0.07,
    harvestPostHarvest: 0.05
  }
};

const ECONOMICS_BY_CROP = {
  rice: { investmentPerHectare: 62000, farmgatePricePerKg: 23, riskLevel: 'Moderate' },
  paddy: { investmentPerHectare: 62000, farmgatePricePerKg: 23, riskLevel: 'Moderate' },
  wheat: { investmentPerHectare: 52000, farmgatePricePerKg: 24, riskLevel: 'Low to Moderate' },
  maize: { investmentPerHectare: 48000, farmgatePricePerKg: 21, riskLevel: 'Moderate' },
  barley: { investmentPerHectare: 42000, farmgatePricePerKg: 22, riskLevel: 'Low to Moderate' },
  bajra: { investmentPerHectare: 32000, farmgatePricePerKg: 25, riskLevel: 'Low' },
  jowar: { investmentPerHectare: 34000, farmgatePricePerKg: 28, riskLevel: 'Low' },
  ragi: { investmentPerHectare: 36000, farmgatePricePerKg: 35, riskLevel: 'Low to Moderate' },
  gram: { investmentPerHectare: 39000, farmgatePricePerKg: 65, riskLevel: 'Moderate' },
  moong: { investmentPerHectare: 36000, farmgatePricePerKg: 78, riskLevel: 'Moderate' },
  urad: { investmentPerHectare: 38000, farmgatePricePerKg: 75, riskLevel: 'Moderate' },
  arhar: { investmentPerHectare: 43000, farmgatePricePerKg: 82, riskLevel: 'Moderate' },
  tur: { investmentPerHectare: 43000, farmgatePricePerKg: 82, riskLevel: 'Moderate' },
  lentil: { investmentPerHectare: 37000, farmgatePricePerKg: 70, riskLevel: 'Moderate' },
  mustard: { investmentPerHectare: 41000, farmgatePricePerKg: 55, riskLevel: 'Low to Moderate' },
  soybean: { investmentPerHectare: 45000, farmgatePricePerKg: 48, riskLevel: 'Moderate' },
  soyabean: { investmentPerHectare: 45000, farmgatePricePerKg: 48, riskLevel: 'Moderate' },
  groundnut: { investmentPerHectare: 62000, farmgatePricePerKg: 63, riskLevel: 'Moderate' },
  sesamum: { investmentPerHectare: 36000, farmgatePricePerKg: 90, riskLevel: 'Moderate' },
  sugarcane: { investmentPerHectare: 125000, farmgatePricePerKg: 3.7, riskLevel: 'Moderate' },
  cotton: { investmentPerHectare: 78000, farmgatePricePerKg: 70, riskLevel: 'High' },
  jute: { investmentPerHectare: 65000, farmgatePricePerKg: 55, riskLevel: 'Moderate' },
  tobacco: { investmentPerHectare: 95000, farmgatePricePerKg: 120, riskLevel: 'High' },
  potato: { investmentPerHectare: 145000, farmgatePricePerKg: 14, riskLevel: 'High' },
  onion: { investmentPerHectare: 120000, farmgatePricePerKg: 16, riskLevel: 'High' },
  tomato: { investmentPerHectare: 135000, farmgatePricePerKg: 18, riskLevel: 'High' },
  brinjal: { investmentPerHectare: 105000, farmgatePricePerKg: 18, riskLevel: 'Moderate to High' },
  cabbage: { investmentPerHectare: 95000, farmgatePricePerKg: 13, riskLevel: 'Moderate to High' },
  cauliflower: { investmentPerHectare: 105000, farmgatePricePerKg: 18, riskLevel: 'Moderate to High' },
  banana: { investmentPerHectare: 175000, farmgatePricePerKg: 12, riskLevel: 'Moderate to High' },
  mango: { investmentPerHectare: 90000, farmgatePricePerKg: 35, riskLevel: 'Moderate to High' },
  apple: { investmentPerHectare: 160000, farmgatePricePerKg: 55, riskLevel: 'High' },
  orange: { investmentPerHectare: 105000, farmgatePricePerKg: 28, riskLevel: 'Moderate' },
  citrus: { investmentPerHectare: 105000, farmgatePricePerKg: 28, riskLevel: 'Moderate' },
  chillies: { investmentPerHectare: 110000, farmgatePricePerKg: 70, riskLevel: 'High' },
  turmeric: { investmentPerHectare: 115000, farmgatePricePerKg: 75, riskLevel: 'Moderate to High' },
  ginger: { investmentPerHectare: 185000, farmgatePricePerKg: 55, riskLevel: 'High' },
  coriander: { investmentPerHectare: 42000, farmgatePricePerKg: 65, riskLevel: 'Moderate' },
  coconut: { investmentPerHectare: 85000, farmgatePricePerKg: 25, riskLevel: 'Moderate' },
  tea: { investmentPerHectare: 140000, farmgatePricePerKg: 22, riskLevel: 'Moderate to High' },
  coffee: { investmentPerHectare: 150000, farmgatePricePerKg: 75, riskLevel: 'Moderate to High' }
};

const ECONOMICS_BY_CATEGORY = [
  { match: /rice|paddy/i, data: ECONOMICS_BY_CROP.rice },
  { match: /wheat/i, data: ECONOMICS_BY_CROP.wheat },
  { match: /maize|corn/i, data: ECONOMICS_BY_CROP.maize },
  { match: /millet|bajra|jowar|ragi/i, data: { investmentPerHectare: 34000, farmgatePricePerKg: 29, riskLevel: 'Low' } },
  { match: /gram|moong|urad|arhar|tur|lentil|pulse|pea|bean/i, data: { investmentPerHectare: 39000, farmgatePricePerKg: 74, riskLevel: 'Moderate' } },
  { match: /mustard|soybean|soyabean|groundnut|sesamum|oilseed/i, data: { investmentPerHectare: 46000, farmgatePricePerKg: 55, riskLevel: 'Moderate' } },
  { match: /vegetable|potato|onion|tomato|brinjal|cabbage|cauliflower/i, data: { investmentPerHectare: 120000, farmgatePricePerKg: 16, riskLevel: 'High' } },
  { match: /fruit|banana|mango|apple|orange|citrus/i, data: { investmentPerHectare: 125000, farmgatePricePerKg: 26, riskLevel: 'Moderate to High' } },
  { match: /spice|chilli|turmeric|ginger|coriander/i, data: { investmentPerHectare: 110000, farmgatePricePerKg: 68, riskLevel: 'High' } },
  { match: /plantation|coconut|tea|coffee/i, data: { investmentPerHectare: 125000, farmgatePricePerKg: 40, riskLevel: 'Moderate to High' } }
];

const normalizeCropName = (cropName) => String(cropName || '').trim().toLowerCase();

const getCropEconomicsBase = (cropName) => {
  const normalized = normalizeCropName(cropName);
  const exactKey = Object.keys(ECONOMICS_BY_CROP).find((key) => normalized.includes(key));

  if (exactKey) {
    return { ...DEFAULT_ECONOMICS, ...ECONOMICS_BY_CROP[exactKey] };
  }

  const category = ECONOMICS_BY_CATEGORY.find((item) => item.match.test(cropName || ''));
  if (category) {
    return { ...DEFAULT_ECONOMICS, ...category.data };
  }

  return DEFAULT_ECONOMICS;
};

const roundToNearest = (value, nearest = 100) => Math.round(value / nearest) * nearest;

const formatRange = (value, spreadPercent, nearest = 100) => {
  const spread = value * spreadPercent;
  return {
    min: Math.max(0, roundToNearest(value - spread, nearest)),
    max: roundToNearest(value + spread, nearest)
  };
};

const normalizeExpectedYield = (yieldPrediction = {}) => {
  const expected = Number(yieldPrediction.expected) || 0;
  const unit = yieldPrediction.unit || 'kg/hectare';

  if (expected > 0 && expected < 100) {
    return {
      expectedKgPerHectare: Math.round(expected * 1000),
      note: 'Yield looked like tonnes/hectare, so it was converted to kg/hectare for this estimate.'
    };
  }

  return {
    expectedKgPerHectare: Math.round(expected),
    note: unit === 'kg/hectare' ? '' : `Yield converted from ${unit} for this estimate.`
  };
};

const buildCostBreakdown = (investment, components) => {
  return Object.entries(components).map(([key, share]) => ({
    key,
    amount: roundToNearest(investment * share, 100)
  }));
};

const calculateCropEconomics = (cropName, yieldPrediction) => {
  const base = getCropEconomicsBase(cropName);
  const { expectedKgPerHectare, note } = normalizeExpectedYield(yieldPrediction);
  const investment = base.investmentPerHectare;
  const price = base.farmgatePricePerKg;
  const grossRevenue = expectedKgPerHectare * price;
  const netProfit = grossRevenue - investment;
  const roiPercent = investment > 0 ? (netProfit / investment) * 100 : 0;
  const breakEvenYield = price > 0 ? investment / price : 0;

  return {
    investment: {
      expected: roundToNearest(investment, 100),
      range: formatRange(investment, 0.15, 100),
      unit: 'INR/hectare',
      costBreakdown: buildCostBreakdown(investment, base.components)
    },
    revenue: {
      expected: roundToNearest(grossRevenue, 100),
      range: formatRange(grossRevenue, 0.2, 100),
      assumedPricePerKg: price,
      expectedYieldKgPerHectare: expectedKgPerHectare,
      unit: 'INR/hectare'
    },
    profit: {
      expected: roundToNearest(netProfit, 100),
      range: formatRange(netProfit, 0.25, 100),
      roiPercent: Math.round(roiPercent),
      breakEvenYieldKgPerHectare: Math.round(breakEvenYield),
      unit: 'INR/hectare'
    },
    riskLevel: base.riskLevel,
    assumptions: [
      'Figures are indicative per-hectare estimates for planning, not guaranteed returns.',
      'Market price, labour cost, irrigation, transport, and crop quality can change final profit.',
      note
    ].filter(Boolean)
  };
};

module.exports = {
  calculateCropEconomics
};
