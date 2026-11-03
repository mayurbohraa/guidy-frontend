import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Navbar from "./Navbar";
import { guidyGet } from "../Api/api.service";

jest.mock("../Api/axios", () => ({ __esModule: true, default: {} }));

jest.mock("../Api/api.service", () => ({ guidyGet: jest.fn() }));

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem(
    "login_status",
    JSON.stringify({ firstName: "Demo", lastName: "Admin", role: "admin" }),
  );
});

test("shows an empty notification panel and supports keyboard closing", async () => {
  guidyGet.mockResolvedValue({ data: [] });
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
  expect(
    await screen.findByText("You have no notifications yet."),
  ).toBeVisible();
  fireEvent.keyDown(screen.getByRole("banner"), { key: "Escape" });
  expect(screen.getByRole("button", { name: "Notifications" })).toHaveAttribute(
    "aria-expanded",
    "false",
  );
  fireEvent.click(screen.getByRole("button", { name: /Demo Admin/ }));
  expect(screen.getByRole("link", { name: "My Profile" })).toBeVisible();
});

test("shows a persistent notification error with a retry action", async () => {
  guidyGet
    .mockRejectedValueOnce(new Error("Offline"))
    .mockResolvedValueOnce({ data: [] });
  render(
    <MemoryRouter>
      <Navbar />
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
  expect(await screen.findByRole("alert")).toHaveTextContent(
    "could not be loaded",
  );
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(
    await screen.findByText("You have no notifications yet."),
  ).toBeVisible();
});

test("logout only clears the session after confirmation in the dashboard popup", async () => {
  localStorage.setItem("token_status", "keep-until-confirmed");
  guidyGet.mockResolvedValue({ data: [] });
  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <Routes>
        <Route path="/dashboard" element={<Navbar />} />
        <Route path="/" element={<p>Login destination</p>} />
      </Routes>
    </MemoryRouter>,
  );
  fireEvent.click(screen.getByRole("button", { name: /Demo Admin/ }));
  fireEvent.click(screen.getByRole("button", { name: "Log Out" }));
  let dialog = screen.getByRole("dialog", { name: "Confirm logout" });
  expect(localStorage.getItem("token_status")).toBe("keep-until-confirmed");
  fireEvent.click(within(dialog).getByRole("button", { name: "Cancel" }));
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  expect(localStorage.getItem("token_status")).toBe("keep-until-confirmed");
  fireEvent.click(screen.getByRole("button", { name: /Demo Admin/ }));
  fireEvent.click(screen.getByRole("button", { name: "Log Out" }));
  dialog = screen.getByRole("dialog", { name: "Confirm logout" });
  fireEvent.click(within(dialog).getByRole("button", { name: "Log out" }));
  expect(await screen.findByText("Login destination")).toBeVisible();
  expect(localStorage.getItem("token_status")).toBeNull();
  expect(localStorage.getItem("login_status")).toBeNull();
});
