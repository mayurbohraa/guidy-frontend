import { guidyGet } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { Link } from "react-router-dom";
import { Breakdown, Metric, Summary, Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

const loadLibrary = async () => {
  const { data } = await guidyGet(apiRoutes.fetchResources);
  if (!Array.isArray(data)) throw new Error("Invalid library response");
  return data;
};

const loadSubmissions = async () => {
  const { data } = await guidyGet("/resources/mine");
  if (!Array.isArray(data)) throw new Error("Invalid submissions response");
  return data;
};

const statusLabels = { pending: "Pending", accepted: "Approved", denied: "Declined" };

export default function Dashboard() {
  const submissions = useWorkspaceData(loadSubmissions);
  const library = useWorkspaceData(loadLibrary);
  const rows = Object.entries((library.data ?? []).reduce((counts, item) => {
    const year = item.year ? "Year " + item.year : "Unspecified year";
    counts[year] = (counts[year] || 0) + 1;
    return counts;
  }, {})).map(([label, count]) => ({ label, count }));
  return (
    <Workspace title="Contributor dashboard" description="Share learning materials with students.">
      <Summary>
        <Metric label="My submissions" value={submissions.data?.length} />
        <Metric label="Pending review" value={submissions.data?.filter(item => item.status === "pending").length} />
        <Metric label="Approved submissions" value={submissions.data?.filter(item => item.status === "accepted").length} />
      </Summary>
      <Panel title="My submissions" link="/contributordashboard/addresources" action="Add resource" wide>
        <PanelState request={submissions} empty={submissions.data?.length === 0 && "You have not submitted any resources yet."}>
          <div className="workspace-table"><table>
            <thead><tr><th>Resource</th><th>Course</th><th>Year</th><th>Term</th><th>Review status</th></tr></thead>
            <tbody>{submissions.data?.map(item => (
              <tr key={item._id}>
                <td>{item.resourceName}</td><td>{item.subject?.name || "Course unavailable"}</td>
                <td>{item.year ?? "—"}</td><td>{item.term || "—"}</td>
                <td><strong>{statusLabels[item.status] || "Unavailable"}</strong></td>
              </tr>
            ))}</tbody>
          </table></div>
        </PanelState>
      </Panel>
      <Panel title="Library coverage" wide>
        <PanelState request={library} empty={library.data?.length === 0 && "The approved resource library is empty."}>
          <p>Approved resources across all contributors, grouped by academic year.</p>
          <Breakdown rows={rows} total={library.data?.length ?? 0} />
        </PanelState>
      </Panel>
      <Panel title="Submit a resource">
        <p>Choose the year, term, and subject before uploading your file. An administrator reviews each submission before it becomes available to students.</p>
        <Link className="workspace-button" to="/contributordashboard/addresources">Add resource</Link>
      </Panel>
      <Panel title="Before you upload">
        <ul className="workspace-list">
          <li>Choose the course the resource belongs to.</li>
          <li>Use a descriptive filename.</li>
          <li>Check the upload limit shown on the submission form.</li>
        </ul>
      </Panel>
    </Workspace>
  );
}
