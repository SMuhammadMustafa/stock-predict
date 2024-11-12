import React, { useEffect, useState } from "react";
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
import { backdropClasses } from "@mui/material";

const StockChart = () => {
  const [stockData, setStockData] = useState([]);
  const [selectedTicker, setSelectedTicker] = useState(""); // Initially no ticker selected
  const [tickers, setTickers] = useState([]); // To hold ticker names
  const [selectedPeriod, setSelectedPeriod] = useState("1W"); // Default period

  // Fetch ticker names from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tickers")
      .then((response) => {
        setTickers(response.data);
        if (response.data.length > 0) {
          setSelectedTicker(response.data[0]); // Set default ticker to the first one
        }
      })
      .catch((error) => {
        console.error("Error fetching tickers", error);
      });
  }, []);

  // Fetch stock data from API based on selected ticker
  const fetchStockData = (ticker) => {
    axios
      .get(`http://localhost:5000/api/stock-data/${ticker}`)
      .then((response) => {
        const formattedData = response.data
          .map((item) => ({
            timestamp: new Date(item.timestamp),
            open: item.open,
            close: item.close,
          }))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setStockData(formattedData);
      })
      .catch((error) => {
        console.error("Error fetching stock data", error);
      });
  };

  useEffect(() => {
    if (selectedTicker) {
      // Fetch data for the selected ticker when it changes
      fetchStockData(selectedTicker);
    }
  }, [selectedTicker]);

  // Filter the data based on the selected time period
  const filterDataByPeriod = (data, period) => {
    const now = new Date("2024-09-18");
    let filteredData = [];

    switch (period) {
      case "1W":
        filteredData = data.filter(
          (item) => now - item.timestamp <= 7 * 24 * 60 * 60 * 1000
        );
        break;
      case "1M":
        filteredData = data.filter(
          (item) => now - item.timestamp <= 30 * 24 * 60 * 60 * 1000
        );
        break;
      case "1Y":
        filteredData = data.filter(
          (item) => now - item.timestamp <= 365 * 24 * 60 * 60 * 1000
        );
        break;
      case "5Y":
        filteredData = data.filter(
          (item) => now - item.timestamp <= 5 * 365 * 24 * 60 * 60 * 1000
        );
        break;
      default:
        filteredData = data; // Default to showing all data
        break;
    }

    return filteredData.map((item) => ({
      ...item,
      timestamp: item.timestamp.toLocaleDateString("en-US"),
    }));
  };

  // Handle ticker change
  const handleTickerChange = (e) => {
    setSelectedTicker(e.target.value);
  };

  // Handle time period toggle button click
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Filter the stock data before displaying it based on the selected time period
  const filteredStockData = filterDataByPeriod(stockData, selectedPeriod);

  return (
    <div>
      <h2>Stock Data for {selectedTicker}</h2>

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

      {/* Time period toggle buttons */}
      <div style={{ margin: "20px 0" }}>
        <button
          onClick={() => handlePeriodChange("1W")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: selectedPeriod === "1W" ? "#ffc333" : "#161616",
          }}
        >
          1 Week
        </button>
        <button
          onClick={() => handlePeriodChange("1M")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: selectedPeriod === "1M" ? "#ffc333" : "#161616",
          }}
        >
          1 Month
        </button>
        <button
          onClick={() => handlePeriodChange("1Y")}
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            backgroundColor: selectedPeriod === "1Y" ? "#ffc333" : "#161616",
          }}
        >
          1 Year
        </button>
        <button
          onClick={() => handlePeriodChange("5Y")}
          style={{
            padding: "10px 20px",
            backgroundColor: selectedPeriod === "5Y" ? "#ffc333" : "#161616",
          }}
        >
          5 Years
        </button>
      </div>

      {/* Stock chart */}
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={filteredStockData}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="timestamp" />
          <YAxis />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: "transparent" }} />
          <Legend />
          <Line
            type="monotone"
            dataKey="open"
            stroke="#ffffff"
            strokeWidth={3}
            dot={false}
            activeDot={{ r:8 }}
          />
          <Line
            type="monotone"
            dataKey="close"
            stroke="#ffc333"
            strokeWidth={3}
            dot={false}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default StockChart;
