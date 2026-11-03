import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";
import { guidyGet } from "../Api/api.service";

jest.mock("../Api/axios", () => ({ __esModule: true, default: {} }));

jest.mock("../Api/api.service", () => ({ guidyGet: jest.fn() }));

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem("login_status", JSON.stringify({ firstName: "Demo", lastName: "Admin", role: "admin" }));
});

test("shows an empty notification panel and supports keyboard closing", async () => {
  guidyGet.mockResolvedValue({ data: [] });
  render(<MemoryRouter><Navbar /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
  expect(await screen.findByText("You have no notifications yet.")).toBeVisible();
  fireEvent.keyDown(screen.getByRole("banner"), { key: "Escape" });
  expect(screen.getByRole("button", { name: "Notifications" })).toHaveAttribute("aria-expanded", "false");
  fireEvent.click(screen.getByRole("button", { name: /Demo Admin/ }));
  expect(screen.getByRole("link", { name: "My Profile" })).toBeVisible();
});

test("shows a persistent notification error with a retry action", async () => {
  guidyGet.mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce({ data: [] });
  render(<MemoryRouter><Navbar /></MemoryRouter>);
  fireEvent.click(screen.getByRole("button", { name: "Notifications" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("could not be loaded");
  fireEvent.click(screen.getByRole("button", { name: "Try again" }));
  expect(await screen.findByText("You have no notifications yet.")).toBeVisible();
});
