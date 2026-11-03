import { useEffect, useState } from "react";
import { guidyGet } from "../Api/api.service";
import apiRoutes from "../Api/apiRoutes";

export default function AcademicFields({ selection, setSelection, disabled }) {
  const { year, term, subject } = selection;
  const [subjects, setSubjects] = useState({ status: "idle", data: [] });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    if (!year || !term) {
      setSubjects({ status: "idle", data: [] });
      return;
    }
    setSubjects({ status: "loading", data: [] });
    guidyGet(apiRoutes.getSubjects(term, year))
      .then(({ data }) => {
        if (!Array.isArray(data)) throw new Error("Invalid subjects");
        if (active) setSubjects({ status: "ready", data });
      })
      .catch(() => {
        if (active) setSubjects({ status: "error", data: [] });
      });
    return () => {
      active = false;
    };
  }, [year, term, attempt]);
  return (
    <>
      <div className="workspace-form-grid">
        <label>
          Year
          <select
            value={year}
            required
            disabled={disabled}
            onChange={(event) =>
              setSelection({ year: event.target.value, term: "", subject: "" })
            }
          >
            <option value="">Choose year</option>
            {[1, 2, 3, 4].map((value) => (
              <option key={value} value={String(value)}>
                Year {value}
              </option>
            ))}
          </select>
        </label>
        <label>
          Term
          <select
            value={term}
            required
            disabled={disabled || !year}
            onChange={(event) =>
              setSelection({ year, term: event.target.value, subject: "" })
            }
          >
            <option value="">Choose term</option>
            <option value="fall">Fall</option>
            <option value="spring">Spring</option>
          </select>
        </label>
      </div>
      <label>
        Subject
        <select
          value={subject}
          required
          disabled={disabled || subjects.status !== "ready"}
          onChange={(event) =>
            setSelection({ ...selection, subject: event.target.value })
          }
        >
          <option value="">Choose subject</option>
          {subjects.data.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name}
            </option>
          ))}
        </select>
      </label>
      {subjects.status === "loading" && <p role="status">Loading subjects…</p>}
      {subjects.status === "ready" && !subjects.data.length && (
        <p>No subjects are available for this term.</p>
      )}
      {subjects.status === "error" && (
        <p role="alert">
          Subjects could not be loaded.{" "}
          <button
            type="button"
            className="workspace-secondary"
            onClick={() => setAttempt((value) => value + 1)}
          >
            Try again
          </button>
        </p>
      )}
    </>
  );
}
