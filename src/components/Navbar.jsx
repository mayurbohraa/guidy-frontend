import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import Profile from "../assets/images/Profile.png";
import { UilSearch, UilBell } from "@iconscout/react-unicons";
import { ProfileDD } from "../data/data";
import { useEffect } from "react";
import { guidyGet } from "../Api/api.service";
import apiRoutes from "../Api/apiRoutes";

const data = require("../data/Searchbardata.json");

const Navbar = () => {
  const [selected2, setSelected2] = useState();
  const [value, setValue] = useState("");
  const [notifications,setNotification] = useState([]);

  useEffect(()=>{
    fetchNotifications();
  },[]);
  
  async function fetchNotifications(){
    const notifi = await guidyGet(apiRoutes.getNotifications);
    console.log(notifi);
    setNotification(notifi.data);
  }

  let user;
  const getuser = localStorage.getItem("login_status");
  // console.log(getuser);
  if (getuser && getuser.length) {
    user = JSON.parse(getuser);
    // console.log(user);
  }

  const onChange = (event) => {
    setValue(event.target.value);
  };

  const onSearch = (searchTerm) => {
    setValue(searchTerm);
    // our api to fetch the search result
    console.log("search ", searchTerm);
  };

  return (
    <div className="navbar">
      {/* searchbar */}
      <div className="searchbar">
        <span>
          <UilSearch />
        </span>
        <div className="search-container">
          <input
            type="search"
            name=""
            id="search"
            placeholder="Search"
            value={value}
            onChange={onChange}
          />
          <div className="dropdown">
            {data
              .filter((item) => {
                const searchTerm = value.toLowerCase();
                const fullName = item.heading.toLowerCase();

                return (
                  searchTerm &&
                  fullName.startsWith(searchTerm) &&
                  fullName !== searchTerm
                );
              })
              .slice(0, 10)
              .map((item) => (
                <div
                  onClick={() => onSearch(item.heading)}
                  className="dropdown-row"
                  key={item.heading}
                >
                  {item.heading}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* notification */}

      <div className="notification dropdown">
        <button className="dropbtn">
          <span>
            <UilBell />
          </span>
          <div className="counter">
            <span>{notifications.length}</span>
          </div>
        </button>
        <div className="notificationbox">
          {notifications.map((item, index) => {
            return (
              <div key={index}>
                <ul>
                  <li>
                    <h5>{item.title}</h5>
                    <span style={{ marginRight: "10px" }}>{item.time}</span>
                    <span>{(new Date(item.createdAt)).toLocaleString()}</span>
                  </li>
                </ul>
              </div>
            );
          })}
        </div>
      </div>

      {/* Profile dropdown */}
      <div className="profile dropdown">
        <button className="dropbtn">
          <span>
            Hello {user.firstName}
            <br />
            <span>Welcome Back!</span>
          </span>
          <img src={Profile} alt="" />
        </button>
        <div className="dropdown-content">
          {ProfileDD.map((item, index) => {
            return (
              <div key={index}>
                <NavLink
                  to={item.to}
                  className={
                    selected2 === index ? "menuItem2 active" : "menuItem2"
                  }
                  onClick={() => setSelected2(index)}
                >
                  <item.icon />
                  <span>{item.name}</span>
                </NavLink>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
