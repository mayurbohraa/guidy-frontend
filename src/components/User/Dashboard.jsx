import { useCallback, useState } from "react";
import { guidyGet, guidyPost } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { getRegistrationApi } from "../../service/Registration.service";
import { getEventsApi } from "../../service/Events.service";
import ChartBar from "../pages/ChartBar";
import { Breakdown, Metric, Summary, Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

const loadCourses = async () => (await getRegistrationApi()).data?.courseIds?.filter(Boolean) ?? [];
const loadTasks = async () => {
  const { data } = await guidyGet(apiRoutes.fetchTasks);
  if (!Array.isArray(data)) throw new Error("Invalid task list");
  return data;
};
const loadEvents = async () => {
  const { data } = await getEventsApi();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return data.filter((event) => new Date(event.eventDate) >= today)
    .sort((first, second) => new Date(first.eventDate) - new Date(second.eventDate));
};

export default function Dashboard() {
  const courses = useWorkspaceData(loadCourses);
  const tasks = useWorkspaceData(loadTasks);
  const events = useWorkspaceData(loadEvents);
  const [courseId, setCourseId] = useState("");
  const openTasks = tasks.data?.filter((task) => !task.checked) ?? [];
  const completedTasks = tasks.data?.filter((task) => task.checked).length ?? 0;
  const selected = courses.data?.find((course) => course._id === courseId) ?? courses.data?.[0];

  return (
    <Workspace title="Student dashboard" description="Your courses and upcoming work in one place.">
      <Summary>
        <Metric label="Registered courses" value={courses.data?.length} />
        <Metric label="Open tasks" value={tasks.status === "ready" ? openTasks.length : null} />
        <Metric label="Upcoming events" value={events.data?.length} />
      </Summary>
      <Panel title="My schedule" link="/userdashboard/myschedule" action="View full schedule" wide>
        <PanelState request={courses} empty={courses.data?.length === 0 && "You have no registered courses yet."}>
          <div className="workspace-table">
            <table>
              <thead><tr><th>Course</th><th>Year</th><th>Term</th></tr></thead>
              <tbody>{courses.data?.map((course) => (
                <tr key={course._id}>
                  <td><button type="button" className="workspace-text-button" aria-pressed={selected?._id === course._id}
                    onClick={() => setCourseId(course._id)}>{course.name}</button></td>
                  <td>{course.year ?? "—"}</td><td>{course.term || "—"}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
          {selected?.course_info && <p className="workspace-course-note">{selected.course_info}</p>}
        </PanelState>
      </Panel>
      <Panel title="Task completion">
        <PanelState request={tasks} empty={tasks.data?.length === 0 && "Add a task to start tracking your progress."}>
          <p>{completedTasks} of {tasks.data?.length} tasks completed</p>
          <Breakdown rows={[{ label: "Completed", count: completedTasks }, { label: "Open", count: openTasks.length }]}
            total={tasks.data?.length ?? 0} />
        </PanelState>
      </Panel>
      <Panel title="Next event" link="/userdashboard/calender" action="Open calendar">
        <PanelState request={events} empty={events.data?.length === 0 && "There are no upcoming events."}>
          <h3>{events.data?.[0]?.eventName}</h3>
          {events.data?.[0] && <p>{new Date(events.data[0].eventDate).toLocaleDateString()} · {events.data[0].eventType}</p>}
        </PanelState>
      </Panel>
      <Panel title="Open tasks" link="/userdashboard/mytasks" action="View all tasks">
        <PanelState request={tasks} empty={tasks.status === "ready" && openTasks.length === 0 && "You have no open tasks."}>
          <ul className="workspace-list">{openTasks.slice(0, 5).map((task) => <li key={task._id}>{task.taskDescription}</li>)}</ul>
        </PanelState>
      </Panel>
      <Panel title="Upcoming events" link="/userdashboard/calender" action="View calendar">
        <PanelState request={events} empty={events.data?.length === 0 && "There are no upcoming events."}>
          <ul className="workspace-list">{events.data?.slice(0, 5).map((event) => (
            <li key={event._id}><strong>{event.eventName}</strong><span>{new Date(event.eventDate).toLocaleDateString()}</span></li>
          ))}</ul>
        </PanelState>
      </Panel>
      <Panel title="Course performance" link="/userdashboard/mygrades" action="View grades">
        <PanelState request={courses} empty={courses.data?.length === 0 && "Register a course to see its performance."}>
          {selected && <CoursePerformance key={selected._id} course={selected} />}
        </PanelState>
      </Panel>
      <OverAllProgress />
    </Workspace>
  );
}

function CoursePerformance({ course }) {
  const load = useCallback(async () => (await guidyGet(apiRoutes.fetchGradesByCourseId(course._id))).data, [course._id]);
  const grade = useWorkspaceData(load);
  const scores = grade.data;
  return (
    <PanelState request={grade} empty={grade.status === "ready" && !scores && "No grades have been recorded for this course."}>
      <p>{course.name}</p>
      {scores && <ChartBar data={[scores.quiz1, scores.quiz2, scores.midterm, scores.project, scores.final]} />}
    </PanelState>
  );
}

function OverAllProgress() {
  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");
  const [result, setResult] = useState({ status: "idle" });

  async function calculate(event) {
    event.preventDefault();
    if (result.status === "loading") return;
    setResult({ status: "loading" });
    try {
      const response = await guidyPost(apiRoutes.getProgress, { year, sem: term });
      if (!Number.isFinite(response.data)) throw new Error("Invalid progress");
      setResult({ status: "ready", value: response.data });
    } catch {
      setResult({ status: "error" });
    }
  }

  return (
    <Panel title="Overall progress">
      <p className="workspace-form-help">Average your recorded assessment scores across a year or term.</p>
      <form className="workspace-progress-form" onSubmit={calculate}>
        <label>Year
          <select value={year} onChange={(event) => setYear(event.target.value)} disabled={result.status === "loading"}>
            <option value="">All years</option>
            {[1, 2, 3, 4].map((value) => <option key={value} value={value}>Year {value}</option>)}
          </select>
        </label>
        <label>Term
          <select value={term} onChange={(event) => setTerm(event.target.value)} disabled={result.status === "loading"}>
            <option value="">All terms</option><option value="fall">Fall</option><option value="spring">Spring</option>
          </select>
        </label>
        <button type="submit" className="workspace-button" disabled={result.status === "loading"}>
          {result.status === "loading" ? "Calculating…" : result.status === "error" ? "Try again" : "Show progress"}
        </button>
      </form>
      {result.status === "error" && <p role="alert">Progress could not be loaded. Try again.</p>}
      {result.status === "ready" && <div className="workspace-progress-result" role="status">
        <strong>{result.value.toFixed(1)}%</strong>
        <progress value={Math.min(100, Math.max(0, result.value))} max={100} aria-label="Overall progress" />
      </div>}
      {result.status === "idle" && <p className="workspace-state">Choose a filter and select Show progress.</p>}
    </Panel>
  );
}
