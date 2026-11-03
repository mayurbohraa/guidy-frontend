import { useSearchParams } from "react-router-dom";
import FieldHelp from "../FieldHelp";
import { useCallback, useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import {
  createEventsApi,
  deleteAllEventsApi,
  deleteEventApi,
  getEventsApi,
} from "../../service/Events.service";
import { Panel, PanelState, Workspace, useWorkspaceData } from "../Workspace";

const dateLabel = (date) =>
  date.toLocaleDateString(undefined, {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

// Date inputs use local calendar dates, avoiding a day shift when converting through UTC.
const dateValue = (date) =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");

const loadEvents = async (focus) => {
  const { data } = await getEventsApi(focus);
  if (!Array.isArray(data)) throw new Error("Invalid calendar response");
  return [...data].sort(
    (first, second) => new Date(first.eventDate) - new Date(second.eventDate),
  );
};

export default function CalendarPage() {
  const [params] = useSearchParams();
  const focusedEvent = params.get("event");
  const load = useCallback(() => loadEvents(focusedEvent), [focusedEvent]);
  const events = useWorkspaceData(load);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [eventDate, setEventDate] = useState(() => dateValue(new Date()));
  const [selectedOnly, setSelectedOnly] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState(false);
  const visibleEvents =
    events.data?.filter(
      (event) =>
        !selectedOnly ||
        new Date(event.eventDate).toDateString() ===
          selectedDate.toDateString(),
    ) ?? [];

  useEffect(() => {
    const event = events.data?.find((item) => item._id === focusedEvent);
    if (event) {
      const day = new Date(event.eventDate);
      setSelectedDate(day);
      setEventDate(dateValue(day));
      setSelectedOnly(true);
    }
  }, [events.data, focusedEvent]);

  async function updateEvents(action) {
    if (busy) return false;
    setBusy(true);
    setError("");
    try {
      await action();
      events.retry();
      setConfirm(false);
      return true;
    } catch {
      setError("The calendar change could not be saved. Try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }

  async function addEvent(event) {
    event.preventDefault();
    if (busy) return;
    const form = event.currentTarget;
    const fields = new FormData(form);
    const eventName = fields.get("name").trim();
    const eventType = fields.get("type").trim();
    if (!eventName || !eventType || !eventDate) {
      setError("Enter an event name, type, and date.");
      return;
    }
    if (
      await updateEvents(() =>
        createEventsApi({ eventName, eventType, eventDate }),
      )
    ) {
      form.reset();
    }
  }

  return (
    <Workspace
      title="Calendar"
      description="Select a date to plan an event, or browse your complete event list."
    >
      {error && (
        <div className="workspace-wide" role="alert">
          {error}
        </div>
      )}
      <Panel title="Your calendar">
        <Calendar
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setEventDate(dateValue(date));
          }}
          tileClassName={({ date }) =>
            events.data?.some(
              (event) =>
                new Date(event.eventDate).toDateString() ===
                date.toDateString(),
            )
              ? "active-day"
              : null
          }
        />
        <p className="workspace-calendar-caption">
          Selected date · {dateLabel(selectedDate)}
        </p>
        <p className="workspace-calendar-legend">
          <span aria-hidden="true" />
          Highlighted dates have events.
        </p>
      </Panel>
      <Panel title="Add an event">
        <p className="workspace-form-help">
          Choose a day on the calendar or enter a date below.
        </p>
        <form
          className="workspace-event-form"
          onSubmit={addEvent}
          aria-busy={busy}
        >
          <div className="guidy-auth-field">
            <label htmlFor="event-name">Event name</label>
            <FieldHelp
              id="event-name-hint"
              label="Event name"
              hint="A short event title, up to 120 characters."
            >
              <input
                id="event-name"
                aria-describedby="event-name-hint"
                name="name"
                placeholder="e.g. Calculus revision"
                required
                maxLength={120}
                disabled={busy}
              />
            </FieldHelp>
          </div>

          <div className="guidy-auth-field">
            <label htmlFor="event-type">Event type</label>
            <FieldHelp
              id="event-type-hint"
              label="Event type"
              hint="Up to 80 characters, e.g. Exam, Workshop, or Study session."
            >
              <input
                id="event-type"
                aria-describedby="event-type-hint"
                name="type"
                placeholder="e.g. Study session or exam"
                required
                maxLength={80}
                disabled={busy}
              />
            </FieldHelp>
          </div>

          <label>
            Date
            <input
              type="date"
              name="date"
              value={eventDate}
              onChange={(event) => {
                const value = event.target.value;
                setEventDate(value);
                if (value) setSelectedDate(new Date(value + "T12:00:00"));
              }}
              required
              disabled={busy}
            />
          </label>
          <button type="submit" className="workspace-button" disabled={busy}>
            {busy ? "Saving…" : "Add event"}
          </button>
        </form>
      </Panel>
      <Panel title="Event list" wide>
        <div className="workspace-calendar-toolbar">
          <div className="workspace-actions" aria-label="Event filters">
            <button
              type="button"
              className={
                selectedOnly ? "workspace-secondary" : "workspace-button"
              }
              aria-pressed={!selectedOnly}
              onClick={() => setSelectedOnly(false)}
            >
              All events
            </button>
            <button
              type="button"
              className={
                selectedOnly ? "workspace-button" : "workspace-secondary"
              }
              aria-pressed={selectedOnly}
              onClick={() => setSelectedOnly(true)}
            >
              Selected date
            </button>
          </div>
          {events.status === "ready" && (
            <span>
              {visibleEvents.length}{" "}
              {visibleEvents.length === 1 ? "event" : "events"}
            </span>
          )}
        </div>
        <PanelState
          request={events}
          empty={
            events.status === "ready" &&
            visibleEvents.length === 0 &&
            (selectedOnly
              ? "No events are scheduled for this date."
              : "No events have been added yet.")
          }
        >
          <div className="workspace-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Event</th>
                  <th>Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {visibleEvents.map((event) => (
                  <tr
                    key={event._id}
                    className={
                      new Date(event.eventDate).toDateString() ===
                      selectedDate.toDateString()
                        ? "workspace-selected-event"
                        : ""
                    }
                  >
                    <td>
                      {Number.isNaN(Date.parse(event.eventDate))
                        ? "Date unavailable"
                        : dateLabel(new Date(event.eventDate))}
                    </td>
                    <td>{event.eventName || "Untitled event"}</td>
                    <td>{event.eventType || "Not specified"}</td>
                    <td>
                      <button
                        type="button"
                        className="workspace-secondary workspace-danger"
                        disabled={busy}
                        aria-label={"Delete " + (event.eventName || "event")}
                        onClick={() =>
                          updateEvents(() => deleteEventApi(event._id))
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PanelState>
        {events.status === "ready" && events.data?.length > 0 && (
          <button
            type="button"
            className="workspace-secondary workspace-danger workspace-end-semester"
            disabled={busy}
            onClick={() => setConfirm(true)}
          >
            Delete all events
          </button>
        )}
        {confirm && (
          <div className="workspace-confirm">
            <p>Delete every calendar event? This action cannot be undone.</p>
            <div className="workspace-actions">
              <button
                type="button"
                className="workspace-secondary"
                disabled={busy}
                onClick={() => setConfirm(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="workspace-button"
                disabled={busy}
                onClick={() => updateEvents(deleteAllEventsApi)}
              >
                {busy ? "Deleting…" : "Confirm deletion"}
              </button>
            </div>
          </div>
        )}
      </Panel>
    </Workspace>
  );
}
