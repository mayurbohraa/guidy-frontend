import { guidyGet } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { Link } from "react-router-dom";
import { Breakdown, Metric, Summary, Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

const loadLibrary = async () => {
  const { data } = await guidyGet(apiRoutes.fetchResources);
  if (!Array.isArray(data)) throw new Error("Invalid library response");
  return data;
};

export default function Dashboard() {
  const library = useWorkspaceData(loadLibrary);
  const subjects = new Set(library.data?.map((item) => item.subject?._id).filter(Boolean)).size;
  const rows = Object.entries((library.data ?? []).reduce((counts, item) => {
    const year = item.year ? "Year " + item.year : "Unspecified year";
    counts[year] = (counts[year] || 0) + 1;
    return counts;
  }, {})).map(([label, count]) => ({ label, count }));
  return (
    <Workspace title="Contributor dashboard" description="Share learning materials with students.">
      <Summary>
        <Metric label="Approved library resources" value={library.data?.length} />
        <Metric label="Courses with approved resources" value={library.status === "ready" ? subjects : null} />
      </Summary>
      <Panel title="Library coverage" wide>
        <PanelState request={library} empty={library.data?.length === 0 && "The approved resource library is empty."}>
          <p>Approved resources across all contributors, grouped by academic year.</p>
          <Breakdown rows={rows} total={library.data?.length ?? 0} />
        </PanelState>
      </Panel>
      <Panel title="Submit a resource" wide>
        <p>Choose the year, term, and subject before uploading your file. An administrator reviews each submission before it becomes available to students.</p>
        <Link className="workspace-button" to="/contributordashboard/addresources">Add resource</Link>
      </Panel>
      <Panel title="Before you upload">
        <ul className="workspace-list">
          <li>Choose the course the resource belongs to.</li>
          <li>Use a descriptive filename.</li>
          <li>Keep the file within 10 MB.</li>
        </ul>
      </Panel>
    </Workspace>
  );
}
