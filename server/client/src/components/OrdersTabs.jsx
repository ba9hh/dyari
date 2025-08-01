import React from "react";
import { Tabs, Tab, Box } from "@mui/material";

export default function OrdersTabs({ selectedFilter, setSelectedFilter, t }) {
  const handleChange = (event, newValue) => {
    setSelectedFilter(newValue);
  };

  return (
    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Tabs
        value={selectedFilter}
        onChange={handleChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ mb: 2, px: 2 }}
      >
        <Tab
          label={t("order.allOrders")}
          value="all"
          sx={{ textTransform: "none" }}
        />
        <Tab
          label={t("order.pendingOrders")}
          value="pending"
          sx={{ textTransform: "none" }}
        />
        <Tab
          label="Accepted Orders"
          value="accepted"
          sx={{ textTransform: "none" }}
        />
        <Tab
          label="Rejected Orders"
          value="rejected"
          sx={{ textTransform: "none" }}
        />
      </Tabs>
    </Box>
  );
}
