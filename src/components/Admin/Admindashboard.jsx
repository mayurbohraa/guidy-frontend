import React from "react";

import Sidebar from "./AdminSidebar";
import Navbar from "../Navbar";
import Sidepage3 from "../../routes/Sidepage3";

const Admindashboard = (props) => {
  return (
    <div className="admindashboard">
      <Sidebar />
      <div className="adminDash2">
        <Navbar Name={props.Name} />
        <Sidepage3 />
      </div>
    </div>
  );
};

export default Admindashboard;
