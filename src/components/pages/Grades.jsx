import { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import ChartBar from "./ChartBar";
import { guidyGet } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

const assessments = [
  ["quiz1", "Quiz 1"], ["quiz2", "Quiz 2"], ["midterm", "Midterm"],
  ["project", "Project"], ["final", "Final"],
];

export default function Grades() {
  const { courseId } = useParams();
  const [showChart, setShowChart] = useState(false);
  const load = useCallback(async () => (await guidyGet(apiRoutes.fetchGradesByCourseId(courseId))).data, [courseId]);
  const grade = useWorkspaceData(load);

  return (
    <Workspace title="Course grades" description={grade.data?.course?.name || "Review your assessment scores."}>
      <Panel title="Assessments" wide>
        <PanelState request={grade} empty={grade.status === "ready" && !grade.data && "No grades have been recorded for this course."}>
          <div className="workspace-table">
            <table>
              <thead><tr><th>Assessment</th><th>Score</th></tr></thead>
              <tbody>{assessments.map(([field, label]) => (
                <tr key={field}><td>{label}</td><td>{grade.data?.[field] == null ? "Not recorded" : grade.data[field] + "/20"}</td></tr>
              ))}</tbody>
            </table>
          </div>
          <button type="button" className="workspace-secondary" aria-expanded={showChart} onClick={() => setShowChart((shown) => !shown)}>
            {showChart ? "Hide chart" : "Show chart"}
          </button>
          {showChart && <ChartBar data={assessments.map(([field]) => grade.data?.[field])} />}
          <details className="workspace-tips">
            <summary>Tips and recommendations</summary>
            <p>Review the assessments where you scored lowest and use the approved course resources to guide your revision.</p>
          </details>
        </PanelState>
      </Panel>
    </Workspace>
  );
}
