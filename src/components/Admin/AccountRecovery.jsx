import { useState } from "react";
import { guidyGet, guidyPost } from "../../Api/api.service";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";
const loadRequests = async () => {
  const { data } = await guidyGet("/account-recovery");
  if (!Array.isArray(data)) throw new Error("Invalid recovery queue");
  return data;
};
export default function AccountRecovery() {
  const requests = useWorkspaceData(loadRequests);
  const [selected, setSelected] = useState(null);
  const [verified, setVerified] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  async function issue(event) {
    event.preventDefault();
    if (!verified || busy) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await guidyPost(
        `/account-recovery/${selected._id}/approve`,
        { identityVerified: true },
      );
      setMessage(response.message);
      setSelected(null);
      requests.retry();
    } catch {
      setError("The request could not be approved. Try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Workspace
      title="Account recovery"
      description="Review requests and record simulated email delivery."
    >
      <Panel title="Recovery requests" wide>
        <PanelState
          request={requests}
          empty={
            requests.data?.length === 0 && "No recovery requests are waiting."
          }
        >
          <div className="workspace-table">
            <table>
              <thead>
                <tr>
                  <th>Account</th>
                  <th>Requested</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {requests.data?.map((request) => (
                  <tr key={request._id}>
                    <td>{request.user?.email || "Account unavailable"}</td>
                    <td>{new Date(request.requestedAt).toLocaleString()}</td>
                    <td>
                      {request.status === "issued" ? "Approved · email simulated" : request.status}
                    </td>
                    <td>
                      <button
                        type="button"
                        className="workspace-secondary"
                        disabled={!request.user || busy || request.status !== "pending"}
                        onClick={() => {
                          setSelected(request);
                          setVerified(false);
                          setMessage("");
                          setError("");
                                        }}
                      >
                        Review request
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelState>
      </Panel>
      {message && <Panel title="Approval result" wide><p role="status">{message}</p></Panel>}
      {selected && (
        <Panel title="Verify account owner" wide>
          <p>{selected.user?.email}</p>
          <form className="workspace-form" onSubmit={issue}>
            <label className="workspace-checkbox">
              <input
                type="checkbox"
                checked={verified}
                onChange={(event) => setVerified(event.target.checked)}
                disabled={busy}
              />
              I have verified the account owner's identity.
            </label>
            <div className="workspace-actions">
              <button
                type="submit"
                className="workspace-button"
                disabled={!verified || busy}
              >
                {busy ? "Approving…" : "Approve and simulate email"}
              </button>
              <button
                type="button"
                className="workspace-secondary"
                disabled={busy}
                onClick={() => {
                  setSelected(null);
                  setMessage("");
                }}
              >
                Close
              </button>
            </div>
          </form>
          {error && <p role="alert">{error}</p>}

        </Panel>
      )}
    </Workspace>
  );
}
