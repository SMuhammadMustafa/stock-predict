import React, { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

// Array of stock indicators
const indicators = [
  {
    name: "Simple Moving Average (SMA)",
    formula: "SMA = (P1 + P2 + ... + Pn) / n",
    description:
      "The Simple Moving Average (SMA) is the average of a set of prices over a specific number of periods. It smooths out price data to identify the trend direction. Traders use SMA to determine support and resistance levels.",
  },
  {
    name: "Exponential Moving Average (EMA)",
    formula: "EMA = (P today * (k)) + (EMA yesterday * (1 - k))",
    description:
      "The Exponential Moving Average (EMA) gives more weight to recent prices, making it more responsive to new information. It’s used to identify the trend direction and potential reversal points.",
  },
  {
    name: "Relative Strength Index (RSI)",
    formula: "RSI = 100 - (100 / (1 + RS))",
    description:
      "The Relative Strength Index (RSI) measures the speed and change of price movements. It ranges from 0 to 100 and is used to identify overbought or oversold conditions in a market.",
  },
  //   {
  //     name: "Moving Average Convergence Divergence (MACD)",
  //     formula: "MACD = 12-EMA - 26-EMA",
  //     description:
  //       "The MACD is a trend-following momentum indicator that shows the relationship between two moving averages of a security's price. It's used to identify potential buy or sell signals.",
  //   },
  //   {
  //     name: "Bollinger Bands",
  //     formula: "Upper Band = SMA + (2 * Standard Deviation); Lower Band = SMA - (2 * Standard Deviation)",
  //     description:
  //       "Bollinger Bands consist of a middle band (SMA) and two outer bands. The bands expand and contract based on market volatility. Traders use them to identify overbought or oversold conditions.",
  //   },
];

const Learn = () => {
  const [selectedIndicator, setSelectedIndicator] = useState(null);

  const handleIndicatorClick = (indicator) => {
    // If the indicator is already selected, deselect it
    if (selectedIndicator === indicator) {
      setSelectedIndicator(null);
    } else {
      setSelectedIndicator(indicator);
    }
  };

  return (
    <Box sx={{ padding: 2 }}>
      <h2> Learn About Stock Indicators </h2>

      <List>
        {indicators.map((indicator, index) => (
          <ListItem
            button
            key={index}
            onClick={() => handleIndicatorClick(indicator)}
            sx={{ cursor: "pointer" }} // Change the cursor to a pointer on hover
          >
            <ListItemText primary={indicator.name} />
          </ListItem>
        ))}
      </List>

      {selectedIndicator && (
        <Paper elevation={3} sx={{ padding: 2, marginTop: 2 }}>
          <Typography variant="h5">{selectedIndicator.name}</Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Formula: {selectedIndicator.formula}
          </Typography>
          <Typography variant="body2">
            {selectedIndicator.description}
          </Typography>
        </Paper>
      )}
    </Box>
  );
};

export default Learn;
