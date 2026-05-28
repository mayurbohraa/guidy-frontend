import React, { useEffect, useRef, useState } from "react";
import Mainlogo from "./Mainlogo";

import { UilCheck, UilTimes, UilInfoCircle } from "@iconscout/react-unicons";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ResetPassword = () => {
  const userRef = useRef();
  const errRef = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,20}$/;

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const Password = PWD_REGEX.test(pwd);
    console.log(Password);
    console.log(pwd);
    setValidPwd(Password);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [PWD_REGEX, pwd, matchPwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const V = PWD_REGEX.test(pwd);

    if (!V) {
      toast.error("Invalid Entry !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });

      return;
    }

    try {
      toast.success("Password Reset Successfull !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    } catch (err) {
      if (!err?.response) {
        toast.error("No Server Response !", {
          position: "top-right",
          theme: "colored",
          toastId: 1,
        });
      } else {
        toast.error("Password Reset Failed !", {
          position: "top-right",
          theme: "colored",
          toastId: 1,
        });
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="resetpassword">
      {/* main logo page */}
      <Mainlogo />

      {/* reset password form */}
      <div className="rpform">
        <form action="" onSubmit={handleSubmit}>
          <h1>Enter Password</h1>
          <label>
            <input
              type="password"
              id="password"
              name="password"
              ref={userRef}
              onChange={(e) => setPwd(e.target.value)}
              autoComplete="off"
              aria-invalid={validPwd ? "false" : "true"}
              aria-describedby="pwsnote"
              placeholder="Enter New Password"
              required
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
            />
            <span className={validPwd ? "valid" : "hide"}>
              <UilCheck />
            </span>
            <span className={validPwd || !pwd ? "hide" : "invalid"}>
              <UilTimes />
            </span>
            <br />
            <p
              id="pwdnote"
              className={
                pwdFocus && pwd && !validPwd ? "instructions" : "offscreen"
              }
            >
              <UilInfoCircle /> 8 to 20 characters. Must include uppercase and
              <br /> lowercase letters, a number and a special character. <br />
              Allowed special characters: @,#,$,%.
            </p>
          </label>

          <label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              ref={userRef}
              onChange={(e) => setMatchPwd(e.target.value)}
              autoComplete="off"
              aria-invalid={validMatch ? "false" : "true"}
              aria-describedby="matchpwdnote"
              placeholder="Confirm Password"
              required
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
            />
            <span className={validMatch && matchPwd ? "valid" : "hide"}>
              <UilCheck />
            </span>
            <span className={validMatch || !matchPwd ? "hide" : "invalid"}>
              <UilTimes />
            </span>
            <br />
            <p
              id="matchpwdnote"
              className={
                matchFocus && !validMatch ? "instructions" : "offscreen"
              }
            >
              <UilInfoCircle /> Must match the first password field
            </p>
          </label>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
