import { useState } from "react";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";
import { downloadResource, guidyPost } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { loadQueue } from "./Dashboard";

export default function Requests() {
  const request = useWorkspaceData(loadQueue);
  const [updating, setUpdating] = useState(false);
  const [failure, setFailure] = useState("");

  async function review(id, status) {
    setUpdating(true);
    setFailure("");
    try {
      await guidyPost(apiRoutes.updateResource(id), { status });
      request.retry();
    } catch {
      setFailure("Unable to update this request. Try again.");
    } finally {
      setUpdating(false);
    }
  }

  return (
    <Workspace title="Resource requests" description="Review learning materials submitted by contributors.">
      <Panel title="Pending requests" wide>
        {failure && <p role="alert">{failure}</p>}
        <PanelState request={request} empty={request.data?.length === 0 && "No pending requests. New submissions will appear here."}>
          <div className="workspace-table">
            <table>
              <thead><tr><th>File</th><th>Course</th><th>Contributor</th><th>Actions</th></tr></thead>
              <tbody>{request.data?.map((item) => (
                <tr key={item._id}>
                  <td>{item.resourceName}</td>
                  <td>{item.subject?.name || "Unspecified subject"}</td>
                  <td>{[item.user?.firstName, item.user?.lastName].filter(Boolean).join(" ") || "Unknown contributor"}</td>
                  <td><div className="workspace-actions">
                    <button type="button" className="workspace-secondary" onClick={() => {
                      setFailure("");
                      downloadResource(item._id, item.resourceName).catch(() => setFailure("This file is unavailable."));
                    }}>Download</button>
                    <button type="button" className="workspace-button" disabled={updating} onClick={() => review(item._id, "accepted")}>Approve</button>
                    <button type="button" className="workspace-secondary workspace-danger" disabled={updating} onClick={() => review(item._id, "denied")}>Decline</button>
                  </div></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </PanelState>
      </Panel>
    </Workspace>
  );
}
