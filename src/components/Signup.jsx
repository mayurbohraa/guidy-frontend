import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import { UilCheck, UilTimes, UilInfoCircle } from "@iconscout/react-unicons";

import Mainlogo from "./Mainlogo";
import { SignupApi } from "../service/Authentication.service";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const history = useNavigate();

  const userRef = useRef();
  const errRef = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const USER_REGEX = /^[a-zA-Z]{4,20}$/;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,20}$/;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[qu]+(?:\.[edu]+)+(?:\.[qa]+)*$/;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const TEL_REGEX = /^([?=.*[+974])([?=.*[0-9]){11,11}$/;

  const [firstName, setFirstName] = useState("");
  const [validFirstName, setValidFirstName] = useState(false);
  const [firstNameFocus, setFirstNameFocus] = useState(false);

  const [lastName, setLastName] = useState("");
  const [validLastName, setValidLastName] = useState(false);
  const [lastNameFocus, setLastNameFocus] = useState(false);

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [tel, setTel] = useState("");
  const [validTel, setValidTel] = useState(false);
  const [telFocus, setTelFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [matchPwd, setMatchPwd] = useState("");
  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [role, setRole] = useState("");
  const [validRole, setValidRole] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const Firstname = USER_REGEX.test(firstName);
    const Lastname = USER_REGEX.test(lastName);
    const Email = EMAIL_REGEX.test(email);
    const Tel = TEL_REGEX.test(tel);
    const Password = PWD_REGEX.test(pwd);
    const Role = role;
    setValidFirstName(Firstname);
    setValidLastName(Lastname);
    setValidEmail(Email);
    setValidTel(Tel);
    setValidRole(Role);
    setValidPwd(Password);
    const match = pwd === matchPwd;
    setValidMatch(match);
  }, [
    USER_REGEX,
    firstName,
    lastName,
    email,
    tel,
    EMAIL_REGEX,
    TEL_REGEX,
    role,
    PWD_REGEX,
    pwd,
    matchPwd,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const v1 = USER_REGEX.test(firstName);
    const v2 = USER_REGEX.test(lastName);
    const v3 = EMAIL_REGEX.test(email);
    const v4 = TEL_REGEX.test(tel);
    const v5 = role;
    const v6 = PWD_REGEX.test(pwd);

    if (!v1 || !v2 || !v3 || !v4 || !v5 || !v6) {
      toast.warn("Invalid User !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
    }

    try {
      const body = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobileNumber: tel,
        password: pwd,
        role: role,
      };
      const response = await SignupApi(body);
      console.log(response);
      toast.success("Signup Successfull !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
      history("/");
    } catch (err) {
      if (!err?.response) {
        toast.error("No Server Response !", {
          position: "top-right",
          theme: "colored",
          toastId: 1,
        });
      } else if (err.response?.status === 400) {
        toast.warn("Already Registered !", {
          position: "top-right",
          theme: "colored",
          toastId: 1,
        });
      } else {
        toast.error("Signup Failed !", {
          position: "top-right",
          theme: "colored",
          toastId: 1,
        });
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="signup">
      {/* main logo page */}
      <Mainlogo />

      {/* signup form */}
      <div className="signup-form">
        <form action="" className="details" onSubmit={handleSubmit}>
          <h1>Signup</h1>
          <label htmlFor="">
            <input
              type="text"
              id="firstname"
              name="firstname"
              ref={userRef}
              onChange={(e) => setFirstName(e.target.value)}
              autoComplete="off"
              aria-invalid={validFirstName ? "false" : "true"}
              aria-describedby="firstnamenote"
              placeholder="First Name"
              required
              onFocus={() => setFirstNameFocus(true)}
              onBlur={() => setFirstNameFocus(false)}
            />
            <span className={validFirstName ? "valid" : "hide"}>
              <UilCheck />
            </span>
            <span className={validFirstName || !firstName ? "hide" : "invalid"}>
              <UilTimes />
            </span>
            <br />
            <p
              id="firstnamenote"
              className={
                firstNameFocus && firstName && !validFirstName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <UilInfoCircle /> 4 to 20 characters.
            </p>
          </label>

          <label>
            <input
              type="text"
              id="lastname"
              name="lastname"
              ref={userRef}
              onChange={(e) => setLastName(e.target.value)}
              autoComplete="off"
              aria-invalid={validLastName ? "false" : "true"}
              aria-describedby="lastnamenote"
              placeholder="Last Name"
              required
              onFocus={() => setLastNameFocus(true)}
              onBlur={() => setLastNameFocus(false)}
            />
            <span className={validLastName ? "valid" : "hide"}>
              <UilCheck />
            </span>
            <span className={validLastName || !lastName ? "hide" : "invalid"}>
              <UilTimes />
            </span>
            <br />
            <p
              id="lastnamenote"
              className={
                lastNameFocus && lastName && !validLastName
                  ? "instructions"
                  : "offscreen"
              }
            >
              <UilInfoCircle /> 4 to 20 characters.
            </p>
          </label>

          <label>
            <input
              type="email"
              id="email"
              name="email"
              ref={userRef}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="off"
              aria-invalid={validEmail ? "false" : "true"}
              aria-describedby="emailnote"
              placeholder="Email"
              required
              onFocus={() => setEmailFocus(true)}
              onBlur={() => setEmailFocus(false)}
            />
            <span className={validEmail ? "valid" : "hide"}>
              <UilCheck />
            </span>
            <span className={validEmail || !email ? "hide" : "invalid"}>
              <UilTimes />
            </span>
            <br />
            <p
              id="emailnote"
              className={
                emailFocus && email && !validEmail
                  ? "instructions"
                  : "offscreen"
              }
            >
              <UilInfoCircle /> Email format : abc@qu.edu.qa
            </p>
          </label>

          <label>
            <input
              type="tel"
              id="tel"
              name="tel"
              ref={userRef}
              onChange={(e) => setTel(e.target.value)}
              autoComplete="off"
              aria-invalid={validTel ? "false" : "true"}
              aria-describedby="telnote"
              placeholder="Mobile Number"
              required
              onFocus={() => setTelFocus(true)}
              onBlur={() => setTelFocus(false)}
            />
            <span className={validTel ? "valid" : "hide"}>
              <UilCheck />
            </span>
            <span className={validTel || !tel ? "hide" : "invalid"}>
              <UilTimes />
            </span>
            <br />
            <p
              id="telnote"
              className={
                telFocus && tel && !validTel ? "instructions" : "offscreen"
              }
            >
              <UilInfoCircle /> Enter only 8 digits Mobile Number along with{" "}
              <br />
              country code +974
            </p>
          </label>

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
              placeholder="Password"
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

          <div className="radio">
            <label className="radiobtn">
              <input
                type="radio"
                name="role"
                value="student"
                autoComplete="off"
                ref={userRef}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              Student
            </label>
            <label className="radiobtn">
              <input
                type="radio"
                name="role"
                value="contributor"
                autoComplete="off"
                ref={userRef}
                onChange={(e) => setRole(e.target.value)}
                required
              />
              Contributor
            </label>
          </div>
          <button
            type="submit"
            disabled={
              !validFirstName ||
              !validLastName ||
              !validEmail ||
              !validTel ||
              !validPwd ||
              !validMatch ||
              !validRole
                ? true
                : false
            }
          >
            Sign up
          </button>
          <div className="signup-navigation">
            <span>
              Already have an account ?{" "}
              <NavLink to={"/"} className="navlogin">
                LogIn
              </NavLink>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
