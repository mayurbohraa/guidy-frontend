import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCurrentUser,
  getDashboardPath,
} from "../service/Authentication.service";
export default function Logout() {
  const navigate = useNavigate();
  useEffect(() => {
    const root = getDashboardPath(getCurrentUser()?.role);
    navigate(root, {
      replace: true,
      state: root !== "/" ? { confirmLogout: true } : null,
    });
  }, [navigate]);
  return <p role="status">Opening account controls…</p>;
}
