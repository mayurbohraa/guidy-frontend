import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import Login from "./Login";
import client from "../Api/axios";

jest.mock("../Api/axios", () => ({ __esModule: true, default: { post: jest.fn() } }));

function renderLogin() {
  return render(<MemoryRouter>
    <Routes><Route path="/" element={<Login />} /><Route path="/userdashboard" element={<p>Student home</p>} /></Routes>
  </MemoryRouter>);
}

beforeEach(() => localStorage.clear());

test("shows field validation and blocks empty or invalid login requests", () => {
  renderLogin();
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(screen.getByLabelText("Email")).toHaveAccessibleDescription(expect.stringContaining("Enter your email address."));
  expect(screen.getByLabelText("Password")).toHaveAccessibleDescription(expect.stringContaining("Enter your password."));
  expect(screen.getByLabelText("Email")).toHaveFocus();
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "invalid-address" } });
  fireEvent.blur(screen.getByLabelText("Email"));
  expect(screen.getByText("Enter a valid email address, e.g. name@qu.edu.qa.")).toBeVisible();
  expect(client.post).not.toHaveBeenCalled();
  expect(screen.getByRole("link", { name: "Create your account" })).toHaveAttribute("href", "/signup");
});

test("preserves the password and blocks duplicate submissions while logging in", async () => {
  let complete;
  client.post.mockImplementation(() => new Promise((resolve) => { complete = resolve; }));
  renderLogin();
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "student@qu.edu.qa" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: " secret " } });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(screen.getByRole("button", { name: "Signing in…" })).toBeDisabled();
  expect(client.post).toHaveBeenCalledTimes(1);
  expect(client.post.mock.calls[0][1]).toEqual({ email: "student@qu.edu.qa", password: " secret " });
  await act(async () => {
    complete({ data: { data: { user: { _id: "1", role: "student", firstName: "Demo" }, token: "session-token" } } });
  });
  expect(await screen.findByText("Student home")).toBeVisible();
  expect(localStorage.getItem("token_status")).toBe("session-token");
});

test("keeps credentials available for retry after a server error", async () => {
  client.post.mockRejectedValue({ response: { status: 401 } });
  renderLogin();
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "student@qu.edu.qa" } });
  fireEvent.change(screen.getByLabelText("Password"), { target: { value: "incorrect" } });
  fireEvent.click(screen.getByRole("button", { name: "Log in" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("Check your email and password");
  expect(screen.getByLabelText("Email")).toHaveValue("student@qu.edu.qa");
  expect(screen.getByRole("button", { name: "Log in" })).toBeEnabled();
  expect(localStorage.getItem("token_status")).toBeNull();
});
