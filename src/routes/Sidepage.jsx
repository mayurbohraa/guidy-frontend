import ViewProfile from "../components/ViewProfile";
import React from "react";

import { Route, Routes } from "react-router-dom";

// User Dashboard links

import Dashboard from "../components/User/Dashboard";
import MySchedule from "../components/User/MySchedule";
import Calender from "../components/User/Calender";
import MyRoadmap from "../components/User/MyRoadmap";
import MyTasks from "../components/User/MyTasks";
import MyGrades from "../components/User/MyGrades";
import Resources from "../components/User/Resources";
import Notebook from "../components/User/Notebook";
import Grades from '../components/pages/Grades';
import Years from "../components/pages/Years";
import Notes from "../components/pages/Notes";
const Sidepage = () => {
  return (
    <Routes>

      <Route
        exact
        path="/"
        element={<Dashboard />}
      />
      <Route
        exact
        path="/myschedule"
        element={<MySchedule />}
      />
      <Route
        exact
        path="/calender"
        element={<Calender />}
      />
      <Route
        exact
        path="/myroadmap"
        element={<MyRoadmap />}
      />
      <Route
        exact
        path="/mytasks"
        element={<MyTasks />}
      />
      <Route
        exact
        path="/mygrades"
        element={<MyGrades />}
      />
      <Route
        exact
        path="/resources"
        element={<Resources />}
      />
      <Route
        exact
        path="/notebook"
        element={<Notebook />}
      />
      <Route
        exact
        path="/myroadmap/:year"
        element={<Years />}
      />
      <Route
        exact
        path="/grades/:courseId"
        element={<Grades />}
      />
      <Route
        exact
        path="/notes"
        element={<Notes />}
      />
      <Route path="/myprofile" element={<ViewProfile />} />
    </Routes>
  );
};
export default Sidepage;
