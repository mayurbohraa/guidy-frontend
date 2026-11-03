import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { MemoryRouter, Routes, Route } from "react-router-dom";
import { guidyGet, guidyPost } from "../Api/api.service";
import { getCoursesApi } from "../service/Courses.service";
import { createRegistrationApi, getRegistrationApi } from "../service/Registration.service";
import MyTasks from "./User/MyTasks";
import MySchedule from "./User/MySchedule";
import MyGrades from "./User/MyGrades";
import Years from "./pages/Years";

jest.mock("../Api/api.service", () => ({
  guidyGet: jest.fn(), guidyPost: jest.fn(), guidyPut: jest.fn(), guidyDelete: jest.fn(),
}));
jest.mock("../service/Courses.service", () => ({ getCoursesApi: jest.fn() }));
jest.mock("../service/Registration.service", () => ({
  createRegistrationApi: jest.fn(), getRegistrationApi: jest.fn(),
}));
jest.mock("react-toastify", () => ({
  toast: { error: jest.fn(), warn: jest.fn(), warning: jest.fn(), success: jest.fn() },
}));

beforeEach(() => jest.clearAllMocks());

test("adds a task to the current list without nesting the previous list", async () => {
  guidyGet.mockResolvedValueOnce({ data: [] }).mockResolvedValueOnce({ data: [{ _id: "task-1", taskDescription: "Read chapter" }] });
  guidyPost.mockResolvedValue({ data: { _id: "task-1", taskDescription: "Read chapter" } });
  render(<MemoryRouter><MyTasks /></MemoryRouter>);
  await screen.findByText("No tasks added yet");
  fireEvent.input(screen.getByPlaceholderText("Add a new task"), { target: { value: "Read chapter" } });
  fireEvent.click(screen.getByRole("button", { name: /add task/i }));
  expect(await screen.findByText("Read chapter")).toBeInTheDocument();
});

test("shows an empty schedule and grade list for a new account", async () => {
  getRegistrationApi.mockResolvedValue({ data: null });
  guidyGet.mockResolvedValue({ data: [] });
  render(<MemoryRouter><MySchedule /><MyGrades /></MemoryRouter>);
  await waitFor(() => expect(getRegistrationApi).toHaveBeenCalled());
  expect(await screen.findByText("No grades available for your registered courses")).toBeInTheDocument();
});

test("removes unchecked courses from the submitted registration", async () => {
  const courses = Array.from({ length: 5 }, (_, index) => ({
    _id: String(index + 1), name: "Course " + (index + 1), year: 1, term: "fall",
  }));
  getCoursesApi.mockResolvedValue({ data: courses });
  createRegistrationApi.mockResolvedValue({ status: 200 });
  render(<MemoryRouter initialEntries={["/year/1"]}>
    <Routes>
      <Route path="/year/:year" element={<Years />} />
      <Route path="/userdashboard/myschedule" element={<p>Schedule destination</p>} />
    </Routes>
  </MemoryRouter>);
  await screen.findByRole("checkbox", { name: "Course 1" });
  for (const course of courses) fireEvent.click(screen.getByRole("checkbox", { name: course.name }));
  fireEvent.click(screen.getByRole("checkbox", { name: "Course 5" }));
  fireEvent.click(screen.getByRole("button", { name: "Register for selected course" }));
  expect(await screen.findByText("Schedule destination")).toBeInTheDocument();
  await waitFor(() => expect(createRegistrationApi).toHaveBeenCalledWith({
    courseIds: ["1", "2", "3", "4"],
  }));
});
