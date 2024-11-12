import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";

const MarketSentiment = () => {
  const [sentimentValue, setSentimentValue] = useState(0);
  const [selectedTicker, setSelectedTicker] = useState("AATM"); // Default ticker

  // Example tickers using an object for easier value retrieval
  const tickers = {
    AAL: 25,
    AASM: 35,
    AATM: 75,
    ABL: 20,
    ABOT: 55,
    ABSON: 95,
  };

  // Set the initial sentiment value based on the default ticker
  useEffect(() => {
    setSentimentValue(tickers[selectedTicker]);
  }, [selectedTicker, tickers]);

  // Function to get the color based on sentiment
  const getColor = (value) => {
    if (value <= 30) return "#ff4d4d"; // Red for bad sentiment
    if (value <= 70) return "#ffcc00"; // Yellow for neutral sentiment
    return "#33cc33"; // Green for good sentiment
  };

  // Handle dropdown change
  const handleTickerChange = (e) => {
    const ticker = e.target.value; // Get the selected ticker
    setSelectedTicker(ticker);
    setSentimentValue(tickers[ticker]); // Update sentiment based on the selected ticker
  };

  return (
    <div>
      <h2>Market Sentiment for {selectedTicker}</h2>
      {/* Dropdown to select ticker */}
      <label htmlFor="tickerSelect">Select Ticker: </label>
      <select
        id="tickerSelect"
        value={selectedTicker}
        onChange={handleTickerChange}
      >
        {Object.keys(tickers).map((ticker) => (
          <option key={ticker} value={ticker}>
            {ticker}
          </option>
        ))}
      </select>

      {/* Add the image above the box */}
      <Box sx={{ textAlign: "center", marginBottom: "0px", marginTop: "150px" }}>
        <img
          src="/SentimentBar.png"
          alt="Market Sentiment Bar" // Provide an alt text for accessibility
          style={{ width: "100%", height: "auto" }} // Responsive styling
        />
      </Box>

      <Box sx={{ width: "88%", textAlign: "center", marginLeft: "65px" }}>
        {/* <Typography variant="h6">Market Sentiment</Typography> */}
        <Box
          sx={{
            width: "100%",
            height: "5px",
            backgroundColor: "#e0e0e0", // Light gray background
            borderRadius: "5px",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <Box
            sx={{
              width: `${sentimentValue}%`, // Set width according to sentiment value
              height: "100%",
              backgroundColor: getColor(sentimentValue),
              transition: "width 0.5s ease", // Smooth transition
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              top: "50%",
              transform: "translate(-50%, -50%)",
              color: "#000",
              fontWeight: "bold",
            }}
          >
          </Box>
        </Box>
      </Box>
    </div>
  );
};

export default MarketSentiment;
