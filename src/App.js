import LoadingState from "./components/LoadingState";
import "react-toastify/dist/ReactToastify.css";
import {
  getCurrentUser,
  getDashboardPath,
} from "./service/Authentication.service";

import { Component, lazy, Suspense } from "react";

import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import "./assets/css/common.css";
import "./assets/css/workspace.css";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Signup from "./components/Signup";
import Logout from "./components/Logout";
import { ToastContainer } from "react-toastify";
// Keep dashboard dependencies out of the sign-in bundle until a dashboard route is opened.
const Userdashboard = lazy(() => import("./components/User/Userdashboard"));
const Contributordashboard = lazy(
  () => import("./components/Contributor/Contributordashboard"),
);
const Admindashboard = lazy(() => import("./components/Admin/Admindashboard"));
function RequireAccount({ role, children }) {
  const user = getCurrentUser();
  if (
    !user ||
    getDashboardPath(user.role) === "/" ||
    !localStorage.getItem("token_status")
  )
    return <Navigate to="/" replace />;
  if (role && user.role !== role) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }
  return children;
}
class ScreenBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (this.state.failed) {
      return (
        <main className="workspace" role="alert">
          <h1>This screen could not be displayed</h1>
          <button
            type="button"
            className="workspace-button"
            onClick={() => window.location.reload()}
          >
            Reload page
          </button>
        </main>
      );
    }
    return this.props.children;
  }
}

// Keep existing profile bookmarks inside the current role dashboard.
function ProfileRedirect() {
  const user = getCurrentUser();
  return <Navigate to={getDashboardPath(user?.role) + "/myprofile"} replace />;
}

function App() {
  return (
    <div className="App">
      <div className="AppGlass">
        <BrowserRouter>
          <ScreenBoundary>
            <Suspense fallback={<LoadingState fullPage label="Opening your workspace…" />}>
              <Routes>
                <Route exact path="/" element={<Login />} />
                <Route
                  exact
                  path="/forgotpassword"
                  element={<ForgotPassword />}
                />
                <Route
                  exact
                  path="/resetpassword"
                  element={<Navigate to="/forgotpassword" replace />}
                />
                <Route exact path="/signup" element={<Signup />} />
                <Route exact path="/logout" element={<Logout />} />
                <Route
                  exact
                  path="/userdashboard/*"
                  element={
                    <RequireAccount role="student">
                      <Userdashboard />
                    </RequireAccount>
                  }
                />
                <Route
                  exact
                  path="/contributordashboard/*"
                  element={
                    <RequireAccount role="contributor">
                      <Contributordashboard />
                    </RequireAccount>
                  }
                />
                <Route
                  exact
                  path="/admindashboard/*"
                  element={
                    <RequireAccount role="admin">
                      <Admindashboard />
                    </RequireAccount>
                  }
                />
                <Route
                  exact
                  path="/viewprofile"
                  element={
                    <RequireAccount>
                      <ProfileRedirect />
                    </RequireAccount>
                  }
                />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </ScreenBoundary>
        </BrowserRouter>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={3500}
        limit={3}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
    </div>
  );
}
export default App;
