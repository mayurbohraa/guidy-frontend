import { useCallback } from "react";
import { useParams } from "react-router-dom";
import { guidyGet } from "../Api/api.service";
import {
  getCurrentUser,
  getDashboardPath,
} from "../service/Authentication.service";
import { Panel, PanelState, Workspace, useWorkspaceData } from "./Workspace";
export default function CourseDetails() {
  const { courseId } = useParams();
  const load = useCallback(
    async () => (await guidyGet("/course/" + courseId)).data,
    [courseId],
  );
  const course = useWorkspaceData(load);
  return (
    <Workspace
      title="Course details"
      description="Explore the course information in your Guidy catalogue."
    >
      <Panel
        title={course.data?.name || "Course information"}
        link={getDashboardPath(getCurrentUser()?.role)}
        action="Back to dashboard"
        wide
      >
        <PanelState
          request={course}
          empty={!course.data && "This course is unavailable."}
        >
          <dl className="workspace-profile-details">
            {[
              ["Code", course.data?.course_code],
              ["Year", course.data?.year],
              ["Term", course.data?.term],
              ["Credit hours", course.data?.creditHour],
              ["Instructor", course.data?.instructorName],
            ].map(([label, value]) => (
              <div key={label}>
                <dt>{label}</dt>
                <dd>{value ?? "Not provided"}</dd>
              </div>
            ))}
          </dl>
          <p className="workspace-course-note">
            {course.data?.course_info || "No description has been added."}
          </p>
        </PanelState>
      </Panel>
    </Workspace>
  );
}
