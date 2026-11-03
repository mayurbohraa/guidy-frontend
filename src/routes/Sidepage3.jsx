import Users from "../components/Admin/Users";
import AccountRecovery from "../components/Admin/AccountRecovery";
import CourseDetails from "../components/CourseDetails";
import ViewProfile from "../components/ViewProfile";
import React from "react";

import { Route, Routes } from "react-router-dom";
// Admin Dashboard links
import Dashboard from "../components/Admin/Dashboard";
import Requests from "../components/Admin/Requests";
import Calender from "../components/User/Calender";
import MyTasks from "../components/User/MyTasks";
const Sidepage3 = () => {
  return (
    <Routes>
      <Route exact path="/" element={<Dashboard />} />
      <Route exact path="/calender" element={<Calender />} />
      <Route exact path="/mytasks" element={<MyTasks />} />
      <Route exact path="/requests" element={<Requests />} />
      <Route path="/courses/:courseId" element={<CourseDetails />} />
      <Route path="/users" element={<Users />} />
      <Route path="/account-recovery" element={<AccountRecovery />} />
      <Route path="/myprofile" element={<ViewProfile />} />
    </Routes>
  );
};
export default Sidepage3;
