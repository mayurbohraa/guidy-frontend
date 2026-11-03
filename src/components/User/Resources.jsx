import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

import { downloadResource, guidyGet } from "../../Api/api.service";
import { toast } from "react-toastify";
import apiRoutes from "../../Api/apiRoutes";
const loadResources = async () => {
  const data = (await guidyGet(apiRoutes.fetchResources)).data;
  if (!Array.isArray(data)) throw new Error("Invalid list response");
  return data;
};

const Resources = () => {
  const request = useWorkspaceData(loadResources);
  return (
    <Workspace title="Resources" description="Browse approved learning materials.">
      <Panel title="Approved resources" wide>
        <PanelState request={request} empty={request.data?.length === 0 && "No resources are available yet."}>
          <div className="workspace-table">
            <table>
              <thead>
                <tr>
                  <th>Sr.</th>
                  <th>Course</th>
                  <th>File Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {request.data?.map((item, index) => {
                  return (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.subject?.name}</td>
                      <td>{item.resourceName}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => downloadResource(item._id, item.resourceName).catch(() => toast.error("File unavailable"))}
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </PanelState>
      </Panel>
    </Workspace>
  );
};
export default Resources;
