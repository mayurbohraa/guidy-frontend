import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { guidyGet, guidyPut } from "../Api/api.service";
import { getRegistrationApi } from "../service/Registration.service";
import { getEventsApi } from "../service/Events.service";

jest.mock("../Api/axios", () => ({ __esModule: true, default: {} }));
jest.mock("../Api/api.service", () => ({ guidyGet: jest.fn(), guidyPut: jest.fn() }));
jest.mock("../service/Registration.service", () => ({
  getRegistrationApi: jest.fn().mockResolvedValue({ data: null }),
}));
jest.mock("../service/Events.service", () => ({
  getEventsApi: jest.fn().mockResolvedValue({ data: [] }),
}));

jest.setTimeout(15000);

beforeEach(() => {
  localStorage.clear();
  guidyGet.mockImplementation((url) => Promise.resolve({
    data: url === "/profile" ? JSON.parse(localStorage.getItem("login_status")) : [],
  }));
  getRegistrationApi.mockResolvedValue({ data: null });
  getEventsApi.mockResolvedValue({ data: [] });
});

test.each([
  ["student", "/userdashboard", "Student dashboard"],
  ["contributor", "/contributordashboard", "Contributor dashboard"],
  ["admin", "/admindashboard", "Admin dashboard"],
])("keeps the %s profile inside the dashboard and provides a reliable return", async (role, root, title) => {
  localStorage.setItem("login_status", JSON.stringify({ role, firstName: "Demo", lastName: "Account" }));
  localStorage.setItem("token_status", "demo-session");
  window.history.replaceState({}, "", root + "/myprofile");
  render(<App />);

  expect(await screen.findByRole("heading", { name: "My profile" }, { timeout: 10000 })).toBeVisible();
  expect(screen.getByRole("button", { name: "Notifications" })).toBeVisible();
  await waitFor(() => expect(screen.queryAllByRole("status", { hidden: true })).toHaveLength(0));
  expect(screen.getByRole("navigation")).toBeVisible();
  expect(screen.getAllByText("Not provided", { selector: "dd" })).toHaveLength(2);
  const back = screen.getByRole("link", { name: "Back to dashboard" });
  expect(back).toHaveAttribute("href", root);
  fireEvent.click(back);
  expect(await screen.findByRole("heading", { name: title }, { timeout: 10000 })).toBeVisible();
  await waitFor(() => expect(screen.queryAllByRole("status", { hidden: true })).toHaveLength(0));
});

test("redirects the original profile URL into the current dashboard", async () => {
  localStorage.setItem("login_status", JSON.stringify({ role: "admin", firstName: "Demo" }));
  localStorage.setItem("token_status", "demo-session");
  window.history.replaceState({}, "", "/viewprofile");
  render(<App />);
  expect(await screen.findByRole("heading", { name: "My profile" }, { timeout: 10000 })).toBeVisible();
  expect(window.location.pathname).toBe("/admindashboard/myprofile");
  await waitFor(() => expect(screen.queryAllByRole("status", { hidden: true })).toHaveLength(0));
});


test("saves profile edits through the API and updates the header", async () => {
  localStorage.setItem("login_status", JSON.stringify({
    _id: "1", role: "contributor", firstName: "Demo", lastName: "User", email: "demo@qu.edu.qa", mobileNumber: "",
  }));
  localStorage.setItem("token_status", "demo-session");
  window.history.replaceState({}, "", "/contributordashboard/myprofile");
  guidyPut.mockResolvedValue({ data: {
    _id: "1", role: "contributor", firstName: "Updated", lastName: "User", email: "demo@qu.edu.qa", mobileNumber: "",
  } });
  render(<App />);
  fireEvent.click(await screen.findByRole("button", { name: "Edit profile" }, { timeout: 10000 }));
  fireEvent.change(screen.getByLabelText("First name"), { target: { value: "Updated" } });
  fireEvent.click(screen.getByRole("button", { name: "Save changes" }));
  expect(await screen.findByText("Profile updated.")).toBeVisible();
  expect(guidyPut).toHaveBeenCalledWith("/profile", {
    firstName: "Updated", lastName: "User", email: "demo@qu.edu.qa", mobileNumber: "",
  });
  expect(JSON.parse(localStorage.getItem("login_status")).firstName).toBe("Updated");
  expect(screen.getByRole("button", { name: "Updated User" })).toBeVisible();
});
