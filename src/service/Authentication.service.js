import Axiosinstance from "../Api/axios";

export async function LoginApi(body) {
  const response = await Axiosinstance.post("/login", body, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}
export async function SignupApi(body) {
  const response = await Axiosinstance.post("/signup", body, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}

/** Parse persisted account data defensively after expiry or manual storage changes. */
export function getCurrentUser() {
  try {
    const user = JSON.parse(localStorage.getItem("login_status"));
    return user && typeof user === "object" && typeof user.role === "string" ? user : null;
  } catch {
    return null;
  }
}


export function getDashboardPath(role) {
  const paths = {
    student: "/userdashboard",
    contributor: "/contributordashboard",
    admin: "/admindashboard",
  };
  return Object.prototype.hasOwnProperty.call(paths, role) ? paths[role] : "/";
}


// Notify the header after an edit because storage events do not fire in the writing tab.
export function setCurrentUser(user) {
  localStorage.setItem("login_status", JSON.stringify(user));
  window.dispatchEvent(new Event("guidy:account-updated"));
}
