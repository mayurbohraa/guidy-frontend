import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MyTasks from "./MyTasks";
import { guidyGet, guidyDelete } from "../../Api/api.service";

jest.mock("../../Api/api.service", () => ({
  guidyGet: jest.fn(), guidyPost: jest.fn(), guidyDelete: jest.fn(),
}));
jest.mock("../pages/Tasklist", () => ({ tasks }) => <ul>{tasks.map((task) => <li key={task._id}>{task.taskDescription}</li>)}</ul>);

test("asks for confirmation before deleting all tasks", async () => {
  guidyGet.mockResolvedValueOnce({ data: [{ _id: "1", taskDescription: "Revise notes" }] }).mockResolvedValue({ data: [] });
  guidyDelete.mockResolvedValue({});
  render(<MemoryRouter><MyTasks /></MemoryRouter>);
  await screen.findByText("Revise notes");
  fireEvent.click(screen.getByRole("button", { name: "Delete all tasks" }));
  expect(guidyDelete).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Confirm deletion" }));
  await waitFor(() => expect(guidyDelete).toHaveBeenCalledWith("/tasks/delete-all-task"));
  expect(await screen.findByText("No tasks added yet")).toBeVisible();
  expect(screen.getByRole("button", { name: "Delete all tasks" })).toBeDisabled();
});
