import { useState } from "react";
import Tasklist from "../pages/Tasklist";
import Addtaskform from "../pages/Addtaskform";
import { guidyDelete, guidyGet, guidyPost } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

const loadTasks = async () => {
  const data = (await guidyGet(apiRoutes.fetchTasks)).data;
  if (!Array.isArray(data)) throw new Error("Invalid list response");
  return data;
};

export default function MyTasks() {
  const tasks = useWorkspaceData(loadTasks);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");

  async function updateTasks(action) {
    if (busy) return false;
    setBusy(true);
    setError("");
    try {
      await action();
      setConfirm(false);
      tasks.retry();
      return true;
    } catch {
      setError("The task change could not be saved. Try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  return (
    <Workspace title="My tasks" description="Add, organize, and complete your personal tasks.">
      <Panel title="Task list" wide>
        <div className="workspace-actions workspace-task-toolbar">
          <Addtaskform disabled={busy} addTask={(task) => updateTasks(() => guidyPost(apiRoutes.createTask, task))} />
          <button type="button" className="workspace-secondary workspace-danger"
            disabled={busy || !tasks.data?.length} onClick={() => setConfirm(true)}>Delete all tasks</button>
        </div>
        {confirm && (
          <div className="workspace-confirm">
            <p>Delete every task in this list? This action cannot be undone.</p>
            <div className="workspace-actions">
              <button type="button" className="workspace-secondary" disabled={busy} onClick={() => setConfirm(false)}>Cancel</button>
              <button type="button" className="workspace-button" disabled={busy}
                onClick={() => updateTasks(() => guidyDelete(apiRoutes.deleteAllTask))}>
                {busy ? "Deleting…" : "Confirm deletion"}
              </button>
            </div>
          </div>
        )}
        {error && <p role="alert">{error}</p>}
        <PanelState request={tasks} empty={tasks.data?.length === 0 && "No tasks added yet"}>
          <Tasklist tasks={tasks.data ?? []} deleteTask={(id) => updateTasks(() => guidyDelete(apiRoutes.deleteTask(id)))} />
        </PanelState>
      </Panel>
    </Workspace>
  );
}
