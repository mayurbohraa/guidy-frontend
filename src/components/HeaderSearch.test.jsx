import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import HeaderSearch from "./HeaderSearch";
import { guidyGet } from "../Api/api.service";
jest.mock("../Api/axios", () => ({ __esModule: true, default: {} }));
jest.mock("../Api/api.service", () => ({ guidyGet: jest.fn() }));
test("searches current API courses and links to the current role's course page", async () => {
  localStorage.setItem("login_status", JSON.stringify({ role: "contributor" }));
  guidyGet.mockResolvedValue({
    data: [
      {
        id: "course:1",
        title: "Database systems",
        description: "Course · CS201",
        href: "/contributordashboard/courses/course-1",
      },
    ],
  });
  render(
    <MemoryRouter>
      <HeaderSearch />
    </MemoryRouter>,
  );
  fireEvent.change(screen.getByRole("combobox", { name: "Search workspace" }), {
    target: { value: "Database" },
  });
  const result = await screen.findByRole("option", {
    name: /Database systems/,
  });
  expect(result).toHaveAttribute(
    "href",
    "/contributordashboard/courses/course-1",
  );
  expect(guidyGet).toHaveBeenCalledWith("/search?q=Database");
  fireEvent.keyDown(screen.getByRole("combobox"), { key: "Escape" });
  expect(
    screen.queryByRole("region", { name: "Workspace search" }),
  ).not.toBeInTheDocument();
});

test("Enter on a matching page goes directly to that page", async () => {
  localStorage.setItem("login_status", JSON.stringify({ role: "student" }));
  guidyGet.mockResolvedValue({ data: [] });
  render(
    <MemoryRouter initialEntries={["/userdashboard"]}>
      <Routes>
        <Route path="/userdashboard" element={<HeaderSearch />} />
        <Route
          path="/userdashboard/myprofile"
          element={<p>Profile destination</p>}
        />
      </Routes>
    </MemoryRouter>,
  );
  const search = screen.getByRole("combobox", { name: "Search workspace" });
  fireEvent.change(search, { target: { value: "profile" } });
  fireEvent.keyDown(search, { key: "Enter" });
  expect(await screen.findByText("Profile destination")).toBeVisible();
});
