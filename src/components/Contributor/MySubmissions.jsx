import { useState } from "react";
import Popup from "../Popup";
import { downloadResource, guidyDelete, guidyGet } from "../../Api/api.service";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

export const loadSubmissions = async () => {
  const { data } = await guidyGet("/resources/mine");
  if (!Array.isArray(data)) throw new Error("Invalid submissions response");
  return data;
};

const statusLabels = { pending: "Pending", accepted: "Approved", denied: "Declined" };

export default function MySubmissions() {
  const submissions = useWorkspaceData(loadSubmissions);
  const [selected, setSelected] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function withdraw() {
    if (busy || !selected) return;
    setBusy(true);
    setError("");
    try {
      await guidyDelete("/resources/mine/" + selected._id);
      setSelected(null);
      submissions.retry();
    } catch {
      setError("Could not withdraw. Refresh to check its status.");
    } finally {
      setBusy(false);
    }
  }

  return <Workspace title="My submissions" description="Review the learning materials you uploaded and their approval status.">
      <Panel title="Uploaded resources" link="/contributordashboard/addresources" action="Add resource" wide>
        {error && !selected && <p role="alert">{error}</p>}
        <PanelState request={submissions} empty={submissions.data?.length === 0 && "You have not submitted any resources yet."}>
          <div className="workspace-table"><table>
            <thead><tr><th>Resource</th><th>Course</th><th>Year</th><th>Term</th><th>Review status</th><th>Actions</th></tr></thead>
            <tbody>{submissions.data?.map(item => (
              <tr key={item._id}>
                <td>{item.resourceName}</td><td>{item.subject?.name || "Course unavailable"}</td>
                <td>{item.year ?? "—"}</td><td>{item.term || "—"}</td>
                <td><strong>{statusLabels[item.status] || "Unavailable"}</strong></td>
                <td><div className="workspace-actions">
                  <button type="button" className="workspace-secondary" onClick={async () => {
                    setError("");
                    try { await downloadResource(item._id, item.resourceName); }
                    catch { setError("The file could not be downloaded."); }
                  }}>Download</button>
                  {item.status === "pending" && <button type="button" className="workspace-secondary" onClick={() => { setError(""); setSelected(item); }}>Withdraw</button>}
                </div></td>
              </tr>
            ))}</tbody>
          </table></div>
        </PanelState>
      </Panel>
    {selected && <Popup label="Withdraw submission" className="guidy-logout-modal"
      handleClose={() => { if (!busy) setSelected(null); }}
      content={<div className="workspace-confirm-dialog">
        <h2>Withdraw submission?</h2>
        <p>{selected.resourceName} will be removed from the review queue.</p>
        {error && <p role="alert">{error}</p>}
        <div className="workspace-actions">
          <button type="button" className="workspace-secondary" disabled={busy} onClick={() => setSelected(null)}>Keep submission</button>
          <button type="button" className="workspace-button" disabled={busy} onClick={withdraw}>{busy ? "Withdrawing…" : "Withdraw submission"}</button>
        </div>
      </div>} />}
  </Workspace>;
}
