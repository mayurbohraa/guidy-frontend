import React from "react";

import Logo from "../assets/images/Logo.svg";
import Laptop from "../assets/images/Laptop.svg";

const mainlogo = () => {
  return (
    <div className="mainlogo">
      <img src={Logo} className="logo" id="logo" alt="" />
      <img src={Laptop} className="laptop" id="laptop" alt="" />
    </div>
  );
};

export default mainlogo;
