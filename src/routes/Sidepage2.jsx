import ViewProfile from "../components/ViewProfile";
import React from "react";

import { Route, Routes } from "react-router-dom";
// Contributor Dashboard links
import Dashboard from "../components/Contributor/Dashboard";
import AddResources from "../components/Contributor/AddResources";
const Sidepage2 = () => {
  return (
    <Routes>

      <Route
        exact
        path="/"
        element={<Dashboard />}
      />
      <Route
        exact
        path="/addresources"
        element={<AddResources />}
      />
      <Route path="/myprofile" element={<ViewProfile />} />
    </Routes>
  );
};
export default Sidepage2;
