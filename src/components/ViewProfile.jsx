import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Profile from "../assets/images/Profile.svg";

const ViewProfile = () => {
  const navigate = useNavigate();
  const back = () => {
    navigate(-1);
  };

  let user;
  const getuser = localStorage.getItem("login_status");
  if (getuser && getuser.length) {
    user = JSON.parse(getuser);
  }

  return (
    <div className="viewprofile">
      <span>View Profile</span>
      <form action="" className="viewprofile2">
        <div className="profilepicture">
          <img src={Profile} alt="" />
        </div>
        <div className="viewprofileform">
          <table>
            <tr>
              <td>First Name &#58;</td>
              <td className="inputs">
                <div>{user.firstName}</div>
              </td>
            </tr>
            <tr>
              <td>Last Name &#58;</td>
              <td className="inputs">
                <div>{user.lastName}</div>
              </td>
            </tr>
            <tr>
              <td>E-mail &#58;</td>
              <td className="inputs">
                <div>{user.email}</div>
              </td>
            </tr>
            <tr>
              <td>Mobile No. &#58;</td>
              <td className="inputs">
                <div>{user.mobileNumber}</div>
              </td>
            </tr>
            <tr>
              <td>Role &#58;</td>
              <td className="inputs">
                <div>{user.role}</div>
              </td>
            </tr>
            <tr>
              <td>
                <NavLink onClick={back} id="back">
                  Back
                </NavLink>
              </td>
            </tr>
          </table>
        </div>
      </form>
    </div>
  );
};

export default ViewProfile;
