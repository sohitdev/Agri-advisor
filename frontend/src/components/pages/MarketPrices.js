import React, { useState, useEffect, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useAuth } from '../../context/AuthContext';
import indiaStatesDistricts from '../../data/indiaStatesDistricts.json';
import api from '../../utils/api';
import './MarketPrices.css';

const crops = [
  { id: 'rice', name: 'Rice', icon: 'RI', unit: 'quintal' },
  { id: 'wheat', name: 'Wheat', icon: 'WH', unit: 'quintal' },
  { id: 'cotton', name: 'Cotton', icon: 'CT', unit: 'quintal' },
  { id: 'sugarcane', name: 'Sugarcane', icon: 'SC', unit: 'quintal' },
  { id: 'soybean', name: 'Soybean', icon: 'SB', unit: 'quintal' },
  { id: 'groundnut', name: 'Groundnut', icon: 'GN', unit: 'quintal' },
  { id: 'potato', name: 'Potato', icon: 'PO', unit: 'quintal' },
  { id: 'onion', name: 'Onion', icon: 'ON', unit: 'quintal' },
  { id: 'tomato', name: 'Tomato', icon: 'TM', unit: 'quintal' },
  { id: 'maize', name: 'Maize', icon: 'MZ', unit: 'quintal' }
];

const mspPrices = {
  rice: 2203,
  wheat: 2275,
  cotton: 6620,
  sugarcane: 315,
  soybean: 4600,
  groundnut: 6377,
  maize: 2090
};

const timeRanges = [
  { id: '1week', label: '1W' },
  { id: '1month', label: '1M' },
  { id: '3month', label: '3M' },
  { id: '6month', label: '6M' }
];

const findExactMatch = (options, value) => {
  const normalized = String(value || '').trim().toLowerCase();
  if (!normalized) return '';
  return options.find((option) => option.toLowerCase() === normalized) || '';
};

const formatPrice = (value) => {
  if (!Number.isFinite(Number(value))) return 'N/A';
  return `Rs. ${Number(value).toLocaleString('en-IN')}`;
};

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || '';
  return date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
};

const MarketPrices = () => {
  const { user } = useAuth();
  const [selectedCrop, setSelectedCrop] = useState('rice');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [timeRange, setTimeRange] = useState('1month');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const [confidence, setConfidence] = useState('');
  const [coverageMessage, setCoverageMessage] = useState('');
  const [statesLoading, setStatesLoading] = useState(false);
  const [districtsLoading, setDistrictsLoading] = useState(false);
  const [availableStates, setAvailableStates] = useState([]);
  const [availableDistricts, setAvailableDistricts] = useState([]);
  const [priceData, setPriceData] = useState([]);
  const [mandiPrices, setMandiPrices] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(null);

  const selectedCropData = crops.find((crop) => crop.id === selectedCrop);

  const stateOptions = useMemo(
    () => availableStates.slice().sort((a, b) => a.localeCompare(b)),
    [availableStates]
  );

  const districtOptions = useMemo(() => {
    const localDistricts = indiaStatesDistricts[selectedState] || [];
    const preferredDistricts = availableDistricts.length ? availableDistricts : localDistricts;
    return preferredDistricts.slice().sort((a, b) => a.localeCompare(b));
  }, [availableDistricts, selectedState]);

  useEffect(() => {
    let isMounted = true;

    const fetchAvailableStates = async () => {
      setStatesLoading(true);
      setError('');

      try {
        const response = await api.get('/market-prices/available-locations', {
          params: { crop: selectedCrop }
        });

        if (!isMounted) return;

        const states = Array.isArray(response.data?.data?.states) ? response.data.data.states : [];
        setAvailableStates(states);

        setSelectedState((prevState) => {
          if (prevState && states.includes(prevState)) return prevState;
          const userState = findExactMatch(states, user?.state);
          return userState || states[0] || '';
        });
      } catch (err) {
        if (!isMounted) return;
        const fallbackStates = Object.keys(indiaStatesDistricts);
        setAvailableStates(fallbackStates);
        setSelectedState((prevState) => {
          if (prevState && fallbackStates.includes(prevState)) return prevState;
          const userState = findExactMatch(fallbackStates, user?.state);
          return userState || fallbackStates[0] || '';
        });
        setSelectedDistrict('');
        setError(err.response?.data?.message || 'Unable to load live mandi states. You can still choose a local state and retry prices.');
      } finally {
        if (isMounted) setStatesLoading(false);
      }
    };

    fetchAvailableStates();

    return () => {
      isMounted = false;
    };
  }, [selectedCrop, user?.state]);

  useEffect(() => {
    if (!selectedState) {
      setAvailableDistricts([]);
      setSelectedDistrict('');
      return;
    }

    let isMounted = true;

    const fetchAvailableDistricts = async () => {
      setDistrictsLoading(true);

      try {
        const response = await api.get('/market-prices/available-locations', {
          params: {
            crop: selectedCrop,
            state: selectedState
          }
        });

        if (!isMounted) return;

        const districts = Array.isArray(response.data?.data?.districts)
          ? response.data.data.districts
          : [];

        setAvailableDistricts(districts);
        setSelectedDistrict((prevDistrict) => {
          if (prevDistrict && districts.includes(prevDistrict)) return prevDistrict;
          const userDistrict = findExactMatch(districts, user?.district);
          return userDistrict || '';
        });
      } catch (_) {
        if (!isMounted) return;
        setAvailableDistricts([]);
        setSelectedDistrict('');
      } finally {
        if (isMounted) setDistrictsLoading(false);
      }
    };

    fetchAvailableDistricts();

    return () => {
      isMounted = false;
    };
  }, [selectedCrop, selectedState, user?.district]);

  useEffect(() => {
    if (statesLoading || districtsLoading) return;

    if (!selectedState) {
      setPriceData([]);
      setMandiPrices([]);
      setCurrentPrice(null);
      setLastUpdated('');
      setConfidence('');
      setCoverageMessage('');
      setError(availableStates.length ? 'Select a state to load mandi prices.' : 'No mandi states are available for this crop right now.');
      return;
    }

    let isMounted = true;

    const fetchMarketPrices = async () => {
      setLoading(true);
      setError('');

      try {
        const cropName = selectedCropData?.name || selectedCrop;
        const response = await api.get('/market-prices', {
          params: {
            crop: cropName,
            state: selectedState,
            district: selectedDistrict || undefined,
            timeRange
          }
        });

        if (!isMounted) return;

        const payload = response.data?.data || {};
        const trend = Array.isArray(payload.trend) ? payload.trend : [];
        const mandis = Array.isArray(payload.mandis) ? payload.mandis : [];

        const mappedTrend = trend.map((point) => ({
          date: formatDate(point.date),
          price: Number(point.price) || 0,
          minPrice: Number(point.minPrice) || Number(point.price) || 0,
          maxPrice: Number(point.maxPrice) || Number(point.price) || 0
        }));

        const mappedMandis = mandis.map((item) => ({
          name: item.mandi,
          location: `${item.district}, ${item.state}`,
          price: Number(item.price) || 0,
          change: Number(item.changePct) || 0,
          arrivals: Number(item.arrivalsQuintal) || 0,
          source: item.source || 'N/A',
          sourceDate: item.sourceDate || ''
        }));

        setPriceData(mappedTrend);
        setMandiPrices(mappedMandis);
        setCurrentPrice(
          mappedTrend[mappedTrend.length - 1] ||
          (payload.averagePrice
            ? {
                price: Number(payload.averagePrice),
                minPrice: Number(payload.averagePrice),
                maxPrice: Number(payload.averagePrice)
              }
            : null)
        );
        setLastUpdated(payload.lastUpdated || '');
        setConfidence(payload.confidence || '');
        setCoverageMessage(payload.coverageMessage || '');
      } catch (err) {
        if (!isMounted) return;
        setPriceData([]);
        setMandiPrices([]);
        setCurrentPrice(null);
        setLastUpdated('');
        setConfidence('');
        setCoverageMessage('');
        setError(err.response?.data?.message || 'Failed to fetch current mandi prices.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMarketPrices();

    return () => {
      isMounted = false;
    };
  }, [
    selectedCrop,
    selectedState,
    selectedDistrict,
    timeRange,
    statesLoading,
    districtsLoading,
    availableStates.length,
    selectedCropData?.name
  ]);

  const priceChange = priceData.length > 1 && priceData[0].price
    ? (((priceData[priceData.length - 1].price - priceData[0].price) / priceData[0].price) * 100).toFixed(2)
    : '0.00';

  const rangeMin = priceData.length ? Math.min(...priceData.map((d) => d.minPrice)) : currentPrice?.minPrice || 0;
  const rangeMax = priceData.length ? Math.max(...priceData.map((d) => d.maxPrice)) : currentPrice?.maxPrice || 0;
  const marketScope = selectedDistrict || selectedState || 'the selected market';

  return (
    <div className="market-prices-container">
      <div className="market-header">
        <h1>Market Prices</h1>
        <p>Live Agmarknet mandi prices by crop, state, and district</p>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Select Crop</label>
          <div className="crop-selector">
            {crops.map((crop) => (
              <button
                key={crop.id}
                className={`crop-btn ${selectedCrop === crop.id ? 'active' : ''}`}
                onClick={() => setSelectedCrop(crop.id)}
              >
                <span className="crop-icon">{crop.icon}</span>
                <span className="crop-name">{crop.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-row">
          <div className="filter-item">
            <label>State</label>
            <select
              value={selectedState}
              onChange={(event) => setSelectedState(event.target.value)}
              disabled={statesLoading || !stateOptions.length}
            >
              <option value="">{statesLoading ? 'Loading states...' : 'Select state'}</option>
              {stateOptions.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>District</label>
            <select
              value={selectedDistrict}
              onChange={(event) => setSelectedDistrict(event.target.value)}
              disabled={districtsLoading || !selectedState}
            >
              <option value="">{districtsLoading ? 'Loading districts...' : 'All districts in state'}</option>
              {districtOptions.map((district) => (
                <option key={district} value={district}>{district}</option>
              ))}
            </select>
          </div>

          <div className="filter-item">
            <label>Time Range</label>
            <div className="time-buttons">
              {timeRanges.map((range) => (
                <button
                  key={range.id}
                  className={timeRange === range.id ? 'active' : ''}
                  onClick={() => setTimeRange(range.id)}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading latest mandi prices...</p>
        </div>
      ) : (
        <>
          {error && <div className="market-error">{error}</div>}

          <div className="price-overview">
            <div className="price-card current">
              <span className="card-label">Current Price</span>
              <span className="card-value">{formatPrice(currentPrice?.price)}</span>
              <span className="card-unit">per {selectedCropData?.unit}</span>
            </div>

            <div className={`price-card change ${parseFloat(priceChange) >= 0 ? 'positive' : 'negative'}`}>
              <span className="card-label">Price Change</span>
              <span className="card-value">{parseFloat(priceChange) >= 0 ? '+' : ''}{priceChange}%</span>
              <span className="card-unit">in selected period</span>
            </div>

            <div className="price-card range">
              <span className="card-label">Price Range</span>
              <span className="card-value">{formatPrice(rangeMin)} - {formatPrice(rangeMax)}</span>
              <span className="card-unit">min - max</span>
            </div>

            {mspPrices[selectedCrop] && (
              <div className="price-card msp">
                <span className="card-label">MSP (2024-25)</span>
                <span className="card-value">{formatPrice(mspPrices[selectedCrop])}</span>
                <span className="card-unit">Minimum Support Price</span>
              </div>
            )}
          </div>

          <div className="chart-section">
            <h3>Price Trend - {selectedCropData?.name}</h3>
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={priceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={['auto', 'auto']} tickFormatter={(value) => `Rs. ${value}`} />
                <Tooltip
                  formatter={(value) => [formatPrice(value), '']}
                  labelStyle={{ color: '#333' }}
                />
                <Legend />
                <Line type="monotone" dataKey="price" name="Market Price" stroke="#4CAF50" strokeWidth={3} dot={false} />
                <Line type="monotone" dataKey="minPrice" name="Min Price" stroke="#2196F3" strokeWidth={1} strokeDasharray="5 5" dot={false} />
                <Line type="monotone" dataKey="maxPrice" name="Max Price" stroke="#f44336" strokeWidth={1} strokeDasharray="5 5" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mandi-section">
            <h3>Mandi-wise Prices</h3>
            {(coverageMessage || lastUpdated || confidence) && (
              <p className="market-meta">
                {coverageMessage ? `${coverageMessage} ` : ''}
                {lastUpdated ? `Last update: ${new Date(lastUpdated).toLocaleString('en-IN')}` : ''}
                {lastUpdated && confidence ? ' | ' : ''}
                {confidence ? `Confidence: ${confidence}` : ''}
              </p>
            )}
            <div className="mandi-table-wrapper">
              <table className="mandi-table">
                <thead>
                  <tr>
                    <th>Mandi</th>
                    <th>Location</th>
                    <th>Price (Rs./{selectedCropData?.unit})</th>
                    <th>Change</th>
                    <th>Arrivals (Quintals)</th>
                    <th>Source</th>
                  </tr>
                </thead>
                <tbody>
                  {mandiPrices.map((mandi, index) => (
                    <tr key={`${mandi.name}-${index}`}>
                      <td className="mandi-name">{mandi.name}</td>
                      <td>{mandi.location}</td>
                      <td className="price-cell">{formatPrice(mandi.price)}</td>
                      <td className={`change-cell ${mandi.change >= 0 ? 'positive' : 'negative'}`}>
                        {mandi.change >= 0 ? '+' : ''}{mandi.change.toFixed(2)}%
                      </td>
                      <td>{mandi.arrivals.toLocaleString('en-IN')}</td>
                      <td>{mandi.sourceDate ? `${mandi.source} (${new Date(mandi.sourceDate).toLocaleDateString('en-IN')})` : mandi.source}</td>
                    </tr>
                  ))}
                  {!mandiPrices.length && (
                    <tr>
                      <td colSpan="6">No mandi records available for this selection.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="insights-section">
            <h3>Market Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <h4>Current Trend</h4>
                <p>
                  {parseFloat(priceChange) < 0
                    ? `${selectedCropData?.name} prices are trending downward in ${marketScope}.`
                    : `${selectedCropData?.name} prices are trending upward in ${marketScope}.`}
                </p>
              </div>
              <div className="insight-card">
                <h4>Storage Advice</h4>
                <p>
                  {parseFloat(priceChange) < 0
                    ? 'Prices are declining. Consider selling soon unless storage quality is strong.'
                    : 'Prices are rising. Holding stock may help if storage and cash flow allow it.'}
                </p>
              </div>
              <div className="insight-card">
                <h4>{selectedDistrict ? 'District Mandi Focus' : 'State Mandi Focus'}</h4>
                <p>{coverageMessage || `Compare active mandis in ${marketScope} using reported Agmarknet prices.`}</p>
              </div>
              <div className="insight-card">
                <h4>Price Alert</h4>
                <p>Use this price as a reference before calling the mandi or trader; arrivals and grade can change the final quote.</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MarketPrices;
