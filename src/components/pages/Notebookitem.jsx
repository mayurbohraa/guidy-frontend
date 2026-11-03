import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { UilEdit, UilTrashAlt } from "@iconscout/react-unicons";
import Editnotebookform from "./Editnotebookform";
import Popup from "../Popup";
export default function Notebookitem({ notebook, deleteNotebook }) {
  const [content, setContent] = useState(notebook.notebookContent);
  const [editing, setEditing] = useState(false);
  const [shown, setShown] = useState(false);
  const [params] = useSearchParams();
  useEffect(() => {
    if (params.get("note") === notebook._id) setShown(true);
  }, [params, notebook._id]);
  return (
    <li className="workspace-note-card">
      <div>
        <h3>{notebook.notebookTitle || "Untitled notebook"}</h3>
        <p>
          {notebook.subject?.name || "Course unavailable"} · Year{" "}
          {notebook.year || "—"} · {notebook.term || "Term unavailable"}
        </p>
      </div>
      <div className="workspace-actions">
        <button
          type="button"
          className="workspace-secondary"
          onClick={() => setShown(true)}
        >
          View note
        </button>
        <button
          type="button"
          className="workspace-icon-button"
          aria-label={"Edit " + notebook.notebookTitle}
          onClick={() => setEditing(true)}
        >
          <UilEdit aria-hidden="true" />
        </button>
        <button
          type="button"
          className="workspace-icon-button"
          aria-label={"Delete " + notebook.notebookTitle}
          onClick={() => deleteNotebook(notebook._id)}
        >
          <UilTrashAlt aria-hidden="true" />
        </button>
      </div>
      {shown && (
        <Popup
          label={notebook.notebookTitle || "Study note"}
          handleClose={() => setShown(false)}
          content={
            <div>
              <h2>{notebook.notebookTitle}</h2>
              <p className="workspace-note-content">{content}</p>
            </div>
          }
        />
      )}
      {editing && (
        <Editnotebookform
          notebook={{ ...notebook, notebookContent: content }}
          closeEditMode={(value) => {
            if (typeof value === "string") setContent(value);
            setEditing(false);
          }}
        />
      )}
    </li>
  );
}
