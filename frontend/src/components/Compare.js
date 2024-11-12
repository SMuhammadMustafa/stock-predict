import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import axios from "axios";

const Compare = () => {
  const [historicalData, setHistoricalData] = useState([]);
  const [predictedData, setPredictedData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState("AATM"); // Default ticker
  const [tickers, setTickers] = useState([
    /*'AAL', 'AASM', */ "AATM" /*, 'ABL', 'ABOT', 'ABSON'*/,
  ]); // Example tickers

  useEffect(() => {
    // Fetch historical price data for a specific ticker
    const fetchHistoricalData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/stock-data/AATM"
        ); // Example ticker
        const historicalPrices = response.data
          .map((item) => ({
            timestamp: new Date(item.timestamp).toLocaleDateString("en-US"),
            historicalPrice: item.close, // Assuming `close` is the historical price
          }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setHistoricalData(historicalPrices);
      } catch (error) {
        console.error("Error fetching historical data", error);
      }
    };

    // Simulated demo data for predicted stock prices
    const demoPredictedData = [
      { timestamp: "7/3/2024", predictedPrice: 32.82 },
      { timestamp: "7/4/2024", predictedPrice: 31.32 },
      { timestamp: "7/5/2024", predictedPrice: 35.05 },
      { timestamp: "7/8/2024", predictedPrice: 38.19 },
      { timestamp: "7/9/2024", predictedPrice: 40.63 },
      { timestamp: "7/10/2024", predictedPrice: 43.39 },
      { timestamp: "7/11/2024", predictedPrice: 44.84 },
      { timestamp: "7/12/2024", predictedPrice: 43.0 },
      { timestamp: "7/15/2024", predictedPrice: 39.92 },
      { timestamp: "7/18/2024", predictedPrice: 35.22 },
      { timestamp: "7/19/2024", predictedPrice: 33.41 },
      { timestamp: "7/22/2024", predictedPrice: 30.17 },
      { timestamp: "7/23/2024", predictedPrice: 26.25 },
      { timestamp: "7/24/2024", predictedPrice: 22.74 },
      { timestamp: "7/25/2024", predictedPrice: 21.54 },
      { timestamp: "7/26/2024", predictedPrice: 23.44 },
      { timestamp: "7/29/2024", predictedPrice: 26.78 },
      { timestamp: "7/30/2024", predictedPrice: 28.36 },
      { timestamp: "7/31/2024", predictedPrice: 32.2 },
      { timestamp: "8/1/2024", predictedPrice: 35.32 },
      { timestamp: "8/2/2024", predictedPrice: 34.75 },
      { timestamp: "8/5/2024", predictedPrice: 42.53 },
      { timestamp: "8/6/2024", predictedPrice: 45.68 },
      { timestamp: "8/7/2024", predictedPrice: 52.25 },
      { timestamp: "8/8/2024", predictedPrice: 46.23 },
      { timestamp: "8/9/2024", predictedPrice: 48.75 },
      { timestamp: "8/12/2024", predictedPrice: 55.73 },
      { timestamp: "8/13/2024", predictedPrice: 61.2 },
      { timestamp: "8/15/2024", predictedPrice: 66.22 },
      { timestamp: "8/16/2024", predictedPrice: 74.2 },
      { timestamp: "8/19/2024", predictedPrice: 76.48 },
      { timestamp: "8/20/2024", predictedPrice: 76.7 },
      { timestamp: "8/21/2024", predictedPrice: 88.37 },
      { timestamp: "8/22/2024", predictedPrice: 98.81 },
      { timestamp: "8/23/2024", predictedPrice: 110.09 },
      { timestamp: "8/26/2024", predictedPrice: 97.88 },
      { timestamp: "8/27/2024", predictedPrice: 83.69 },
      { timestamp: "8/28/2024", predictedPrice: 79.51 },
      { timestamp: "8/29/2024", predictedPrice: 72.02 },
      { timestamp: "8/30/2024", predictedPrice: 72.53 },
      { timestamp: "9/2/2024", predictedPrice: 70.82 },
      { timestamp: "9/3/2024", predictedPrice: 65.66 },
      { timestamp: "9/4/2024", predictedPrice: 75.45 },
      { timestamp: "9/5/2024", predictedPrice: 82.64 },
      { timestamp: "9/6/2024", predictedPrice: 78.67 },
      { timestamp: "9/9/2024", predictedPrice: 88.34 },
      { timestamp: "9/10/2024", predictedPrice: 70.54 },
      { timestamp: "9/11/2024", predictedPrice: 70.66 },
      { timestamp: "9/12/2024", predictedPrice: 76.66 },
      { timestamp: "9/13/2024", predictedPrice: 78.16 },
      { timestamp: "9/16/2024", predictedPrice: 72.65 },
      { timestamp: "9/18/2024", predictedPrice: 70.15 },
      { timestamp: "9/19/2024", predictedPrice: 74 },
      { timestamp: "9/20/2024", predictedPrice: 75 },
      { timestamp: "9/21/2024", predictedPrice: 82.15 },
      { timestamp: "9/22/2024", predictedPrice: 78.65 },
      { timestamp: "9/23/2024", predictedPrice: 82.12 },
    ];

    setPredictedData(demoPredictedData);
    fetchHistoricalData(); // Fetch historical data on component mount
  }, []);

  // Combine historical and predicted data into one array for charting
  const combinedData = historicalData
    .map((histItem) => {
      const predictedItem = predictedData.find(
        (predItem) => predItem.timestamp === histItem.timestamp
      );
      return {
        timestamp: histItem.timestamp,
        historicalPrice: histItem.historicalPrice,
        predictedPrice: predictedItem ? predictedItem.predictedPrice : null,
      };
    })
    .concat(
      predictedData.filter(
        (predItem) =>
          !historicalData.find(
            (histItem) => histItem.timestamp === predItem.timestamp
          )
      )
    );

  // Handle dropdown change
  const handleTickerChange = (e) => {
    setSelectedTicker(e.target.value);
  };

  return (
    <div>
      <h2>
        Comparison of Predicted and Historical Stock Prices for {selectedTicker}
      </h2>

      {/* Dropdown to select ticker */}
      <label htmlFor="tickerSelect">Select Ticker: </label>
      <select
        id="tickerSelect"
        value={selectedTicker}
        onChange={handleTickerChange}
      >
        {tickers.map((ticker) => (
          <option key={ticker} value={ticker}>
            {ticker}
          </option>
        ))}
      </select>

      {/* Stock predictions chart */}
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={combinedData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Legend />
          <Line type="monotone" dataKey="historicalPrice" stroke="#ffffff" name="Historical Price" strokeWidth={3} dot={false} activeDot={{ r: 8 }}/>
          <Line type="monotone" dataKey="predictedPrice" stroke="#ffc333" name="Predicted Price" strokeWidth={3} dot={false} activeDot={{ r: 8 }}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Compare;
