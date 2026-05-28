import React from "react";
import { Route, Routes } from "react-router-dom";
// Admin Dashboard links
import Dashboard from "../components/Admin/Dashboard";
import Requests from "../components/Admin/Requests";
import Calender from  "../components/User/Calender";
import MyTasks from "../components/User/MyTasks";


const Sidepage3 = () => {
  return (
    <Routes>
      {/* admin Dashboard links */}
      <Route exact path="/" element={<Dashboard />} />
      <Route exact path="/calender" element={<Calender />} />
      <Route exact path="/mytasks" element={<MyTasks />} />
      <Route exact path="/requests" element={<Requests/>} />
    </Routes>
  );
};

export default Sidepage3;
