import { useRef, useState } from "react";
import { guidyGet, guidyPut } from "../../Api/api.service";
import AcademicFields from "../AcademicFields";
import FieldHelp from "../FieldHelp";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";
const loadSettings = async () => {
  const { data } = await guidyGet("/settings");
  if (!Number.isFinite(data?.uploadMaxBytes))
    throw new Error("Upload settings unavailable");
  return data;
};
export default function AddResources() {
  const settings = useWorkspaceData(loadSettings);
  const [selection, setSelection] = useState({
    year: "",
    term: "",
    subject: "",
  });
  const input = useRef();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const maxMB = settings.data?.uploadMaxBytes / 1024 / 1024;
  async function submit(event) {
    event.preventDefault();
    if (status === "saving") return;
    const file = input.current.files[0];
    if (
      !selection.subject ||
      !file ||
      file.size > settings.data.uploadMaxBytes
    ) {
      setStatus("error");
      setMessage(`Choose a subject and a file no larger than ${maxMB} MB.`);
      return;
    }
    setStatus("saving");
    setMessage("");
    try {
      const body = new FormData();
      body.append("file", file, file.name);
      for (const [key, value] of Object.entries(selection))
        body.append(key, value);
      await guidyPut("/resources", body);
      setSelection({ year: "", term: "", subject: "" });
      input.current.value = "";
      setStatus("ready");
      setMessage("Resource submitted for review.");
    } catch (error) {
      setStatus("error");
      setMessage(
        [400, 413, 503].includes(error.response?.status)
          ? error.response.data?.message || "Check the file format and size."
          : "Your resource could not be uploaded. Please try again.",
      );
    }
  }
  return (
    <Workspace
      title="Add resources"
      description="Share course materials for administrator review."
    >
      <Panel title="New submission" wide>
        <PanelState request={settings}>
          <form
            className="workspace-form"
            onSubmit={submit}
            aria-busy={status === "saving"}
          >
            <AcademicFields
              selection={selection}
              setSelection={setSelection}
              disabled={status === "saving"}
            />
            <div className="guidy-auth-field">
              <label htmlFor="resource-file">Resource file</label>
              <FieldHelp
                id="resource-file-hint"
                label="Resource file"
                hint={`PDF, TXT, PNG, JPG, Word, PowerPoint, Excel, or ZIP. Maximum ${maxMB} MB. File contents must match the selected format.`}
              >
                <input
                  id="resource-file"
                  ref={input}
                  type="file"
                  accept={settings.data?.allowedExtensions?.join(",")}
                  required
                  disabled={status === "saving"}
                  aria-describedby="resource-file-hint"
                />
              </FieldHelp>
            </div>
            <p className="workspace-form-help">
              Maximum {maxMB} MB. Your file is saved securely and becomes
              available to students after approval.
            </p>
            {message && (
              <p role={status === "error" ? "alert" : "status"}>{message}</p>
            )}
            <button
              type="submit"
              className="workspace-button"
              disabled={status === "saving"}
            >
              {status === "saving" ? "Submitting…" : "Submit resource"}
            </button>
          </form>
        </PanelState>
      </Panel>
    </Workspace>
  );
}
