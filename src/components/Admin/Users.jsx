import { useSearchParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { guidyGet } from "../../Api/api.service";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";
export default function Users() {
  const [params] = useSearchParams();
  const [role, setRole] = useState(
    params.get("role") === "contributor" ? "contributor" : "student",
  );
  const [search, setSearch] = useState(params.get("search") || "");
  const [query, setQuery] = useState(params.get("search") || "");
  const [page, setPage] = useState(1);
  useEffect(() => {
    setRole(params.get("role") === "contributor" ? "contributor" : "student");
    setSearch(params.get("search") || "");
    setQuery(params.get("search") || "");
    setPage(1);
  }, [params]);
  const load = useCallback(async () => {
    const response = await guidyGet(
      `/users?role=${role}&search=${encodeURIComponent(query)}&page=${page}&limit=15`,
    );
    if (!Array.isArray(response.data)) throw new Error("Invalid user list");
    return response;
  }, [role, query, page]);
  const users = useWorkspaceData(load);
  return (
    <Workspace
      title="Users"
      description="View student and contributor accounts registered with Guidy."
    >
      <Panel title="Account directory" wide>
        <div className="workspace-user-toolbar">
          <div className="workspace-actions" aria-label="Account type">
            {[
              ["student", "Students"],
              ["contributor", "Contributors"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                className={
                  role === value ? "workspace-button" : "workspace-secondary"
                }
                aria-pressed={role === value}
                onClick={() => {
                  setRole(value);
                  setPage(1);
                }}
              >
                {label}
              </button>
            ))}
          </div>
          <form
            className="workspace-actions workspace-directory-search"
            onSubmit={(event) => {
              event.preventDefault();
              setQuery(search.trim());
              setPage(1);
            }}
          >
            <input
              type="search"
              aria-label="Search users"
              placeholder="Search name, email, or mobile"
              value={search}
              maxLength={100}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button className="workspace-secondary" type="submit">
              Search
            </button>
          </form>
        </div>
        <PanelState
          request={users}
          empty={
            users.data?.data.length === 0 &&
            (query
              ? "No accounts match your search."
              : `No ${role === "student" ? "students" : "contributors"} are registered yet.`)
          }
        >
          <p className="workspace-form-help">
            {users.data?.pagination.total ?? 0} matching accounts
          </p>
          <div className="workspace-table">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Mobile number</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {users.data?.data.map((user) => (
                  <tr key={user._id}>
                    <td>
                      {[user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ") || "Not provided"}
                    </td>
                    <td>{user.email || "Not provided"}</td>
                    <td>{user.mobileNumber || "Not provided"}</td>
                    <td className="workspace-profile-role">{user.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelState>
        <div className="workspace-actions workspace-pagination">
          <button
            className="workspace-secondary"
            type="button"
            disabled={page === 1 || users.status !== "ready"}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            className="workspace-secondary"
            type="button"
            disabled={
              users.status !== "ready" || !users.data?.pagination.hasNext
            }
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </button>
        </div>
      </Panel>
    </Workspace>
  );
}
