import { guidyGet } from "../../Api/api.service";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

export const loadSubmissions = async () => {
  const { data } = await guidyGet("/resources/mine");
  if (!Array.isArray(data)) throw new Error("Invalid submissions response");
  return data;
};

const statusLabels = { pending: "Pending", accepted: "Approved", denied: "Declined" };

export default function MySubmissions() {
  const submissions = useWorkspaceData(loadSubmissions);
  return <Workspace title="My submissions" description="Review the learning materials you uploaded and their approval status.">
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
  </Workspace>;
}
