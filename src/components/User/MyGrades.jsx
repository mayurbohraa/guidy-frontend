import { Link } from "react-router-dom";
import { guidyGet } from "../../Api/api.service";
import apiRoutes from "../../Api/apiRoutes";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

const loadGrades = async () => {
  const data = (await guidyGet(apiRoutes.fetchGrades)).data;
  if (!Array.isArray(data)) throw new Error("Invalid list response");
  return data;
};
const assessments = ["quiz1", "quiz2", "midterm", "project", "final"];

export default function MyGrades() {
  const grades = useWorkspaceData(loadGrades);
  return (
    <Workspace title="My grades" description="Review recorded scores for your courses.">
      <Panel title="Course grades" wide>
        <PanelState request={grades} empty={grades.data?.length === 0 && "No grades available for your registered courses"}>
          <div className="workspace-table">
            <table>
              <thead><tr><th>Course</th><th>Score</th></tr></thead>
              <tbody>{grades.data?.map((grade) => (
                <tr key={grade._id}>
                  <td>{grade.course?._id
                    ? <Link to={"/userdashboard/grades/" + grade.course._id}>{grade.course.name}</Link>
                    : "Course unavailable"}</td>
                  <td>{assessments.reduce((sum, field) => sum + (grade[field] ?? 0), 0)}/100</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </PanelState>
      </Panel>
    </Workspace>
  );
}
