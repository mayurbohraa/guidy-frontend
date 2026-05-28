import React from "react";

import Sidebar from "./UserSidebar";
import Navbar from "../Navbar";
import Sidepage from "../../routes/Sidepage";

const userdashboard = (props) => {
  return (
    <div className="userdashboard">
      <Sidebar />
      <div className="userDash2">
        <Navbar Name={props.Name} />
        <Sidepage />
      </div>
    </div>
  );
};

export default userdashboard;
