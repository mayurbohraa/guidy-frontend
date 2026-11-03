import { useLocation } from "react-router-dom";
import RecoveryCode from "./RecoveryCode";
import ChangePassword from "./ChangePassword";
import FieldHelp from "./FieldHelp";
import { useEffect, useState } from "react";
import { getCurrentUser, getDashboardPath, setCurrentUser } from "../service/Authentication.service";
import { guidyGet, guidyPut } from "../Api/api.service";
import { Panel, PanelState, Workspace, useWorkspaceData } from "./Workspace";

const inputs = [
  { name: "firstName", label: "First name", type: "text", autoComplete: "given-name", maxLength: 60, required: true },
  { name: "lastName", label: "Last name", type: "text", autoComplete: "family-name", maxLength: 60, required: true },
  { name: "email", label: "Email", type: "email", autoComplete: "email", maxLength: 254, required: true },
  { name: "mobileNumber", label: "Mobile number (optional)", type: "tel", autoComplete: "tel", maxLength: 16 },
];

const hints = { firstName: "Up to 60 characters.", lastName: "Up to 60 characters.", email: "University format: name@qu.edu.qa.", mobileNumber: "Optional. Include the country code, e.g. +97455123456." };

const loadProfile = async () => {
  const { data } = await guidyGet("/profile");
  if (!data || getDashboardPath(data.role) === "/") throw new Error("Invalid profile response");
  return data;
};

export default function ViewProfile() {
  const { hash } = useLocation();
  const profile = useWorkspaceData(loadProfile);
  useEffect(() => {
    if (profile.status === "ready" && hash === "#recovery-code") {
      const section = document.getElementById("recovery-code");
      section?.focus();
      section?.scrollIntoView?.({ block: "nearest" });
    }
  }, [profile.status, hash]);

  const [savedUser, setSavedUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [status, setStatus] = useState("idle");
  const [errors, setErrors] = useState({});
  const [failure, setFailure] = useState("");
  const user = savedUser || profile.data || getCurrentUser();
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Guidy account";
  const initials = name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  useEffect(() => {
    if (profile.status === "ready") setCurrentUser(profile.data);
  }, [profile.status, profile.data]);

  async function save(event) {
    event.preventDefault();
    if (status === "saving") return;
    const form = event.currentTarget;
    const values = Object.fromEntries(new FormData(form));
    for (const key of Object.keys(values)) values[key] = values[key].trim();
    const nextErrors = {};
    for (const field of inputs.slice(0, 2)) {
      if (!values[field.name] || values[field.name].length > field.maxLength) {
        nextErrors[field.name] = "Enter a name of up to 60 characters.";
      }
    }
    if (values.email.length > 254 || !/^[^\s@]+@qu\.edu\.qa$/i.test(values.email)) {
      nextErrors.email = "Enter a valid Qatar University email address.";
    }
    if (values.mobileNumber && !/^\+[1-9]\d{6,14}$/.test(values.mobileNumber)) {
      nextErrors.mobileNumber = "Include a valid country code, e.g. +974.";
    }
    setErrors(nextErrors);
    setFailure("");
    const firstError = Object.keys(nextErrors)[0];
    if (firstError) {
      form.elements[firstError].focus();
      return;
    }
    setStatus("saving");
    try {
      const { data } = await guidyPut("/profile", values);
      if (!data || getDashboardPath(data.role) === "/") throw new Error("Invalid profile response");
      setCurrentUser(data);
      setSavedUser(data);
      setEditing(false);
      setStatus("saved");
    } catch (error) {
      setStatus("error");
      if (error.response?.status === 409) {
        setErrors({ email: "This email address is already registered." });
        setFailure("Please use another email address.");
      } else if (error.response?.status === 400) {
        setErrors(error.response.data?.fields || {});
        setFailure("Check your profile details and try again.");
      } else {
        setFailure("Your profile could not be saved. Try again.");
      }
    }
  }

  return (
    <Workspace action={profile.status === "ready" && <div id="recovery-code" tabIndex={-1}><RecoveryCode label="Recovery code" /></div>} title="My profile" description="View and update your Guidy account details.">
      <Panel title="Account overview" link={getDashboardPath(user?.role)} action="Back to dashboard" wide>
        <PanelState request={profile}>
          <div className="workspace-profile-overview">
            <span className="workspace-avatar workspace-profile-avatar" aria-hidden="true">{initials}</span>
            <div><h2>{name}</h2><p className="workspace-profile-role">{user?.role || "Account"}</p></div>
            {!editing && <button type="button" className="workspace-secondary" onClick={() => {
              setEditing(true);
              setErrors({});
              setFailure("");
              setStatus("idle");
            }}>Edit profile</button>}
          </div>
          {status === "saved" && <p role="status">Profile updated.</p>}
          {editing ? (
            <form className="workspace-profile-form" aria-label="Edit profile" onSubmit={save} aria-busy={status === "saving"} noValidate>
              <div className="workspace-profile-edit-fields">
                {inputs.map((field) => (
                  <div className="guidy-auth-field" key={field.name}><label htmlFor={"profile-" + field.name}>{field.label}</label>
                    <FieldHelp id={"profile-hint-" + field.name} label={field.label} hint={hints[field.name]}>
                    <input id={"profile-" + field.name} name={field.name} type={field.type} autoComplete={field.autoComplete} required={field.required}
                      maxLength={field.maxLength} defaultValue={user?.[field.name] ?? ""}
                      disabled={status === "saving"} aria-invalid={Boolean(errors[field.name])}
                      aria-describedby={"profile-hint-" + field.name + (errors[field.name] ? " profile-error-" + field.name : "")}
                      onChange={() => setErrors((current) => ({ ...current, [field.name]: "" }))} />
                    </FieldHelp>
                    {errors[field.name] && <span className="guidy-field-error" id={"profile-error-" + field.name}>{errors[field.name]}</span>}
                  </div>
                ))}
              </div>
              {failure && <p role="alert">{failure}</p>}
              <div className="workspace-actions">
                <button type="submit" className="workspace-button" disabled={status === "saving"}>{status === "saving" ? "Saving…" : "Save changes"}</button>
                <button type="button" className="workspace-secondary" disabled={status === "saving"} onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </form>
          ) : (
            <dl className="workspace-profile-details">
              {[["First name", user?.firstName], ["Last name", user?.lastName], ["Email", user?.email],
                ["Mobile number", user?.mobileNumber], ["Role", user?.role]].map(([label, value]) => (
                <div key={label}><dt>{label}</dt><dd>{value || "Not provided"}</dd></div>
              ))}
            </dl>
          )}
        </PanelState>
      </Panel>
      {profile.status === "ready" && <Panel title="Account security" wide><ChangePassword /></Panel>}
    </Workspace>
  );
}
