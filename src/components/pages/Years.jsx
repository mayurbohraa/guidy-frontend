import { useCallback, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getCoursesApi } from "../../service/Courses.service";
import { createRegistrationApi } from "../../service/Registration.service";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";
export default function Years() {
  const { year } = useParams();
  const navigate = useNavigate();
  const load = useCallback(async () => {
    const { data } = await getCoursesApi();
    if (!Array.isArray(data)) throw new Error("Invalid courses");
    return data.filter((course) => String(course.year) === String(year));
  }, [year]);
  const courses = useWorkspaceData(load);
  const [selection, setSelection] = useState({ year, ids: [] });
  const selected = selection.year === year ? selection.ids : [];
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const term = courses.data?.find((course) =>
    selected.includes(course._id),
  )?.term;
  async function register(event) {
    event.preventDefault();
    if (busy) return;
    if (!selected.length || selected.length > 6) {
      setError(
        "Choose up to six courses from one term. Your combined registration must contain four to six courses.",
      );
      return;
    }
    setBusy(true);
    setError("");
    try {
      await createRegistrationApi({ courseIds: selected });
      navigate("/userdashboard/myschedule");
    } catch (failure) {
      setError(
        failure.response?.data?.message ||
          "Courses could not be registered. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <Workspace
      title={"Year " + year + " courses"}
      description="Choose courses from one term to plan your semester."
    >
      <Panel
        title="Course selection"
        link="/userdashboard/myroadmap"
        action="Back to roadmap"
        wide
      >
        <PanelState
          request={courses}
          empty={
            courses.data?.length === 0 &&
            "No courses are available for this year."
          }
        >
          <form onSubmit={register} className="workspace-form" aria-busy={busy}>
            <p className="workspace-form-help">
              Your registration must contain four to six courses from the same
              year and term, including any courses already registered.
            </p>
            <div className="workspace-form-grid">
              {["fall", "spring"].map((semester) => (
                <fieldset className="workspace-course-group" key={semester}>
                  <legend>
                    {semester === "fall" ? "Fall" : "Spring"} courses
                  </legend>
                  {!courses.data?.some(
                    (course) => course.term === semester,
                  ) && <p>No courses are available for this term.</p>}
                  {courses.data
                    ?.filter((course) => course.term === semester)
                    .map((course) => (
                      <article
                        key={course._id}
                        className="workspace-course-option"
                      >
                        <label className="workspace-checkbox">
                          <input
                            type="checkbox"
                            aria-label={course.name}
                            checked={selected.includes(course._id)}
                            disabled={
                              busy || Boolean(term && term !== semester)
                            }
                            onChange={(event) =>
                              setSelection({
                                year,
                                ids: event.target.checked
                                  ? [...selected, course._id]
                                  : selected.filter((id) => id !== course._id),
                              })
                            }
                          />
                          <span>{course.name}</span>
                        </label>
                        <details>
                          <summary>Course details</summary>
                          <p>
                            {course.course_code || "Code unavailable"} ·{" "}
                            {course.creditHour ?? "—"} credit hours
                          </p>
                          <p>
                            {course.course_info || "No description available."}
                          </p>
                          <p>
                            Instructor:{" "}
                            {course.instructorName || "Not provided"}
                          </p>
                        </details>
                      </article>
                    ))}
                </fieldset>
              ))}
            </div>
            {error && <p role="alert">{error}</p>}
            <div className="workspace-actions">
              <span>{selected.length} selected</span>
              <button
                className="workspace-button"
                type="submit"
                disabled={busy}
              >
                {busy ? "Registering…" : "Register for selected course"}
              </button>
            </div>
          </form>
        </PanelState>
      </Panel>
    </Workspace>
  );
}
