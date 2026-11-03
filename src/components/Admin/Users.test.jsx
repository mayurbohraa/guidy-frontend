import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Users from "./Users";
import { guidyGet } from "../../Api/api.service";
jest.mock("../../Api/api.service", () => ({ guidyGet: jest.fn() }));
test("shows student details, switches to contributors, and searches the selected role", async () => {
  guidyGet.mockImplementation((url) =>
    Promise.resolve({
      data: [
        url.includes("contributor")
          ? {
              _id: "2",
              firstName: "Demo",
              lastName: "Contributor",
              email: "contributor@qu.edu.qa",
              mobileNumber: "+97455123456",
              role: "contributor",
            }
          : {
              _id: "1",
              firstName: "Demo",
              lastName: "Student",
              email: "student@qu.edu.qa",
              role: "student",
            },
      ],
      pagination: { page: 1, total: 1, hasNext: false },
    }),
  );
  render(
    <MemoryRouter>
      <Users />
    </MemoryRouter>,
  );
  expect(await screen.findByText("student@qu.edu.qa")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Contributors" }));
  expect(await screen.findByText("contributor@qu.edu.qa")).toBeVisible();
  fireEvent.change(screen.getByRole("searchbox", { name: "Search users" }), {
    target: { value: "Demo" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Search", exact: true }));
  expect(await screen.findByText("contributor@qu.edu.qa")).toBeVisible();
  expect(guidyGet).toHaveBeenLastCalledWith(
    "/users?role=contributor&search=Demo&page=1&limit=15",
  );
});
