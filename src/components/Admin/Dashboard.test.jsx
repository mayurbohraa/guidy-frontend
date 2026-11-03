import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { guidyGet } from "../../Api/api.service";
import Dashboard from "./Dashboard";

jest.mock("../../Api/api.service", () => ({ guidyGet: jest.fn() }));

test("distinguishes a failed moderation queue from an empty one and retries", async () => {
  guidyGet.mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce({ data: [] });
  render(<MemoryRouter><Dashboard /></MemoryRouter>);

  const error = await screen.findByRole("alert");
  expect(error).toHaveTextContent("This information could not be loaded.");
  expect(screen.queryByText("No pending requests.")).not.toBeInTheDocument();
  expect(screen.getByRole("link", { name: "Open calendar" })).toBeInTheDocument();

  fireEvent.click(within(error).getByRole("button", { name: "Try again" }));

  expect(await screen.findByText("No pending requests.")).toBeInTheDocument();
  expect(screen.queryByRole("alert")).not.toBeInTheDocument();
});

test("derives queue counts and term coverage from pending submissions", async () => {
  guidyGet.mockResolvedValue({ data: [
    { _id: "1", resourceName: "Notes", term: "fall", user: { _id: "user-1" }, subject: { _id: "course-1", name: "Calculus" } },
    { _id: "2", resourceName: "Examples", term: "fall", user: { _id: "user-1" }, subject: { _id: "course-1", name: "Calculus" } },
  ] });
  render(<MemoryRouter><Dashboard /></MemoryRouter>);
  await screen.findByText("Notes");
  expect(screen.getByRole("article", { name: "Pending resources" })).toHaveTextContent("2");
  expect(screen.getByRole("article", { name: "Contributors awaiting review" })).toHaveTextContent("1");
  expect(screen.getByRole("article", { name: "Courses in review queue" })).toHaveTextContent("1");
  expect(screen.getByRole("progressbar")).toHaveAttribute("value", "2");
  expect(screen.getByRole("progressbar")).toHaveAttribute("max", "2");
});
