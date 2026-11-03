import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { guidyPost } from "../../Api/api.service";
import AcademicFields from "../AcademicFields";
import FieldHelp from "../FieldHelp";
import { Panel, Workspace } from "../Workspace";
export default function Notebook() {
  const navigate = useNavigate();
  const [selection, setSelection] = useState({
    year: "",
    term: "",
    subject: "",
  });
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  async function save(event) {
    event.preventDefault();
    if (busy) return;
    if (!selection.subject || !title.trim() || !content.trim()) {
      setError("Choose a subject and enter a title and your notes.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      await guidyPost("/notebook/addnotebook", {
        ...selection,
        notebookTitle: title.trim(),
        notebookContent: content.trim(),
      });
      navigate("/userdashboard/notes");
    } catch {
      setError("Your notebook could not be saved. Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <Workspace
      title="Notebook"
      description="Organize your study notes by year, term, and subject."
    >
      <Panel
        title="Create notebook"
        link="/userdashboard/notes"
        action="View notebooks"
        wide
      >
        <form className="workspace-form" onSubmit={save} aria-busy={busy}>
          <AcademicFields
            selection={selection}
            setSelection={setSelection}
            disabled={busy}
          />
          <div className="guidy-auth-field">
            <label htmlFor="notebook-title">Notebook title</label>
            <FieldHelp
              id="notebook-title-hint"
              label="Notebook title"
              hint="Use a descriptive title, up to 120 characters."
            >
              <input
                id="notebook-title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                maxLength={120}
                required
                disabled={busy}
                aria-describedby="notebook-title-hint"
              />
            </FieldHelp>
          </div>
          <div className="guidy-auth-field">
            <label htmlFor="notebook-content">Study notes</label>
            <FieldHelp
              id="notebook-content-hint"
              label="Study notes"
              hint="Add your course notes in plain text. This field cannot be blank."
            >
              <textarea
                id="notebook-content"
                rows={7}
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
                disabled={busy}
                aria-describedby="notebook-content-hint"
              />
            </FieldHelp>
          </div>
          {error && <p role="alert">{error}</p>}
          <div className="workspace-actions">
            <button className="workspace-button" type="submit" disabled={busy}>
              {busy ? "Saving…" : "Save notebook"}
            </button>
          </div>
        </form>
      </Panel>
    </Workspace>
  );
}
