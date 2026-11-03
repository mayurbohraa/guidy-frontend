import React, { useEffect } from "react";

import { useNavigate } from "react-router-dom";

const Logout = () => {
  const history = useNavigate();
  useEffect(() => {
    localStorage.removeItem("login_status");
    localStorage.removeItem("token_status");
  }, []);
  const deleteLT = e => {
    e.preventDefault();
    localStorage.removeItem("login_status");
    localStorage.removeItem("token_status");
    history("/");
  };
  return (
    <div className="logout">
      <h1>Logout Successfull</h1>
      <button onClick={deleteLT}>Go to Login Page</button>
    </div>
  );
};
export default Logout;
