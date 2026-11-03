import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || (process.env.NODE_ENV === "production" ? "https://guidy-backend.vercel.app/api/v1" : "/api/v1"),
  timeout: 15000
});

// Read the token for each request so login and logout take effect without a reload.
axiosInstance.interceptors.request.use(config => {
  const token = localStorage.getItem("token_status");
  if (token && !["/login", "/signup"].includes(config.url)) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;

});
export default axiosInstance;
