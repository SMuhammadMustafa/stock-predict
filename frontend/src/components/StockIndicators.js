import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from "./CustomTooltip";
import axios from 'axios';


const StockChart = () => {
  const [stockData, setStockData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState('AATM'); // Default ticker
  const [selectedIndicator, setSelectedIndicator] = useState('SMA'); // Default indicator
  const [windowSize, setWindowSize] = useState(14); // Default window size
  const [tickers, setTickers] = useState([]);
  const [indicators, setIndicators] = useState(['SMA', 'EMA', 'RSI']); // Available indicators

  // Fetch stock indicator data from the backend
  const fetchIndicatorData = (ticker, indicator, window) => {
    axios.get(`http://localhost:5000/api/stock-indicators/${ticker}/${indicator}/${window}`)
      .then(response => {
        const formattedData = response.data.map(item => ({
          timestamp: new Date(item.timestamp).toLocaleDateString('en-US'),
          value: item[indicator], // Dynamically set the indicator value
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setStockData(formattedData);
      })
      .catch(error => {
        console.error('Error fetching indicator data', error);
      });
  };

  useEffect(() => {
    // Fetch data for the default selected ticker, indicator, and window when the component mounts
    fetchIndicatorData(selectedTicker, selectedIndicator, windowSize);
  }, [selectedTicker, selectedIndicator, windowSize]);

  // Fetch ticker names from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/tickers')
      .then(response => {
        setTickers(response.data);
        if (response.data.length > 0) {
          setSelectedTicker(response.data[0]); // Set default ticker to the first one
        }
      })
      .catch(error => {
        console.error('Error fetching tickers', error);
      });
  }, []);

  // Handle ticker dropdown change
  const handleTickerChange = (e) => {
    setSelectedTicker(e.target.value);
  };

  // Handle indicator dropdown change
  const handleIndicatorChange = (e) => {
    setSelectedIndicator(e.target.value);
  };

  // Handle window size input change
  const handleWindowSizeChange = (e) => {
    setWindowSize(e.target.value);
  };

  return (
    <div>
      <h2>Stock Indicator for {selectedTicker}: {selectedIndicator} (Window: {windowSize})</h2>
      
      {/* Dropdown to select ticker */}
      <label htmlFor="tickerSelect">Select Ticker: </label>
      <select id="tickerSelect" value={selectedTicker} onChange={handleTickerChange}>
        {tickers.map(ticker => (
          <option key={ticker} value={ticker}>
            {ticker}
          </option>
        ))}
      </select>

      {/* Dropdown to select indicator */}
      <label htmlFor="indicatorSelect" style={{ marginLeft: '20px' }}>Select Indicator: </label>
      <select id="indicatorSelect" value={selectedIndicator} onChange={handleIndicatorChange}>
        {indicators.map(indicator => (
          <option key={indicator} value={indicator}>
            {indicator}
          </option>
        ))}
      </select>

      {/* Input to select custom window size */}
      <label htmlFor="windowSizeInput" style={{ marginLeft: '20px' }}>Window Size: </label>
      <input 
        id="windowSizeInput" 
        type="number" 
        min="1" 
        value={windowSize} 
        onChange={handleWindowSizeChange}
      />

      {/* Stock chart */}
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={stockData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#ffc333" strokeWidth={3} dot={false} activeDot={{ r: 8 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
