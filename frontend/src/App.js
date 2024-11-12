// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  createTheme,
  ThemeProvider,
  CssBaseline,
  Container,
} from "@mui/material";
import StockChart from "./components/StockChart";
import StockIndicators from "./components/StockIndicators"; // New StockIndicators component
import Sidebar from "./components/Sidebar"; // Sidebar component for navigation
import PredictedStockPrices from "./components/PredictedStockPrices";
import MarketSentiment from "./components/MarketSentiment";
import Compare from "./components/Compare";
import Learn from "./components/Learn.js";
import StockComparison from "./components/StockComparison.js";

const darkTheme = createTheme({
  palette: {
    primary: {
      main: "#1976d2", // Main color for primary elements
    },
    secondary: {
      main: "#dc004e", // Main color for secondary elements
    },
    mode: "dark", // Enables dark mode
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Router>
        <div style={{ display: "flex", height: '100vh' }}>
          <Sidebar /> {/* Sidebar for navigation */}
          <Container style={{ marginLeft: "200px" }}>
            {" "}
            <Routes>
              <Route path="/" element={<StockChart />} />{" "}
              <Route path="/indicators" element={<StockIndicators />} />{" "}
              <Route
                path="/predictions"
                element={<PredictedStockPrices />}
              />{" "}
              <Route path="/compare-stocks" element={<StockComparison />} />{" "}
              <Route path="/compare-predictions" element={<Compare />} />{" "}
              <Route path="/sentiment" element={<MarketSentiment />} />{" "}
              <Route path="/learn" element={<Learn />} />{" "}
            </Routes>
          </Container>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
