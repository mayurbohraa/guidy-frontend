import { useState } from "react";
import { guidyGet } from "../Api/api.service";
import Popup from "./Popup";

export default function RecoveryCode({ label = "Reveal recovery code" }) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  async function reveal() {
    if (busy) return;
    setOpen(true);
    setCopied(false);
    setBusy(true);
    setError("");
    try {
      const { data } = await guidyGet("/profile/recovery-code");
      setCode(data.code);
    } catch {
      setError("The recovery code could not be loaded. Close this dialog and try again.");
    } finally {
      setBusy(false);
    }
  }

  return <>
    <button type="button" className="workspace-secondary" onClick={reveal}>{label}</button>
    {open && <Popup label="Recovery code" className="guidy-logout-modal" handleClose={() => {
      if (!busy) { setOpen(false); setCode(""); setError(""); }
    }} content={<div className="workspace-confirm-dialog">
      <h2>Your recovery code</h2>
      {busy && <p role="status">Loading code…</p>}
      {error && <p role="alert">{error}</p>}
      {code && <><p><code>{code}</code></p>
        <button type="button" className="workspace-button" onClick={async () => {
          try { await navigator.clipboard.writeText(code); setCopied(true); }
          catch { setError("Copy failed. Select the code to copy it manually."); }
        }}>Copy code</button>
        {copied && <p role="status">Code copied.</p>}<p>Save this code somewhere private. It changes when you change or reset your password.</p></>}
    </div>} />}
  </>;
}
