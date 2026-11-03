import { useState } from "react";
import Popup from "./Popup";
import FieldHelp from "./FieldHelp";
export default function TextEditDialog({
  title,
  initialValue,
  hint,
  maxLength,
  multiline,
  save,
  close,
}) {
  const [value, setValue] = useState(initialValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function submit(event) {
    event.preventDefault();
    if (busy) return;
    if (!value.trim()) {
      setError("This field cannot be blank.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await save(value.trim());
      close(value.trim());
    } catch {
      setError("This change could not be saved. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  const properties = {
    id: "text-edit-value",
    value,
    onChange: (event) => setValue(event.target.value),
    required: true,
    disabled: busy,
    maxLength,
    "aria-describedby": "text-edit-hint",
  };
  return (
    <Popup
      label={title}
      className="guidy-edit-modal"
      handleClose={() => {
        if (!busy) close();
      }}
      content={
        <div>
          <h2>{title}</h2>
          <form className="workspace-form" onSubmit={submit} aria-busy={busy}>
            <div className="guidy-auth-field">
              <label htmlFor="text-edit-value">
                {multiline ? "Study notes" : "Task description"}
              </label>
              <FieldHelp
                id="text-edit-hint"
                label={multiline ? "Study notes" : "Task description"}
                hint={hint}
              >
                {multiline ? (
                  <textarea {...properties} rows={6} />
                ) : (
                  <input {...properties} />
                )}
              </FieldHelp>
            </div>
            {error && <p role="alert">{error}</p>}
            <div className="workspace-actions">
              <button
                className="workspace-secondary"
                type="button"
                disabled={busy}
                onClick={() => close()}
              >
                Cancel
              </button>
              <button
                className="workspace-button"
                type="submit"
                disabled={busy}
              >
                {busy ? "Saving…" : "Save changes"}
              </button>
            </div>
          </form>
        </div>
      }
    />
  );
}
