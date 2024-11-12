// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { List, ListItem, ListItemText, Drawer } from "@mui/material";

const Sidebar = () => {
  const location = useLocation(); // Get current location

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 200,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 200,
          boxSizing: "border-box",
          border: "1px solid #161616", // Border added here
          borderRadius: "10px", // Optional: Rounded corners
          backgroundColor: "#1f1f1f", // Optional: Background color
          boxShadow: "0px 10px 10px rgba(0, 0, 0, 0.8)", // Add box shadow
        },
      }}
    >
      <List className="sidebar">
        {[
          { text: "Stock Chart", path: "/" },
          { text: "Stock Indicators", path: "/indicators" },
          { text: "Stock Predictions", path: "/predictions" },
          { text: "Compare Stocks", path: "/compare-stocks" },
          { text: "Compare Predictions", path: "/compare-predictions" },
          { text: "Market Sentiment", path: "/sentiment" },
          { text: "Learn", path: "/learn" },
        ].map((item) => (
          <ListItem
            button
            component={Link}
            to={item.path}
            key={item.text}
            sx={{
              color: location.pathname === item.path ? "inherit" : "white", // Change this to your desired default color
              backgroundColor: location.pathname === item.path ? "transparent" : "inherit",
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)', // Optional: Add hover effect
              },
            }}
          >
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
