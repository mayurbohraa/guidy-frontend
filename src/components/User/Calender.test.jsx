import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CalendarPage from "./Calender";
import { createEventsApi, getEventsApi } from "../../service/Events.service";

jest.mock("../../service/Events.service", () => ({
  createEventsApi: jest.fn(),
  getEventsApi: jest.fn(),
  deleteEventApi: jest.fn(),
  deleteAllEventsApi: jest.fn(),
}));
jest.mock("react-calendar", () => ({
  __esModule: true,
  default: ({ onChange }) => (
    <button type="button" onClick={() => onChange(new Date(2026, 10, 7))}>
      Choose November 7
    </button>
  ),
}));

test("uses the selected local calendar date in the event form and filters the list", async () => {
  getEventsApi.mockResolvedValue({
    data: [
      {
        _id: "1",
        eventName: "Study group",
        eventType: "Revision",
        eventDate: "2026-11-08T12:00:00",
      },
    ],
  });
  createEventsApi.mockResolvedValue({});
  render(
    <MemoryRouter>
      <CalendarPage />
    </MemoryRouter>,
  );
  await screen.findByText("Study group");
  fireEvent.click(screen.getByRole("button", { name: "Choose November 7" }));
  expect(screen.getByLabelText("Date")).toHaveValue("2026-11-07");
  fireEvent.click(screen.getByRole("button", { name: "Selected date" }));
  expect(
    screen.getByText("No events are scheduled for this date."),
  ).toBeVisible();
  fireEvent.change(screen.getByLabelText("Event name"), {
    target: { value: "Exam review" },
  });
  fireEvent.change(screen.getByLabelText("Event type"), {
    target: { value: "Study" },
  });
  fireEvent.click(screen.getByRole("button", { name: "Add event" }));
  await waitFor(() =>
    expect(createEventsApi).toHaveBeenCalledWith({
      eventName: "Exam review",
      eventType: "Study",
      eventDate: "2026-11-07",
    }),
  );
  await waitFor(() =>
    expect(screen.getByRole("button", { name: "Add event" })).toBeEnabled(),
  );
  await waitFor(() => expect(screen.queryAllByRole("status")).toHaveLength(0));
  await waitFor(() => expect(getEventsApi).toHaveBeenCalledTimes(2));
});
