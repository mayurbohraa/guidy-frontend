import { useEffect, useState } from "react";
import { guidyGet, guidyPost } from "../../Api/api.service";
import { getRegistrationApi } from "../../service/Registration.service";
import { PanelState, useWorkspaceData } from "../Workspace";
import FieldHelp from "../FieldHelp";
const assessments = [
  ["quiz1", "Quiz 1"],
  ["quiz2", "Quiz 2"],
  ["midterm", "Midterm"],
  ["project", "Project"],
  ["final", "Final"],
];
const loadCourses = async () =>
  (await getRegistrationApi()).data?.courseIds?.filter(Boolean) ?? [];
export default function GradeEntry({ onSaved, onCancel }) {
  const courses = useWorkspaceData(loadCourses);
  const [course, setCourse] = useState("");
  const [scores, setScores] = useState({});
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  useEffect(() => {
    if (!course) return;
    let active = true;
    setStatus("loading");
    setError("");
    setScores({});
    guidyGet("/grades/" + course)
      .then(({ data }) => {
        if (active) {
          setScores(
            Object.fromEntries(
              assessments.map(([field]) => [field, data?.[field] ?? ""]),
            ),
          );
          setStatus("ready");
        }
      })
      .catch(() => {
        if (active) {
          setStatus("error");
          setError(
            "Existing scores could not be loaded. Select the course again to retry.",
          );
        }
      });
    return () => {
      active = false;
    };
  }, [course]);
  async function save(event) {
    event.preventDefault();
    if (status !== "ready") return;
    const values = Object.fromEntries(
      assessments.map(([field]) => [field, Number(scores[field])]),
    );
    if (
      !course ||
      assessments.some(
        ([field]) =>
          scores[field] === "" ||
          scores[field] == null ||
          !Number.isFinite(values[field]) ||
          values[field] < 0 ||
          values[field] > 20,
      )
    ) {
      setError("Enter all five scores as numbers from 0 to 20.");
      return;
    }
    setStatus("saving");
    setError("");
    try {
      await guidyPost("/grades", { course, ...values });
      onSaved();
    } catch (failure) {
      setStatus("ready");
      setError(
        failure.response?.status === 400
          ? "The course must be registered and every score must be between 0 and 20."
          : "Scores could not be saved. Try again.",
      );
    }
  }
  return (
    <PanelState
      request={courses}
      empty={
        courses.data?.length === 0 && "Register courses before adding scores."
      }
    >
      <form
        className="workspace-form"
        onSubmit={save}
        aria-busy={status === "saving"}
      >
        <p className="workspace-form-help">
          Record your own study-tracker scores. Each assessment is out of 20.
        </p>
        <label>
          Registered course
          <select
            value={course}
            onChange={(event) => setCourse(event.target.value)}
            required
            disabled={status === "saving"}
          >
            <option value="">Choose a course</option>
            {courses.data?.map((item) => (
              <option key={item._id} value={item._id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        {status === "loading" && <p role="status">Loading recorded scores…</p>}
        <div className="workspace-form-grid">
          {assessments.map(([field, label]) => (
            <div className="guidy-auth-field" key={field}>
              <label htmlFor={"score-" + field}>{label}</label>
              <FieldHelp
                id={"score-hint-" + field}
                label={label}
                hint="Enter a score from 0 to 20. Decimals are allowed."
              >
                <input
                  id={"score-" + field}
                  type="number"
                  min="0"
                  max="20"
                  step="0.01"
                  value={scores[field] ?? ""}
                  onChange={(event) =>
                    setScores((current) => ({
                      ...current,
                      [field]: event.target.value,
                    }))
                  }
                  required
                  disabled={status !== "ready"}
                  aria-describedby={"score-hint-" + field}
                />
              </FieldHelp>
            </div>
          ))}
        </div>
        {error && <p role="alert">{error}</p>}
        <div className="workspace-actions">
          <button
            type="submit"
            className="workspace-button"
            disabled={status !== "ready"}
          >
            {status === "saving" ? "Saving…" : "Save scores"}
          </button>
          <button
            type="button"
            className="workspace-secondary"
            onClick={onCancel}
            disabled={status === "saving"}
          >
            Cancel
          </button>
        </div>
      </form>
    </PanelState>
  );
}
