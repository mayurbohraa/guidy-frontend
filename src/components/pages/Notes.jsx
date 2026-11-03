import { useSearchParams } from "react-router-dom";
import { useCallback, useState } from "react";
import Notebooklist from "./Notebooklist";
import { guidyDelete, guidyGet } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

const loadNotes = async (focus) => {
  const data = (await guidyGet(apiRoutes.fetchNotebooks + (focus ? "?focus=" + encodeURIComponent(focus) : ""))).data;
  if (!Array.isArray(data)) throw new Error("Invalid list response");
  return data;
};

export default function Notes() {
  const [params] = useSearchParams();
  const focus = params.get("note");
  const load = useCallback(() => loadNotes(focus), [focus]);
  const notes = useWorkspaceData(load);
  const [failure, setFailure] = useState("");

  async function deleteNote(id) {
    setFailure("");
    try {
      await guidyDelete(apiRoutes.deleteNotebook(id));
      notes.retry();
    } catch {
      setFailure("This note could not be deleted. Try again.");
    }
  }

  return (
    <Workspace title="My notes" description="Keep your course notes together.">
      <Panel title="Saved notebooks" link="/userdashboard/notebook" action="Create notebook" wide>
        {failure && <p role="alert">{failure}</p>}
        <PanelState request={notes} empty={notes.data?.length === 0 && "No notebooks added yet."}>
          <Notebooklist notebooks={notes.data ?? []} deleteNotebook={deleteNote} />
        </PanelState>
      </Panel>
    </Workspace>
  );
}
