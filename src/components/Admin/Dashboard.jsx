import { guidyGet } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { Breakdown, Metric, Summary, Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

export const loadQueue = async () => {
  const { data } = await guidyGet(apiRoutes.fetchAdminResources);
  if (!Array.isArray(data)) throw new Error("Invalid review queue");
  return data;
};

export default function Dashboard() {
  const queue = useWorkspaceData(loadQueue);
  const contributors = new Set(queue.data?.map((item) => item.user?._id).filter(Boolean)).size;
  const subjects = new Set(queue.data?.map((item) => item.subject?._id).filter(Boolean)).size;
  const rows = Object.entries((queue.data ?? []).reduce((counts, item) => {
    const term = item.term || "Unspecified term";
    counts[term] = (counts[term] || 0) + 1;
    return counts;
  }, {})).map(([label, count]) => ({ label, count }));
  return (
    <Workspace title="Admin dashboard" description="Review learning resources submitted by contributors.">
      <Summary>
        <Metric label="Pending resources" value={queue.data?.length} />
        <Metric label="Contributors awaiting review" value={queue.status === "ready" ? contributors : null} />
        <Metric label="Courses in review queue" value={queue.status === "ready" ? subjects : null} />
      </Summary>
      <Panel title="Pending reviews" link="/admindashboard/requests" action="Open requests" wide>
        <PanelState request={queue} empty={queue.data?.length === 0 && "No pending requests."}>
          <p className="workspace-count">{queue.data?.length} pending</p>
          <ul className="workspace-list">{queue.data?.slice(0, 5).map((item) => (
            <li key={item._id}><strong>{item.resourceName}</strong><span>{item.subject?.name || "Unspecified subject"}</span></li>
          ))}</ul>
          <h3>Pending submissions by term</h3>
          <Breakdown rows={rows} total={queue.data?.length ?? 0} />
        </PanelState>
      </Panel>
      <Panel title="Review workflow" wide>
        <ol className="workspace-steps">
          <li>Open a pending request and download the submitted material.</li>
          <li>Check that the file matches the selected course.</li>
          <li>Approve suitable material or decline the request.</li>
        </ol>
      </Panel>
      <Panel title="Calendar" link="/admindashboard/calender" action="Open calendar"><p>View and manage your events.</p></Panel>
      <Panel title="Tasks" link="/admindashboard/mytasks" action="Open tasks"><p>Manage your personal task list.</p></Panel>
    </Workspace>
  );
}
