import { useSearchParams } from "react-router-dom";
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
  const [params, setParams] = useSearchParams();
  const search = params.get("search") || "";
  const visible = request.data?.filter(
    (item) =>
      !search || item.resourceName.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <Workspace
      title="Resources"
      description="Browse approved learning materials."
    >
      <Panel title="Approved resources" wide>
        {search && (
          <p className="workspace-form-help">
            Showing results for “{search}”.{" "}
            <button
              type="button"
              className="workspace-text-button"
              onClick={() => setParams({})}
            >
              Show all resources
            </button>
          </p>
        )}
        <PanelState
          request={request}
          empty={
            visible?.length === 0 &&
            (search
              ? "No matching resources."
              : "No resources are available yet.")
          }
        >
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
                {visible?.map((item, index) => {
                  return (
                    <tr key={item._id}>
                      <td>{index + 1}</td>
                      <td>{item.subject?.name}</td>
                      <td>{item.resourceName}</td>
                      <td>
                        <button
                          type="button"
                          className="workspace-secondary"
                          onClick={() =>
                            downloadResource(item._id, item.resourceName).catch(
                              () => toast.error("File unavailable"),
                            )
                          }
                        >
                          Download
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
