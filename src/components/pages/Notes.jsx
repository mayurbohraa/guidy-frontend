import { useState } from "react";
import Notebooklist from "./Notebooklist";
import { guidyDelete, guidyGet } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

const loadNotes = async () => {
  const data = (await guidyGet(apiRoutes.fetchNotebooks)).data;
  if (!Array.isArray(data)) throw new Error("Invalid list response");
  return data;
};

export default function Notes() {
  const notes = useWorkspaceData(loadNotes);
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
