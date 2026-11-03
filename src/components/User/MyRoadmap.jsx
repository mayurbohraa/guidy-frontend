import { Link } from "react-router-dom";
import { Panel, Workspace } from "../Workspace";
export default function MyRoadmap() {
  return (
    <Workspace
      title="My roadmap"
      description="Explore your academic years and choose courses for the next term."
    >
      {["First", "Second", "Third", "Fourth"].map((label, index) => (
        <Panel key={label} title={label + " year"}>
          <p className="workspace-form-help">
            Browse Fall and Spring courses for year {index + 1}.
          </p>
          <Link
            className="workspace-button"
            to={"/userdashboard/myroadmap/" + (index + 1)}
          >
            Explore year {index + 1}
          </Link>
        </Panel>
      ))}
    </Workspace>
  );
}
