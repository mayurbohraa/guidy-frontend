import AuthBranding from "./AuthBranding";
import FieldHelp from "./FieldHelp";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { getDashboardPath, LoginApi } from "../service/Authentication.service";
import "react-toastify/dist/ReactToastify.css";

function fieldError(input) {
  if (!input.value.trim()) {
    return input.name === "email"
      ? "Enter your email address."
      : "Enter your password.";
  }
  if (input.name === "email" && input.validity.typeMismatch) {
    return "Enter a valid email address, e.g. name@qu.edu.qa.";
  }
  return "";
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const errorRef = useRef();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [error, setError] = useState("");

  useEffect(() => {
    if (error) errorRef.current?.focus();
  }, [error]);

  function validateField(event) {
    const input = event.target;
    setErrors((current) => ({ ...current, [input.name]: fieldError(input) }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (submitting) return;
    const form = event.currentTarget;
    const nextErrors = {
      email: fieldError(form.elements.email),
      password: fieldError(form.elements.password),
    };
    setErrors(nextErrors);
    setError("");
    const invalidField = Object.keys(nextErrors).find(
      (name) => nextErrors[name],
    );
    if (invalidField) {
      form.elements[invalidField].focus();
      return;
    }

    const fields = new FormData(form);
    setSubmitting(true);

    try {
      const { data } = await LoginApi({
        email: fields.get("email").trim(),
        // Preserve the password exactly as entered for existing accounts.
        password: fields.get("password"),
      });
      const destination = getDashboardPath(data?.user?.role);
      if (
        destination === "/" ||
        typeof data?.token !== "string" ||
        !data.token
      ) {
        setError(
          "This account could not be signed in. Try again or contact your administrator.",
        );
        return;
      }
      localStorage.setItem("login_status", JSON.stringify(data.user));
      localStorage.setItem("token_status", data.token);
      navigate(destination);
    } catch (failure) {
      const status = failure.response?.status;
      if (status === 400 || status === 401) {
        setError("Check your email and password and try again.");
      } else if (status === 429) {
        setError("Too many sign-in attempts. Please wait and try again.");
      } else {
        setError("Guidy could not connect right now. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  function clearError(event) {
    const name = event.target.name;
    setErrors((current) => ({ ...current, [name]: "" }));
    setError("");
  }

  return (
    <main className="login guidy-login">
      <AuthBranding />
      <div className="login-form">
        <form onSubmit={handleSubmit} aria-busy={submitting} noValidate>
          <div>
            <p className="guidy-login-intro">Welcome back</p>
            <h1>Login</h1>
          </div>
          {location.state?.passwordReset && (
            <p role="status">
              Password updated. Sign in with your new password.
            </p>
          )}
          {location.state?.accountCreated && (
            <p role="status">Account created. You can now log in.</p>
          )}
          <div className="details">
            <div className="guidy-auth-field">
              <label htmlFor="login-email">Email</label>
              <FieldHelp
                id="login-email-hint"
                label="Email"
                hint="Use your registered university email, e.g. name@qu.edu.qa."
              >
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  autoComplete="username"
                  required
                  disabled={submitting}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    "login-email-hint" +
                    (errors.email ? " login-email-error" : "")
                  }
                  onBlur={validateField}
                  onChange={clearError}
                />
              </FieldHelp>
              {errors.email && (
                <span className="guidy-field-error" id="login-email-error">
                  {errors.email}
                </span>
              )}
            </div>
            <div className="guidy-auth-field">
              <label htmlFor="login-password">Password</label>
              <FieldHelp
                id="login-password-hint"
                label="Password"
                hint="Enter your existing password exactly; passwords are case-sensitive."
              >
                <input
                  id="login-password"
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  required
                  disabled={submitting}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    "login-password-hint" +
                    (errors.password ? " login-password-error" : "")
                  }
                  onBlur={validateField}
                  onChange={clearError}
                />
              </FieldHelp>
              {errors.password && (
                <span className="guidy-field-error" id="login-password-error">
                  {errors.password}
                </span>
              )}
            </div>
            <NavLink to="/forgotpassword" className="navforgotpass">
              Forgot password?
            </NavLink>
            {error && (
              <p
                ref={errorRef}
                className="guidy-login-error"
                role="alert"
                tabIndex={-1}
              >
                {error}
              </p>
            )}
            <button type="submit" disabled={submitting}>
              {submitting ? "Signing in…" : "Log in"}
            </button>
          </div>
          <p className="login-navigation">
            Don't have an account?{" "}
            <NavLink to="/signup" className="navsignup">
              Create your account
            </NavLink>
          </p>
        </form>
      </div>
    </main>
  );
}
