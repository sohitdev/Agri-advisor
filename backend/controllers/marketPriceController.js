const axios = require('axios');

// data.gov.in Agmarknet resource – Daily APMC mandi prices across India
const DATA_GOV_BASE = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
const PUBLIC_DEMO_DATA_GOV_API_KEY = '579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b';
const AVAILABLE_LOCATIONS_CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const MARKET_PRICE_CACHE_TTL_MS = 60 * 60 * 1000;
const availableLocationsCache = new Map();
const marketPricesCache = new Map();
const DISTRICT_PROBE_LIMIT = 1000;
const STATE_PROBE_BATCH_SIZE = 8;
const VERIFIED_FALLBACK_STATES_BY_CROP = {
  rice: [
    'Andhra Pradesh',
    'Gujarat',
    'Kerala',
    'Maharashtra',
    'Manipur',
    'Odisha',
    'Tamil Nadu',
    'Telangana',
    'Uttar Pradesh'
  ]
};
const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'NCT of Delhi',
  'Jammu and Kashmir', 'Ladakh', 'Andaman and Nicobar Islands', 'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu', 'Lakshadweep', 'Puducherry'
];

const DAY_RANGE_BY_TIME = {
  '1week': 7,
  '1month': 30,
  '3month': 90,
  '6month': 180
};

// Map frontend crop ids to commodity names used in the Agmarknet dataset
const CROP_VARIANTS = {
  rice:       ['Rice', 'Paddy', 'Paddy(Dushehari)', 'Paddy(Sona Masuri)'],
  wheat:      ['Wheat'],
  cotton:     ['Cotton', 'Cotton(Lint)', 'Cotton Seed'],
  sugarcane:  ['Sugarcane'],
  soybean:    ['Soya bean', 'Soyabean', 'Soyabean(Black)'],
  groundnut:  ['Groundnut', 'Groundnut (Whole)', 'Groundnut (Split)'],
  potato:     ['Potato'],
  onion:      ['Onion'],
  tomato:     ['Tomato'],
  maize:      ['Maize']
};

const sanitizeCrop = (crop = '') =>
  String(crop).trim().replace(/[^a-zA-Z\s-]/g, '').replace(/\s+/g, ' ');

const getDataGovApiKey = () => String(process.env.DATA_GOV_API_KEY || '').trim();
const isUsingPublicDemoKey = (apiKey) => apiKey === PUBLIC_DEMO_DATA_GOV_API_KEY;

// Convert DD/MM/YYYY → YYYY-MM-DD
const toIso = (dateStr = '') => {
  const parts = String(dateStr).split('/');
  if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
  return dateStr;
};

const avg = (arr) =>
  arr.length ? Math.round(arr.reduce((s, v) => s + v, 0) / arr.length) : 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch records from data.gov.in for a commodity + optional location filters
const fetchRecords = async (apiKey, commodity, state, district, options = {}) => {
  const { limit = 500, offset = 0, timeout = 15000 } = options;
  const params = {
    'api-key': apiKey,
    format: 'json',
    limit,
    offset,
    'filters[commodity]': commodity
  };
  if (state) params['filters[state]'] = state;
  if (district) params['filters[district]'] = district;

  const { data } = await axios.get(DATA_GOV_BASE, { params, timeout });
  return Array.isArray(data.records) ? data.records : [];
};

// Try multiple commodity name variants; return first non-empty result
const fetchBestMatch = async (apiKey, cropVariants, state, district) => {
  for (const name of cropVariants) {
    try {
      const records = await fetchRecords(apiKey, name, state, district);
      if (records.length) return records;
    } catch (_) { /* try next */ }
  }
  return [];
};

const getCropVariantsFromInput = (cropInput = '') => {
  const normalized = String(cropInput).trim().toLowerCase();
  if (!normalized) {
    return [];
  }

  if (CROP_VARIANTS[normalized]) {
    return CROP_VARIANTS[normalized];
  }

  const keyFromName = Object.keys(CROP_VARIANTS).find((key) => key.toLowerCase() === normalized);
  if (keyFromName) {
    return CROP_VARIANTS[keyFromName];
  }

  return [sanitizeCrop(cropInput)];
};

const fetchStateRecords = async (apiKey, cropVariants, state, options = {}) => {
  for (const variant of cropVariants) {
    try {
      const records = await fetchRecords(apiKey, variant, state, null, options);
      const validRecords = records.filter((record) => Number(record.modal_price || 0) > 0);
      if (validRecords.length) {
        return validRecords;
      }
    } catch (_) {
      // Ignore per-variant errors and continue probing.
    }
  }

  return [];
};

const fetchDistrictRecords = async (apiKey, cropVariants, state, district, options = {}) => {
  if (!district) {
    return [];
  }

  for (const variant of cropVariants) {
    try {
      const records = await fetchRecords(apiKey, variant, state, district, options);
      const validRecords = records.filter((record) => Number(record.modal_price || 0) > 0);
      if (validRecords.length) {
        return validRecords;
      }
    } catch (_) {
      // Continue with the next crop naming variant.
    }
  }

  return [];
};

const fetchStateRecordsWithRetry = async (apiKey, cropVariants, state, attempts = 3) => {
  let lastError = null;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      const records = await fetchStateRecords(apiKey, cropVariants, state, { limit: 500, timeout: 15000 });
      if (records.length) {
        return records;
      }
    } catch (error) {
      lastError = error;
    }

    if (attempt < attempts - 1) {
      await sleep(500 * (attempt + 1));
    }
  }

  if (lastError) {
    throw lastError;
  }

  return [];
};

const getAvailableStates = async (apiKey, cropVariants) => {
  const states = new Set();

  for (let index = 0; index < INDIA_STATES.length; index += STATE_PROBE_BATCH_SIZE) {
    const batch = INDIA_STATES.slice(index, index + STATE_PROBE_BATCH_SIZE);
    const batchResults = await Promise.all(
      batch.map(async (state) => {
        const records = await fetchStateRecords(apiKey, cropVariants, state, { limit: 5, timeout: 5000 });
        return records;
      })
    );

    batchResults.forEach((records) => {
      records.forEach((record) => {
        const state = String(record.state || '').trim();
        const price = Number(record.modal_price || 0);
        if (state && Number.isFinite(price) && price > 0) {
          states.add(state);
        }
      });
    });
  }

  return Array.from(states).sort((a, b) => a.localeCompare(b));
};

// @desc    Get current mandi prices by crop + state (Agmarknet via data.gov.in)
// @route   GET /api/market-prices
// @access  Private
exports.getMarketPrices = async (req, res) => {
  try {
    const cropInput = sanitizeCrop(req.query.crop);
    const state     = String(req.query.state     || req.user?.state     || '').trim();
    const district  = String(req.query.district  || req.user?.district  || '').trim();
    const timeRange = String(req.query.timeRange || '1month').trim();
    const days      = DAY_RANGE_BY_TIME[timeRange] || 30;
    const apiKey    = getDataGovApiKey();

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'DATA_GOV_API_KEY is not configured on server'
      });
    }

    if (!cropInput || !state) {
      return res.status(400).json({
        success: false,
        message: 'crop and state are required'
      });
    }

    const cropVariants = getCropVariantsFromInput(cropInput);
    const cacheKey = `${cropInput.toLowerCase()}::${state.toLowerCase()}::${district.toLowerCase()}::${timeRange}`;
    const cached = marketPricesCache.get(cacheKey);

    let records = [];
    let coverage = 'state';
    let coverageMessage = `Showing mandis from ${state}.`;
    try {
      if (district) {
        records = await fetchDistrictRecords(apiKey, cropVariants, state, district, {
          limit: DISTRICT_PROBE_LIMIT,
          timeout: 15000
        });
        if (records.length) {
          coverage = 'district';
          coverageMessage = `Showing mandis reported in ${district}, ${state}.`;
        }
      }

      if (!records.length) {
        records = await fetchStateRecordsWithRetry(apiKey, cropVariants, state, 3);
        coverage = district ? 'state_fallback' : 'state';
        coverageMessage = district
          ? `No recent ${cropInput} prices were found in ${district}. Showing active mandis across ${state}.`
          : `Showing mandis from ${state}.`;
      }
    } catch (error) {
      if (cached && (Date.now() - cached.timestamp) < MARKET_PRICE_CACHE_TTL_MS) {
        return res.json({
          success: true,
          data: {
            ...cached.data,
            stale: true
          }
        });
      }
      throw error;
    }

    if (!records.length) {
      if (cached && (Date.now() - cached.timestamp) < MARKET_PRICE_CACHE_TTL_MS) {
        return res.json({
          success: true,
          data: {
            ...cached.data,
            stale: true
          }
        });
      }

      return res.status(404).json({
        success: false,
        message: district
          ? `No mandi prices found for ${cropInput} in ${district}, ${state}`
          : `No mandi prices found for ${cropInput} in ${state}`
      });
    }

    const valid = records.filter((record) => Number(record.modal_price) > 0);

    // Sort newest-first by arrival_date
    const sorted = valid.slice().sort((a, b) => {
      return new Date(toIso(b.arrival_date)) - new Date(toIso(a.arrival_date));
    });

    // Current mandis = records from the most recent date
    const latestDate    = sorted[0]?.arrival_date || '';
    const currentMandis = latestDate
      ? sorted.filter(r => r.arrival_date === latestDate)
      : sorted.slice(0, 10);

    const mandis = currentMandis.map(r => ({
      mandi:            r.market   || r.district,
      state:            r.state,
      district:         r.district,
      price:            Number(r.modal_price) || 0,
      minPrice:         Number(r.min_price)   || 0,
      maxPrice:         Number(r.max_price)   || 0,
      changePct:        0,
      arrivalsQuintal:  0,
      source:           'Agmarknet (data.gov.in)',
      sourceDate:       latestDate
    }));

    // Build price trend: group all records by date, compute daily average
    const dateMap = {};
    for (const r of valid) {
      const key = r.arrival_date;
      if (!key) continue;
      if (!dateMap[key]) dateMap[key] = { prices: [], mins: [], maxs: [] };
      dateMap[key].prices.push(Number(r.modal_price) || 0);
      dateMap[key].mins.push(Number(r.min_price)     || 0);
      dateMap[key].maxs.push(Number(r.max_price)     || 0);
    }

    const trend = Object.entries(dateMap)
      .map(([dateStr, vals]) => ({
        date:     toIso(dateStr),
        price:    avg(vals.prices),
        minPrice: avg(vals.mins),
        maxPrice: avg(vals.maxs)
      }))
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .slice(-days);

    const averagePrice = avg(mandis.map(m => m.price));

    const responseData = {
      crop:          cropInput,
      state,
      district,
      coverage,
      coverageMessage,
      unit:          'quintal',
      lastUpdated:   toIso(latestDate) || new Date().toISOString(),
      mandis,
      trend,
      averagePrice:  averagePrice || null,
      confidence:    'high',
      timeRange,
      source:        'Agmarknet / data.gov.in'
    };

    marketPricesCache.set(cacheKey, {
      timestamp: Date.now(),
      data: responseData
    });

    return res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Market price fetch error:', error.response?.data || error.message);
    if (error.response?.data?.error === 'Rate limit exceeded' || error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Live mandi price service is rate-limited right now. Please try again shortly or configure a DATA_GOV_API_KEY.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch current mandi prices right now'
    });
  }
};

// @desc    Get only states that currently have mandi data for selected crop
// @route   GET /api/market-prices/available-locations
// @access  Private
exports.getAvailableMarketLocations = async (req, res) => {
  try {
    const cropInput = sanitizeCrop(req.query.crop);
    const state = String(req.query.state || '').trim();
    const apiKey = getDataGovApiKey();

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: 'DATA_GOV_API_KEY is not configured on server'
      });
    }

    if (!cropInput) {
      return res.status(400).json({
        success: false,
        message: 'crop is required'
      });
    }

    const cacheKey = `${cropInput.toLowerCase()}::${state.toLowerCase() || 'states'}`;
    const cached = availableLocationsCache.get(cacheKey);
    if (cached && (Date.now() - cached.timestamp) < AVAILABLE_LOCATIONS_CACHE_TTL_MS) {
      return res.json({ success: true, data: cached.data });
    }

    const cropVariants = getCropVariantsFromInput(cropInput);
    if (state) {
      const records = await fetchStateRecordsWithRetry(apiKey, cropVariants, state, 2);
      const districts = Array.from(
        new Set(
          records
            .map((record) => String(record.district || '').trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));

      const data = {
        crop: cropInput,
        state,
        districts
      };

      availableLocationsCache.set(cacheKey, {
        timestamp: Date.now(),
        data
      });

      return res.json({
        success: true,
        data
      });
    }

    let states = [];

    if (isUsingPublicDemoKey(apiKey)) {
      states = VERIFIED_FALLBACK_STATES_BY_CROP[cacheKey] || [];
    }

    if (!states.length) {
      states = await getAvailableStates(apiKey, cropVariants);
    }

    const data = {
      crop: cropInput,
      states
    };

    availableLocationsCache.set(cacheKey, {
      timestamp: Date.now(),
      data
    });

    return res.json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Available locations fetch error:', error.response?.data || error.message);
    if (error.response?.data?.error === 'Rate limit exceeded' || error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        message: 'Live mandi location service is rate-limited right now. Showing local location options may still work after retry.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Unable to fetch available mandi locations right now'
    });
  }
};
