import React, { useState } from "react";
import { NavLink } from "react-router-dom";

import Logo from "../../assets/images/Logo.svg";

import { SidebarData2 } from "../../data/data";

const ContributorSidebar = (props) => {
  const [selected, setSelected] = useState();

  return (
    <div className="sidebar">
      {/* logo */}
      <div className="logo">
        <img src={Logo} alt="" />
      </div>

      {/* menu */}
      <div className="menu">
        {SidebarData2.map((item, index) => {
          return (
            <div key={index}>
              <NavLink
                to={item.to}
                className={selected === index ? "menuItem active" : "menuItem"}
                onClick={() => setSelected(index)}
              >
                <item.icon />
                <span>{item.name}</span>
              </NavLink>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ContributorSidebar;
