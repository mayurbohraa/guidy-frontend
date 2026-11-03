import FieldHelp from "./FieldHelp";
import React, { useEffect, useRef, useState } from "react";

import Mainlogo from "./Mainlogo";
import { UilCheck, UilTimes } from "@iconscout/react-unicons";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,20}$/;
const ResetPassword = () => {
  const userRef = useRef();
  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  useEffect(() => {
    userRef.current.focus();
  }, []);
  useEffect(() => {
    const Password = PWD_REGEX.test(pwd);
    setValidPwd(Password);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [pwd, matchPwd]);
  const handleSubmit = event => {
    event.preventDefault();
    toast.info("Password recovery is unavailable. Contact your Guidy administrator for help.");
  };
  return (
    <div className="resetpassword">

      <Mainlogo />


      <div className="rpform">
        <form
          action=""
          onSubmit={handleSubmit}
        >
          <h1>Enter Password</h1>
          <label>
            <FieldHelp id="pwdnote" label="New password" hint="8–20 characters with uppercase, lowercase, a number, and at least one of ! @ # $ %."><input
              type="password"
              id="password"
              name="password"
              ref={userRef}
              onChange={e => setPwd(e.target.value)}
              autoComplete="off"
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwdnote"
              placeholder="Enter New Password"
              aria-label="Enter New Password"
              required
            /></FieldHelp>
            <span className={validPwd ? "valid" : "hide"}>
              <UilCheck />
            </span>
            <span className={validPwd || !pwd ? "hide" : "invalid"}>
              <UilTimes />
            </span>
            <br />
          </label>

          <label>
            <FieldHelp id="matchpwdnote" label="Confirm password" hint="Enter exactly the same password as above."><input
              type="password"
              id="confirm_password"
              name="confirm_password"
              onChange={e => setMatchPwd(e.target.value)}
              autoComplete="off"
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="matchpwdnote"
              placeholder="Confirm Password"
              aria-label="Confirm Password"
              required
            /></FieldHelp>
            <span className={validMatch && matchPwd ? "valid" : "hide"}>
              <UilCheck />
            </span>
            <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
              <UilTimes />
            </span>
            <br />
          </label>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};
export default ResetPassword;
