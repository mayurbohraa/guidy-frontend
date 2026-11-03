import React from "react";

import Logo from "../assets/images/Logo.svg";

import Laptop from "../assets/images/Laptop.svg";
const Mainlogo = () => {
  return (
    <div className="mainlogo">
      <img
        src={Logo}
        className="logo"
        id="logo"
        alt="Guidy"
      />
      <img
        src={Laptop}
        className="laptop"
        id="laptop"
        alt=""
        decoding="async"
      />
    </div>
  );
};
export default Mainlogo;
