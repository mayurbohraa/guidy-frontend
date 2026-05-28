import React from "react";
import { Route, Routes } from "react-router-dom";
// Contributor Dashboard links
import Dashboard from "../components/Contributor/Dashboard";
import AddResources from "../components/Contributor/AddResources";

const Sidepage2 = () => {
  return (
    <Routes>
      {/* Contributor Dashboard links */}
      <Route exact path="/" element={<Dashboard />} />
      <Route exact path="/addresources" element={<AddResources />} />
    </Routes>
  );
};

export default Sidepage2;
