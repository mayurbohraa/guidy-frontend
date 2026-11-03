import React from "react";

import { NavLink } from "react-router-dom";
import Logo from "../../assets/images/Logo.svg";
import { SidebarData } from "../../data/data";
const UserSidebar = () => {
  return (
    <div className="sidebar">

      <div className="logo">
        <img
          src={Logo}
          alt="Guidy"
        />
      </div>


      <nav className="menu" aria-label="User navigation">

        {SidebarData.map((item) => {
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
                <span>{item.name}</span>
              </NavLink>
            </div>
          );
        })}
      </nav>
    </div>
  );
};
export default UserSidebar;
