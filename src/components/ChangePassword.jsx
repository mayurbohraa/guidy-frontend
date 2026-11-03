import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { guidyPut } from "../Api/api.service";
import FieldHelp from "./FieldHelp";

const fields = [
  ["currentPassword", "Current password", "Enter your existing Guidy password."],
  ["newPassword", "New password", "Use 8–20 characters with uppercase, lowercase, a number, and one of ! @ # $ %."],
  ["confirmation", "Confirm new password", "Repeat the new password exactly."],
];

export default function ChangePassword() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    const { currentPassword, newPassword, confirmation } = Object.fromEntries(new FormData(event.currentTarget));
    if (newPassword !== confirmation) {
      setError("The new passwords must match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await guidyPut("/profile/password", { currentPassword, newPassword });
      localStorage.removeItem("login_status");
      localStorage.removeItem("token_status");
      navigate("/", { replace: true, state: { passwordReset: true } });
    } catch (failure) {
      const status = failure.response?.status;
      setError([400, 409].includes(status)
        ? failure.response.data?.message || "Check your password and try again."
        : status === 401 ? "Your session has expired. Sign in and try again."
        : "The password could not be changed. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (!editing) return <button className="workspace-secondary" type="button" onClick={() => setEditing(true)}>Change password</button>;

  return (
    <form className="workspace-form" onSubmit={submit} aria-label="Change password" aria-busy={busy}>
      <p>After changing your password, sign in again with the new one.</p>
      {fields.map(([name, label, hint]) => (
        <div className="guidy-auth-field" key={name}>
          <label htmlFor={"change-" + name}>{label}</label>
          <FieldHelp id={"change-hint-" + name} label={label} hint={hint}>
            <input id={"change-" + name} name={name} type="password" required disabled={busy}
              autoComplete={name === "currentPassword" ? "current-password" : "new-password"}
              aria-describedby={"change-hint-" + name} />
          </FieldHelp>
        </div>
      ))}
      {error && <p role="alert">{error}</p>}
      <div className="workspace-actions">
        <button className="workspace-button" type="submit" disabled={busy}>{busy ? "Saving…" : "Update password"}</button>
        <button className="workspace-secondary" type="button" disabled={busy} onClick={() => { setEditing(false); setError(""); }}>Cancel</button>
      </div>
    </form>
  );
}
