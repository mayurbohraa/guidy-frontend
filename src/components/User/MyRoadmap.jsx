import React from "react";
import { NavLink } from "react-router-dom";

import Mainlogo from "../Mainlogo";

const MyRoadmap = () => {
  return (
    <div className="myroadmap">
      <Mainlogo />
      <div className="year-container">
        <p style={{ fontSize: 20 }}>Choose Year</p>

        <NavLink className="year-item" to={"/userdashboard/myroadmap/1"}>
          First Year
        </NavLink>

        <NavLink className="year-item" to={"/userdashboard/myroadmap/2"}>
          Second Year
        </NavLink>

        <NavLink className="year-item" to={"/userdashboard/myroadmap/3"}>
          Third Year
        </NavLink>

        <NavLink className="year-item" to={"/userdashboard/myroadmap/4"}>
          Fourth Year
        </NavLink>
      </div>
    </div>
  );
};

export default MyRoadmap;
