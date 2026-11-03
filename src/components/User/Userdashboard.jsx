import Sidebar from "./UserSidebar";
import Content from "../../routes/Sidepage";
import DashboardLayout from "../DashboardLayout";

export default function Dashboard() {
  return <DashboardLayout className="userdashboard" contentClassName="userDash2" sidebar={<Sidebar />}>
    <Content />
  </DashboardLayout>;
}
