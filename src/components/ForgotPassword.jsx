import React, { useEffect, useRef, useState } from "react";

import { UilCheck, UilTimes, UilInfoCircle } from "@iconscout/react-unicons";

import Mainlogo from "./Mainlogo";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ForgotPassword = () => {
  const userRef = useRef();
  const errRef = useRef();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const EMAIL_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[qu]+(?:\.[edu]+)+(?:\.[qa]+)*$/;

  const [email, setEmail] = useState("");
  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const Email = EMAIL_REGEX.test(email);
    console.log(Email);
    console.log(email);
    setValidEmail(Email);
  }, [email, EMAIL_REGEX]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const V = EMAIL_REGEX.test(email);

    if (!V) {
      toast.error("Invalid Entry !", {
        position: "top-right",
        theme: "colored",
        toastId: 1,
      });

      return;
    }

    try {
      toast.success("Link Send Successfull !", {
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
        toast.error("Link Send Failed !", {
          position: "top-right",
          theme: "colored",
          toastId: 1,
        });
      }
      errRef.current.focus();
    }
  };

  return (
    <div className="forgotpassword">
      {/* mainlogo page */}
      <Mainlogo />

      {/* forgot password email form */}
      <div className="fpform">
        <form action="" onSubmit={handleSubmit}>
          <h1>Enter Your Email</h1>
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
              placeholder="Enter Your Email"
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

          <button type="submit" disabled={!validEmail ? true : false}>
            Verify Email
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
