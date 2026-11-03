import { render, screen } from "@testing-library/react";

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
