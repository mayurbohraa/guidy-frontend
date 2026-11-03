import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "./AuthLayout";
import { guidyPost } from "../Api/api.service";

const titles = ["Enter your university email", "Verify your recovery code", "Choose a new password"];

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  function goTo(next) {
    setStep(next);
    setError("");
    setMessage("");
    if (next === 0) setCode("");
  }

  async function run(action) {
    if (busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      await action();
    } catch (failure) {
      setError(failure.response?.status === 429 ? "Please wait before trying again."
        : failure.response?.status === 400 ? failure.response.data?.message || "Check your entries."
        : "The request could not be completed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  function submit(event) {
    event.preventDefault();
    const fields = Object.fromEntries(new FormData(event.currentTarget));
    if (step === 0) {
      if (!/^[^\s@]+@qu\.edu\.qa$/i.test(email.trim())) {
        setError("Enter your Qatar University email, such as name@qu.edu.qa.");
        return;
      }
      goTo(1);
    } else if (step === 1) {
      run(async () => {
        await guidyPost("/verify-recovery-code", { email: email.trim(), code });
        goTo(2);
      });
    } else {
      if (fields.password !== fields.confirmation) {
        setError("The new passwords must match.");
        return;
      }
      run(async () => {
        await guidyPost("/reset-password", { email: email.trim(), code, password: fields.password });
        setCode("");
        localStorage.removeItem("login_status");
        localStorage.removeItem("token_status");
        navigate("/", { replace: true, state: { passwordReset: true } });
      });
    }
  }

  return <AuthLayout>
    <form key={step} onSubmit={submit} aria-busy={busy}>
      <div><p className="guidy-login-intro">Password recovery · Step {step + 1} of 3</p><h1>{titles[step]}</h1></div>
      {step === 0 && <label className="guidy-auth-field">University email
        <input type="email" autoComplete="email" maxLength={254} required value={email} onChange={event => setEmail(event.target.value)} />
      </label>}
      {step === 1 && <>
        <p>Enter your saved recovery code for {email.trim()}.</p>
        <label className="guidy-auth-field">Recovery code
          <input type="password" required autoComplete="off" maxLength={35} value={code} disabled={busy} onChange={event => setCode(event.target.value)} />
        </label>
      </>}
      {step === 2 && <>
        <label className="guidy-auth-field">New password
          <input name="password" type="password" autoComplete="new-password" required minLength={8} maxLength={20} disabled={busy} />
        </label>
        <p className="guidy-field-hint">Use 8–20 characters with uppercase, lowercase, a number, and one of ! @ # $ %.</p>
        <label className="guidy-auth-field">Confirm new password
          <input name="confirmation" type="password" autoComplete="new-password" required maxLength={20} disabled={busy} />
        </label>
      </>}
      {error && <p role="alert">{error}</p>}
      {message && <p role="status">{message}</p>}
      <button type="submit" disabled={busy}>{busy ? "Please wait…" : step === 2 ? "Reset password" : "Continue"}</button>
      {step === 1 && <button type="button" className="workspace-secondary" disabled={busy} onClick={() => run(async () => {
        const result = await guidyPost("/forgot-password", { email: email.trim() });
        setMessage(result.message + " Delivery is simulated. Use your saved code.");
      })}>Request account recovery</button>}
      {step > 0 && <button type="button" className="workspace-secondary" disabled={busy} onClick={() => goTo(step - 1)}>Back</button>}
      <p className="login-navigation"><Link className="navsignup" to="/">Back to login</Link></p>
    </form>
  </AuthLayout>;
}
