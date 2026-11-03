import React from "react";

import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/Logo.svg";
import { SidebarData3 } from "../../data/data";
const AdminSidebar = () => {
  return (
    <div className="sidebar">

      <div className="logo">
        <img
          src={Logo}
          alt="Guidy"
        />
      </div>


      <nav className="menu" aria-label="Admin navigation">

        {SidebarData3.map((item) => {
          return (
            <div key={item.to}>
              <NavLink
                to={item.to}
                end={item.to.endsWith("/")}
                className={({
                  isActive
                }) => isActive ? "menuItem active" : "menuItem"}
              >
                <item.icon />
                <span>{item.to.endsWith("/requests") ? "Resource requests" : item.to.endsWith("/calender") ? "Calendar" : item.name}</span>
              </NavLink>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
export default AdminSidebar;
