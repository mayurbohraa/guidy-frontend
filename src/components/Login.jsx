import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { UilCheck, UilTimes, UilInfoCircle } from "@iconscout/react-unicons";

import Mainlogo from "./Mainlogo";
import { LoginApi } from "../service/Authentication.service";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const navigate = useNavigate();
  const userRef = useRef();
  const errRef = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,20}$/;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[qu]+(?:\.[edu]+)+(?:\.[qa]+)*$/;

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [pwd, setPwd] = useState("");
  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const Email = EMAIL_REGEX.test(email);
    const Password = PWD_REGEX.test(pwd);
    setValidEmail(Email);
    setValidPwd(Password);
  }, [email, EMAIL_REGEX, PWD_REGEX, pwd]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const body = { email: email.trim(), password: pwd.trim() };
      const response = await LoginApi(body);

      localStorage.setItem("login_status", JSON.stringify(response.data.user));
      localStorage.setItem("token_status", response.data.token);
      toast.success("Login Successfull !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });
      if (response.data.user.role === "student") {
        navigate("/userdashboard");
      } else if (response.data.user.role === "contributor") {
        navigate("/contributordashboard", 2000);
      } else if (response.data.user.role === "admin") {
        navigate("/admindashboard");
      }
    } catch (err) {
      if (!err?.response) {
        toast.error("No Server Response !", {
          position: "top-right",
          theme: "colored",
          toastId: 1,
        });
      } else if (err.response?.status === 400) {
        toast.warn(err.response?.message, {
          position: "top-right",
          theme: "colored",
          toastId: 1,
        });
      } else {
        toast.error("Login Failed !", {
          position: toast.POSITION.TOP_RIGHT,
          theme: "colored",
          toastId: 1,
        });
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="login">
      {/* Main logo page */}
      <Mainlogo />

      {/* login form */}
      <div className="login-form">
        <form action="" onSubmit={handleSubmit}>
          <h1>Login</h1>
          <div className="details">
            <label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
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
                type="password"
                id="password"
                name="password"
                value={pwd}
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
                <UilInfoCircle /> Invalid password
              </p>
            </label> 

            <NavLink to={"/forgotpassword"} className="navforgotpass">
              Forgot Password
            </NavLink>

            <button
              type="submit"
              disabled={!validEmail || !validPwd ? true : false}
            >
              LogIn
            </button>
          </div>
          <div className="login-navigation">
            <span>
              Don't have an account ?{" "}
              <NavLink to={"/signup"} className="navsignup">
                SignUp
              </NavLink>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
