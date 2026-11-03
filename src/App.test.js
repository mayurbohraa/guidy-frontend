import { render, screen, fireEvent, within } from "@testing-library/react";

import App from "./App";

jest.mock("./Api/axios", () => ({
  __esModule: true,
  default: {}
}));
test("shows login and a path to signup", () => {
  render(<App />);
  expect(screen.getByRole("heading", {
    name: "Login"
  })).toBeInTheDocument();
  expect(screen.getByRole("link", {
    name: /create your account/i
  })).toHaveAttribute("href", "/signup");
});


beforeEach(() => {
  localStorage.clear();
  window.history.replaceState({}, "", "/");
});

test("redirects a signed-out dashboard visit to login", () => {
  window.history.replaceState({}, "", "/userdashboard");
  render(<App />);
  expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  expect(window.location.pathname).toBe("/");
});

test("handles damaged stored account data without crashing", () => {
  localStorage.setItem("login_status", "{broken");
  localStorage.setItem("token_status", "expired-session");
  window.history.replaceState({}, "", "/viewprofile");
  render(<App />);
  expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
});


test("the legacy logout URL requests confirmation without ending the session", async () => {
  localStorage.setItem("login_status",JSON.stringify({role:"admin",firstName:"Demo"}));
  localStorage.setItem("token_status","preserved-session");
  window.history.replaceState({},"","/logout");
  render(<App/>);
  const dialog=await screen.findByRole("dialog",{name:"Confirm logout"},{timeout:15000});
  expect(localStorage.getItem("token_status")).toBe("preserved-session");
  fireEvent.click(within(dialog).getByRole("button",{name:"Cancel"}));
  expect(localStorage.getItem("token_status")).toBe("preserved-session");
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
});
