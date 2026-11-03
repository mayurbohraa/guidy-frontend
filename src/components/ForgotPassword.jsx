import FieldHelp from "./FieldHelp";
import React, { useEffect, useRef, useState } from "react";

import { UilCheck, UilTimes } from "@iconscout/react-unicons";

import Mainlogo from "./Mainlogo";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@qu\.edu\.qa$/i;
const ForgotPassword = () => {
  const userRef = useRef();
  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    const Email = EMAIL_REGEX.test(email);
    setValidEmail(Email);
  }, [email]);
  const handleSubmit = event => {
    event.preventDefault();
    toast.info("Password recovery is unavailable. Contact your Guidy administrator for help.");
  };
  return (
    <div className="forgotpassword">

      <Mainlogo />


      <div className="fpform">
        <form
          action=""
          onSubmit={handleSubmit}
        >
          <h1>Enter Your Email</h1>
          <label>
            <FieldHelp id="emailnote" label="Email" hint="University email format: name@qu.edu.qa."><input
              type="email"
              id="email"
              name="email"
              ref={userRef}
              onChange={e => setEmail(e.target.value)}
              autoComplete="off"
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="emailnote"
              placeholder="Enter Your Email"
              aria-label="Enter Your Email"
              required
            /></FieldHelp>
            <span className={validEmail ? "valid" : "hide"}>
              <UilCheck />
            </span>
            <span className={validEmail || !email ? "hide" : "invalid"}>
              <UilTimes />
            </span>
            <br />
          </label>

          <button
            type="submit"
            disabled={!validEmail ? true : false}
          >
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};
export default ForgotPassword;
