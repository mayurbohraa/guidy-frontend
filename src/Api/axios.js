import { toast } from "react-toastify";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    (process.env.NODE_ENV === "production"
      ? "https://guidy-backend.vercel.app/api/v1"
      : "/api/v1"),
  timeout: 15000,
});

// Read the token for each request so login and logout take effect without a reload.
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token_status");
  if (token && !["/login", "/signup"].includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Keep write feedback consistent across services; read failures retain their inline retry state.
const isAction = (config) =>
  config &&
  !["get", "head", "options"].includes(
    (config.method || "get").toLowerCase(),
  ) &&
  !["/grades/progress", "/profile/recovery-code"].includes(config.url);
const actionMessage = (config) => {
  const url = config.url || "";
  if (url === "/forgot-password") return "Recovery request received.";
  if (url === "/reset-password") return "Password updated.";
  if (url === "/login") return "Signed in successfully.";
  if (url === "/signup") return "Your account has been created.";
  if (url.endsWith("/approve")) return "Recovery request approved. Email delivery simulated.";
  if (url.includes("/retry")) return "Notification retry completed.";
  return config.method === "delete"
    ? "Deleted successfully."
    : "Saved successfully.";
};
axiosInstance.interceptors.response.use(
  (response) => {
    if (isAction(response.config))
      toast.success(actionMessage(response.config), {
        toastId: "action:" + response.config.url,
      });
    return response;
  },
  (error) => {
    if (isAction(error.config))
      toast.error(
        error.response?.status === 401
          ? "Your session has expired. Please sign in again."
          : error.response?.status === 403
            ? "You do not have permission to perform this action."
            : error.response?.status === 429
              ? "Please wait before trying again."
              : "The request could not be completed. Check the form and try again.",
        { toastId: "action-error:" + error.config.url },
      );
    return Promise.reject(error);
  },
);
export default axiosInstance;
