import React from "react";

import Sidebar from "./UserSidebar";
import Navbar from "../Navbar";
import Sidepage from "../../routes/Sidepage";
const userdashboard = props => {
  return (
    <div className="userdashboard">
      <Sidebar />
      <div className="userDash2">
        <Navbar Name={props.Name} />
        <div className="workspace-scroll" role="region" aria-label="Dashboard content" tabIndex={0}>
          <Sidepage />
        </div>
      </div>
    </div>
  );
};
export default userdashboard;
