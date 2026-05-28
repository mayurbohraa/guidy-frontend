import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import "../src/assets/css/common.css";

import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import Signup from "./components/Signup";
import Userdashboard from "./components/User/Userdashboard";
import Contributordashboard from "./components/Contributor/Contributordashboard";
import Admindashboard from "./components/Admin/Admindashboard";
import ViewProfile from "./components/ViewProfile";
import Logout from "./components/Logout";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <div className="App">
      <div className="AppGlass">
        <BrowserRouter>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route exact path="/forgotpassword" element={<ForgotPassword />} />
            <Route exact path="/resetpassword" element={<ResetPassword />} />
            <Route exact path="/signup" element={<Signup />} />
            <Route exact path="/logout" element={<Logout />} />
            <Route exact path="/userdashboard/*" element={<Userdashboard />} />
            <Route
              exact
              path="/contributordashboard/*"
              element={<Contributordashboard />}
            />
            <Route
              exact
              path="/admindashboard/*"
              element={<Admindashboard />}
            />
            <Route exact path="/viewprofile" element={<ViewProfile />} />
          </Routes>
        </BrowserRouter>
        <span style={{ position: "absolute" }}>
          <ToastContainer style={{ fontSize: "15px" }} />
        </span>
      </div>
    </div>
  );
}

export default App;
