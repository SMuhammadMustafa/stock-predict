import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from "./CustomTooltip";
import axios from 'axios';

const PredictedStockPrices = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState('AATM'); // Default ticker
  const [tickers, setTickers] = useState([/*'AAL', 'AASM', */'AATM'/*, 'ABL', 'ABOT', 'ABSON'*/]); // Example tickers

  useEffect(() => {
    // Fetch historical price data for a specific ticker
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stock-data/AATM'); // Example ticker
        const historicalPrices = response.data.map(item => ({
          timestamp: new Date(item.timestamp).toLocaleDateString('en-US'),
          historicalPrice: item.close, // Assuming `close` is the historical price
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setHistoricalData(historicalPrices);
      } catch (error) {
        console.error('Error fetching historical data', error);
      }
    };

    // Simulated demo data for predicted stock prices
    const demoPredictedData = [
      { timestamp: '9/18/2024', predictedPrice: 71.15 },
      { timestamp: '9/19/2024', predictedPrice: 73 },
      { timestamp: '9/20/2024', predictedPrice: 75 },
      { timestamp: '9/21/2024', predictedPrice: 82.15 },
      { timestamp: '9/22/2024', predictedPrice: 78.65 },
      { timestamp: '9/23/2024', predictedPrice: 82.12 },
    ];

    setPredictedData(demoPredictedData);
    fetchHistoricalData(); // Fetch historical data on component mount
  }, []);

  // Combine historical and predicted data into one array for charting
  const combinedData = historicalData.map(histItem => {
    const predictedItem = predictedData.find(predItem => predItem.timestamp === histItem.timestamp);
    return {
      timestamp: histItem.timestamp,
      historicalPrice: histItem.historicalPrice,
      predictedPrice: predictedItem ? predictedItem.predictedPrice : null,
    };
  }).concat(predictedData.filter(predItem => !historicalData.find(histItem => histItem.timestamp === predItem.timestamp)));

  // Handle dropdown change
  const handleTickerChange = (e) => {
    setSelectedTicker(e.target.value);
  };

  return (
    <div>
      <h2>Predicted Stock Prices for {selectedTicker}</h2>

      {/* Dropdown to select ticker */}
      <label htmlFor="tickerSelect">Select Ticker: </label>
      <select id="tickerSelect" value={selectedTicker} onChange={handleTickerChange}>
        {tickers.map(ticker => (
          <option key={ticker} value={ticker}>
            {ticker}
          </option>
        ))}
      </select>

      {/* Stock predictions chart */}
      <ResponsiveContainer width="100%" height={500}>
        <LineChart data={combinedData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Legend />
          <Line type="monotone" dataKey="historicalPrice" stroke="#ffffff" name="Historical Price" dot={false} strokeWidth={3} activeDot={{ r: 8 }}/>
          <Line type="monotone" dataKey="predictedPrice" stroke="#ffc333" name="Predicted Price" dot={false} strokeWidth={3} activeDot={{ r: 8 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PredictedStockPrices;
