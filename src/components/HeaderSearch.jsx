import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UilSearch } from "@iconscout/react-unicons";
import { guidyGet } from "../Api/api.service";
import {
  getCurrentUser,
  getDashboardPath,
} from "../service/Authentication.service";

function pageResults(query) {
  const user = getCurrentUser(),
    root = getDashboardPath(user?.role);
  const pages = [
    ["Dashboard", "Overview home", root],
    [
      "My profile",
      "Account name email mobile edit profile",
      root + "/myprofile",
    ],
    ["Notifications", "Messages updates", root + "?panel=notifications"],
    ["Log out", "Sign out exit", "/logout"],
  ];
  if (user?.role === "student")
    pages.push(
      ["My schedule", "Registered courses timetable", root + "/myschedule"],
      ["Calendar", "Events dates exam study", root + "/calender"],
      ["My roadmap", "Years registration courses", root + "/myroadmap"],
      ["My tasks", "Todo checklist", root + "/mytasks"],
      ["My grades", "Scores assessments progress", root + "/mygrades"],
      [
        "Resources",
        "Approved library documents materials",
        root + "/resources",
      ],
      ["Create notebook", "New notes", root + "/notebook"],
      ["My notes", "Saved notebooks", root + "/notes"],
    );
  if (user?.role === "contributor")
    pages[0][1] += " approved library coverage resources";
  if (user?.role === "contributor")
    pages.push([
      "Add resources",
      "Upload submit learning materials",
      root + "/addresources",
    ]);
  if (user?.role === "admin")
    pages.push(
      ["Calendar", "Events dates", root + "/calender"],
      ["My tasks", "Todo checklist", root + "/mytasks"],
      [
        "Resource requests",
        "Pending review approve reject",
        root + "/requests",
      ],
      ["Users", "Students contributors accounts directory", root + "/users"],
      [
        "Account recovery",
        "Forgot password reset help",
        root + "/account-recovery",
      ],
    );
  const words = query.toLowerCase().trim().split(/\s+/);
  return pages
    .filter(([title, aliases]) =>
      words.every((word) =>
        (title + " " + aliases).toLowerCase().includes(word),
      ),
    )
    .map(([title, , href]) => ({
      id: "page:" + href,
      title,
      description: "Page",
      href,
    }));
}
export default function HeaderSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [remote, setRemote] = useState({ status: "idle", data: [] });
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const local = query.trim() ? pageResults(query) : [];
  const results = [...local, ...remote.data];
  useEffect(() => { if(open) document.getElementById("search-result-"+active)?.scrollIntoView?.({block:"nearest"}); }, [active, open, results.length]);
  useEffect(() => {
    let live = true;
    if (!query.trim()) {
      setRemote({ status: "idle", data: [] });
      return;
    }
    setRemote({ status: "loading", data: [] });
    const timer = setTimeout(async () => {
      try {
        const response = await guidyGet(
          "/search?q=" + encodeURIComponent(query.trim()),
        );
        if (!Array.isArray(response.data))
          throw new Error("Invalid search results");
        if (live) setRemote({ status: "ready", data: response.data });
      } catch {
        if (live) setRemote({ status: "error", data: [] });
      }
    }, 300);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [query, attempt]);
  const choose = (href) => {
    setOpen(false);
    setQuery("");
    navigate(href);
  };
  return (
    <div
      className="workspace-search workspace-course-search"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.stopPropagation();
          setOpen(false);
        }
        if (event.target.getAttribute("role") !== "combobox") return;
        if (event.key === "ArrowDown") {
          event.preventDefault();
          setOpen(true);
          setActive((value) =>
            Math.max(0, Math.min(value + 1, results.length - 1)),
          );
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          setActive((value) => Math.max(0, value - 1));
        }
        if (event.key === "Enter" && open && results.length) {
          event.preventDefault();
          choose(
            results[Math.max(0, Math.min(active, results.length - 1))].href,
          );
        }
      }}
    >
      <UilSearch aria-hidden="true" />
      <input
        type="search"
        role="combobox"
        aria-autocomplete="list"
        aria-label="Search workspace"
        placeholder="Search pages, courses, and more"
        value={query}
        maxLength={100}
        aria-controls="workspace-search-results"
        aria-expanded={open && Boolean(query.trim())}
        aria-activedescendant={
          open && results[active] ? "search-result-" + active : undefined
        }
        onFocus={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setActive(0);
          setOpen(true);
        }}
      />
      {open && query.trim() && (
        <section className="workspace-popover" aria-label="Workspace search">
          {remote.status === "loading" && <p role="status">Searching…</p>}
          {remote.status === "error" && (
            <p role="alert">
              Records could not be searched. Page shortcuts are still available.{" "}
              <button
                type="button"
                className="workspace-secondary"
                onClick={() => setAttempt((value) => value + 1)}
              >
                Try again
              </button>
            </p>
          )}
          {remote.status === "ready" && !results.length && (
            <p>No matching pages or records.</p>
          )}
          <ul
            className="workspace-search-results"
            role="listbox"
            id="workspace-search-results"
            aria-label="Search results"
          >
            {results.map((result, index) => (
              <li key={result.id}>
                <Link
                  role="option"
                  id={"search-result-" + index}
                  aria-selected={index === active}
                  to={result.href}
                  onMouseEnter={() => setActive(index)}
                  onClick={() => {
                    setOpen(false);
                    setQuery("");
                  }}
                >
                  <strong>{result.title}</strong>
                  <small>{result.description}</small>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
