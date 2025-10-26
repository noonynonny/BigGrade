import React from "react";
import { Navigate } from "react-router-dom";

// Marketplace is now called RequestHub - redirect for backwards compatibility
export default function Marketplace() {
  return <Navigate to="/request-hub" replace />;
}

