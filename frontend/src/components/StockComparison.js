import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from 'recharts';
import CustomTooltip from "./CustomTooltip";
import axios from 'axios';

// Colors array for different stocks
const lineColors = ['#ffffff', '#ffc333', '#3333ff', '#2aa34d', '#cc33ff', '#33cccc'];

// Define available periods
const periods = [
  { label: '1 Week', value: '1W' },
  { label: '1 Month', value: '1M' },
  { label: '1 Year', value: '1Y' },
  { label: '5 Years', value: '5Y' }
];

// Filter data based on the selected time period
const filterDataByPeriod = (data, period) => {
  const now = new Date("2024-09-18"); // Use the current date as a reference
  let filteredData = [];

  switch (period) {
    case '1W': // Last 1 week
      filteredData = data.filter(item => (now - new Date(item.timestamp)) <= 7 * 24 * 60 * 60 * 1000);
      break;
    case '1M': // Last 1 month
      filteredData = data.filter(item => (now - new Date(item.timestamp)) <= 30 * 24 * 60 * 60 * 1000);
      break;
    case '1Y': // Last 1 year
      filteredData = data.filter(item => (now - new Date(item.timestamp)) <= 365 * 24 * 60 * 60 * 1000);
      break;
    case '5Y': // Last 5 years
      filteredData = data.filter(item => (now - new Date(item.timestamp)) <= 5 * 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      filteredData = data; // Default to showing all data
      break;
  }

  return filteredData;
};

const StockComparison = () => {
  const [stockData, setStockData] = useState({});
  const [availableStocks, setAvailableStocks] = useState([]);
  const [addedStocks, setAddedStocks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStock, setSelectedStock] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('1W');

  // Fetch ticker names from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/tickers')
      .then(response => {
        setAvailableStocks(response.data);
        if (response.data.length > 0) {
          setSelectedStock(response.data[0]); // Set default ticker to the first one
        }
      })
      .catch(error => {
        console.error('Error fetching tickers', error);
      });
  }, []);

  // Fetch stock data from API for a specific stock
  const fetchStockData = (ticker) => {
    axios.get(`http://localhost:5000/api/stock-data/${ticker}`)
      .then(response => {
        const formattedData = response.data.map(item => ({
          timestamp: new Date(item.timestamp).toLocaleDateString('en-US'),
          open: item.open,
          close: item.close,
        })).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        setStockData(prevState => ({
          ...prevState,
          [ticker]: formattedData
        }));
      })
      .catch(error => {
        console.error('Error fetching stock data', error);
      });
  };

  // Handle adding stock from the modal
  const handleAddStock = () => {
    if (selectedStock) {
      setAddedStocks([...addedStocks, selectedStock]);
      fetchStockData(selectedStock); // Fetch full data for the stock
      setAvailableStocks(availableStocks.filter(stock => stock !== selectedStock));
      setIsModalOpen(false); // Close the modal after adding the stock
    }
  };

  // Handle clearing all added stocks
  const handleClearStocks = () => {
    setAddedStocks([]); // Clear the added stocks
  };

  // Get common timestamps and map stock data to these timestamps
  const getCombinedData = () => {
    const commonTimestamps = new Set();

    // Get filtered data for each stock
    const allFilteredData = {};
    addedStocks.forEach(stock => {
      const filteredData = filterDataByPeriod(stockData[stock] || [], selectedPeriod);
      allFilteredData[stock] = filteredData;

      // Collect unique timestamps
      filteredData.forEach(item => {
        commonTimestamps.add(item.timestamp);
      });
    });

    // Create combined data structure
    const combinedData = [];
    commonTimestamps.forEach(timestamp => {
      const combinedEntry = { timestamp };
      let hasNullValue = false; // Flag to check for null values

      addedStocks.forEach(stock => {
        const stockDataForTimestamp = allFilteredData[stock].find(item => item.timestamp === timestamp);
        const value = stockDataForTimestamp ? stockDataForTimestamp.close : null; // Handle missing data
        combinedEntry[stock] = value;

        // Check if value is null
        if (value === null) {
          hasNullValue = true;
        }
      });

      // Only add entry if there are no null values
      if (!hasNullValue) {
        combinedData.push(combinedEntry);
      }
    });

    return combinedData;
  };

  // Open the modal to select a stock
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Close the modal without adding a stock
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Handle selecting a stock from the dropdown in the modal
  const handleStockSelection = (e) => {
    setSelectedStock(e.target.value);
  };

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Stock comparison chart
  return (
    <div>
      <h2>Compare Stocks</h2>

      {/* Toggle buttons to select the period */}
      <div style={{ margin: '20px 0' }}>
        {periods.map(period => (
          <button
            key={period.value}
            onClick={() => handlePeriodChange(period.value)}
            style={{
              marginRight: '10px',
              padding: '10px 20px',
              backgroundColor: selectedPeriod === period.value ? '#ffc333' : '#161616',
              cursor: 'pointer',
            }}
          >
            {period.label}
          </button>
        ))}
      </div>

      {/* Buttons to add stocks and clear stocks */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={openModal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#161616',
            color: '#fff',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Add Stocks
        </button>

        <button
          onClick={handleClearStocks}
          disabled={addedStocks.length === 0} // Disable button if no stocks are added
          style={{
            padding: '10px 20px',
            backgroundColor: addedStocks.length > 0 ? '#333333' : '#999', // Change color based on state
            color: '#fff',
            border: 'none',
            cursor: addedStocks.length > 0 ? 'pointer' : 'not-allowed',
          }}
        >
          Clear Stocks
        </button>
      </div>

      {/* Modal for selecting stocks */}
      {isModalOpen && (
        <div style={modalStyles.overlay}>
          <div style={modalStyles.modal}>
            <h3>Select a stock to add</h3>
            <select
              value={selectedStock}
              onChange={handleStockSelection}
              style={{ padding: '10px', width: '100%', marginBottom: '20px' }}
            >
              <option value="">-- Select Stock --</option>
              {availableStocks.map(stock => (
                <option key={stock} value={stock}>{stock}</option>
              ))}
            </select>
            <div style={{ textAlign: 'right' }}>
              <button onClick={handleAddStock} style={{ ...modalStyles.button, backgroundColor: '#161616' }}>Add</button>
              <button onClick={closeModal} style={{ ...modalStyles.button, backgroundColor: '#333333' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Render chart */}
      {addedStocks.length > 0 && (
        <ResponsiveContainer width="100%" height={500}>
          <LineChart data={getCombinedData()}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {addedStocks.map((stock, index) => (
              <Line
                strokeWidth={3}
                key={stock}
                type="monotone"
                dataKey={stock}
                stroke={lineColors[index % lineColors.length]}                
                dot={false}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// Simple modal styles (can be customized)
const modalStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,  // Ensure overlay is on top of the page content
  },
  modal: {
    backgroundColor: '#1f1f1f',
    padding: '20px',
    borderRadius: '10px',
    width: '400px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.3)',
    zIndex: 1100,  // Ensure modal content is above the overlay
    position: 'relative', // Ensure proper positioning above the overlay
  },
  button: {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    marginLeft: '10px',
  }
};

export default StockComparison;
