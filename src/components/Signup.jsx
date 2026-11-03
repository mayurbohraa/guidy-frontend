import AuthBranding from "./AuthBranding";
import FieldHelp from "./FieldHelp";
import { useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SignupApi } from "../service/Authentication.service";

const fields = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name", hint: "4–20 letters (A–Z), without spaces or numbers.", maxLength: 20 },
  { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name", hint: "4–20 letters (A–Z), without spaces or numbers.", maxLength: 20 },
  { name: "email", label: "Email", type: "email", autoComplete: "email", hint: "Use your university email, e.g. name@qu.edu.qa.", maxLength: 254 },
  { name: "mobileNumber", label: "Mobile number", type: "tel", autoComplete: "tel", hint: "Qatar format: +974 followed by 8 digits, e.g. +97455123456.", maxLength: 12 },
  { name: "password", label: "Password", type: "password", autoComplete: "new-password", hint: "8–20 characters with uppercase, lowercase, a number, and at least one of ! @ # $ %.", maxLength: 20 },
  { name: "confirmPassword", label: "Confirm password", type: "password", autoComplete: "new-password", hint: "Enter the same password again.", maxLength: 20 },
];
function validate(name, values) {
  const value = values[name] || "";
  if (!value.trim()) return "This field is required.";
  if (["firstName", "lastName"].includes(name) && !/^[a-zA-Z]{4,20}$/.test(value)) return "Use 4–20 letters only, without spaces or numbers.";
  if (name === "email" && !/^[^\s@]+@qu\.edu\.qa$/i.test(value)) return "Use a university email such as name@qu.edu.qa.";
  if (name === "mobileNumber" && !/^\+974[0-9]{8}$/.test(value)) return "Enter +974 followed by exactly 8 digits.";
  if (name === "password" && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,20}$/.test(value)) return "Use 8–20 characters with uppercase, lowercase, a number, and one of ! @ # $ %.";
  if (name === "confirmPassword" && value !== values.password) return "The passwords must match.";
  return "";
}

export default function Signup() {
  const navigate = useNavigate();
  const formRef = useRef();
  const [values, setValues] = useState({ role: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [failure, setFailure] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (submitting) return;
    const nextErrors = Object.fromEntries(fields.map(({ name }) => [name, validate(name, values)]));
    if (!["student", "contributor"].includes(values.role)) nextErrors.role = "Choose Student or Contributor.";
    setErrors(nextErrors);
    setFailure("");
    const invalid = Object.keys(nextErrors).find((key) => nextErrors[key]);
    if (invalid) { formRef.current.elements[invalid]?.focus(); return; }
    setSubmitting(true);
    try {
      const { confirmPassword, ...body } = values;
      await SignupApi(body);
      navigate("/", { state: { accountCreated: true } });
    } catch (error) {
      const status = error.response?.status;
      setFailure(status === 409 ? "This email is already registered. Log in or use another university email."
        : status === 400 ? error.response.data?.message || "Check your details and the formats below."
        : "Your account could not be created right now. Please try again.");
    } finally { setSubmitting(false); }
  }
  return (
    <main className="guidy-login guidy-signup">
      <AuthBranding />
      <div className="login-form">
        <form ref={formRef} onSubmit={submit} noValidate aria-busy={submitting}>
          <div><p className="guidy-login-intro">Start your journey</p><h1>Create your account</h1><p className="guidy-auth-intro">Join Guidy with your Qatar University email.</p></div>
          <div className="guidy-signup-fields">
            {fields.map((field) => <div className="guidy-auth-field" key={field.name}>
              <label htmlFor={"signup-" + field.name}>{field.label}</label>
              <FieldHelp id={"signup-hint-" + field.name} label={field.label} hint={field.hint}>
              <input id={"signup-" + field.name} name={field.name} type={field.type} autoComplete={field.autoComplete}
                maxLength={field.maxLength} value={values[field.name] || ""} required disabled={submitting}
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={"signup-hint-" + field.name + (errors[field.name] ? " signup-error-" + field.name : "")}
                onBlur={() => setErrors((current) => ({ ...current, [field.name]: validate(field.name, values) }))}
                onChange={(event) => { setValues((current) => ({ ...current, [field.name]: event.target.value })); setErrors((current) => ({ ...current, [field.name]: "" })); setFailure(""); }} />
              </FieldHelp>
              {errors[field.name] && <span className="guidy-field-error" id={"signup-error-" + field.name}>{errors[field.name]}</span>}
            </div>)}
          </div>
          <fieldset className="guidy-role-options" disabled={submitting} aria-describedby={errors.role ? "signup-role-error" : "signup-role-hint"}>
            <legend>Choose your role</legend>
            <p id="signup-role-hint" className="guidy-field-hint">Students plan their studies. Contributors share learning resources.</p>
            <div>{["student", "contributor"].map((role) => <label key={role} className={values.role === role ? "guidy-role-selected" : ""}>
              <input type="radio" name="role" value={role} checked={values.role === role} required onChange={() => { setValues((current) => ({ ...current, role })); setErrors((current) => ({ ...current, role: "" })); }} />
              {role === "student" ? "Student" : "Contributor"}
            </label>)}</div>
            {errors.role && <span className="guidy-field-error" id="signup-role-error">{errors.role}</span>}
          </fieldset>
          {failure && <p role="alert" className="guidy-login-error">{failure}</p>}
          <button type="submit" disabled={submitting}>{submitting ? "Creating account…" : "Create account"}</button>
          <p className="login-navigation">Already have an account? <NavLink to="/" className="navsignup">Log in</NavLink></p>
        </form>
      </div>
    </main>
  );
}
