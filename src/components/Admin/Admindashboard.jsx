import Sidebar from "./AdminSidebar";
import Content from "../../routes/Sidepage3";
import DashboardLayout from "../DashboardLayout";

export default function Dashboard() {
  return <DashboardLayout className="admindashboard" contentClassName="adminDash2" sidebar={<Sidebar />}>
    <Content />
  </DashboardLayout>;
}
