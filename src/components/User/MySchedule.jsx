import { useState } from "react";
import { dropCourseApi, endSemesterApi, getRegistrationApi } from "../../service/Registration.service";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

const loadSchedule = async () => (await getRegistrationApi()).data?.courseIds?.filter(Boolean) ?? [];

export default function MySchedule() {
  const schedule = useWorkspaceData(loadSchedule);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function updateSchedule(action) {
    setBusy(true);
    setError("");
    try {
      await action();
      schedule.retry();
    } catch {
      setError("Unable to update your schedule. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Workspace title="My schedule" description="Manage your registered courses.">
      <Panel title="Registered courses" link="/userdashboard/myroadmap" action="Browse courses" wide>
        {error && <p role="alert">{error}</p>}
        <PanelState request={schedule} empty={schedule.data?.length === 0 && "You have no registered courses yet."}>
          <div className="workspace-table">
            <table>
              <thead><tr><th>Course</th><th>Year</th><th>Term</th><th>Action</th></tr></thead>
              <tbody>{schedule.data?.map((course) => (
                <tr key={course._id}>
                  <td>{course.name}</td><td>{course.year ?? "—"}</td><td>{course.term || "—"}</td>
                  <td><button type="button" className="workspace-secondary workspace-danger" disabled={busy}
                    onClick={() => updateSchedule(() => dropCourseApi(course._id))}>Drop course</button></td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          <button type="button" className="workspace-secondary workspace-danger workspace-end-semester" disabled={busy}
            onClick={() => updateSchedule(endSemesterApi)}>End semester</button>
        </PanelState>
      </Panel>
    </Workspace>
  );
}
