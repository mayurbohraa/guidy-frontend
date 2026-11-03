import Sidebar from "./ContributorSidebar";
import Content from "../../routes/Sidepage2";
import DashboardLayout from "../DashboardLayout";

export default function Dashboard() {
  return <DashboardLayout className="contributordashboard" contentClassName="contributorDash2" sidebar={<Sidebar />}>
    <Content />
  </DashboardLayout>;
}
