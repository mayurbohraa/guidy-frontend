import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import GradeEntry from "./GradeEntry";
import { guidyGet, guidyPost } from "../../Api/api.service";
import { getRegistrationApi } from "../../service/Registration.service";
jest.mock("../../Api/api.service", () => ({
  guidyGet: jest.fn(),
  guidyPost: jest.fn(),
}));
jest.mock("../../service/Registration.service", () => ({
  getRegistrationApi: jest.fn(),
}));
test("loads registered course scores and saves a legitimate zero", async () => {
  getRegistrationApi.mockResolvedValue({
    data: { courseIds: [{ _id: "course-1", name: "Programming" }] },
  });
  guidyGet.mockResolvedValue({
    data: { quiz1: 0, quiz2: 16, midterm: 15, project: 18, final: 17 },
  });
  guidyPost.mockResolvedValue({});
  const saved = jest.fn();
  render(
    <MemoryRouter>
      <GradeEntry onSaved={saved} onCancel={jest.fn()} />
    </MemoryRouter>,
  );
  await screen.findByRole("option", { name: "Programming" });
  fireEvent.change(screen.getByLabelText("Registered course"), {
    target: { value: "course-1" },
  });
  await waitFor(() => expect(screen.getByLabelText("Quiz 1")).toHaveValue(0));
  fireEvent.click(screen.getByRole("button", { name: "Save scores" }));
  await waitFor(() => expect(saved).toHaveBeenCalled());
  expect(guidyPost).toHaveBeenCalledWith("/grades", {
    course: "course-1",
    quiz1: 0,
    quiz2: 16,
    midterm: 15,
    project: 18,
    final: 17,
  });
});
