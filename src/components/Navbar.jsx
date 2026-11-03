import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { UilBell, UilSearch } from "@iconscout/react-unicons";
import { ProfileDD } from "../data/data";
import courses from "../data/Searchbardata.json";
import { getCurrentUser, getDashboardPath } from "../service/Authentication.service";
import { guidyGet } from "../Api/api.service";
import apiRoutes from "../Api/apiRoutes";
import { PanelState, useWorkspaceData } from "./Workspace";

const loadNotifications = async () => {
  const { data } = await guidyGet(apiRoutes.getNotifications);
  if (!Array.isArray(data)) throw new Error("Invalid notification list");
  return data;
};

export default function Navbar() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState("");
  const headerRef = useRef();
  const notifications = useWorkspaceData(loadNotifications);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpen("");
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () => document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);
  const [user, setUser] = useState(getCurrentUser);
  const name = [user?.firstName, user?.lastName].filter(Boolean).join(" ") || "Guidy account";
  const initials = name.split(" ").slice(0, 2).map((part) => part[0]).join("").toUpperCase();
  const unread = notifications.data?.filter((item) => !item.isRead).length ?? 0;
  useEffect(() => {
    const refreshAccount = () => setUser(getCurrentUser());
    window.addEventListener("guidy:account-updated", refreshAccount);
    return () => window.removeEventListener("guidy:account-updated", refreshAccount);
  }, []);

  const toggle = (panel) => setOpen((current) => current === panel ? "" : panel);

  return (
    <header ref={headerRef} className="navbar workspace-navbar" onBlur={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setOpen("");
    }} onKeyDown={(event) => {
      if (event.key === "Escape") {
        event.currentTarget.querySelector('[aria-expanded="true"]')?.focus();
        setOpen("");
      }
    }}>
      <div className="workspace-search">
        <UilSearch aria-hidden="true" />
        <input type="search" list="guidy-courses" aria-label="Search courses" placeholder="Find a course" value={search}
          onChange={(event) => setSearch(event.target.value)} />
        <datalist id="guidy-courses">
          {[...new Set(courses.map((item) => item.heading))].map((course) => <option key={course} value={course} />)}
        </datalist>
      </div>
      <div className="workspace-menu">
        <button type="button" className="workspace-header-button" aria-expanded={open === "notifications"}
          aria-controls="guidy-notifications" aria-label={unread ? "Notifications, " + unread + " unread" : "Notifications"}
          onClick={() => toggle("notifications")}>
          <UilBell aria-hidden="true" />{unread > 0 && <span className="workspace-badge">{unread}</span>}
        </button>
        <section id="guidy-notifications" className="workspace-popover" hidden={open !== "notifications"}>
          <h2>Notifications</h2>
          <PanelState request={notifications} empty={notifications.data?.length === 0 && "You have no notifications yet."}>
            <ul className="workspace-list">{notifications.data?.map((item) => (
              <li key={item._id}><strong>{item.title}</strong>
                {item.createdAt && <span>{new Date(item.createdAt).toLocaleDateString()}</span>}
              </li>
            ))}</ul>
          </PanelState>
        </section>
      </div>
      <div className="workspace-menu">
        <button type="button" className="workspace-header-button workspace-account" aria-expanded={open === "profile"}
          aria-controls="guidy-profile" aria-label={name} onClick={() => toggle("profile")}>
          <span className="workspace-avatar" aria-hidden="true">{initials}</span>
          <span className="workspace-account-text">
            <strong title={name}>{name}</strong>
            <small>{user?.role || "Account"}</small>
          </span>
        </button>
        <div id="guidy-profile" className="workspace-popover workspace-profile-links" hidden={open !== "profile"}>
          {ProfileDD.map((item) => <NavLink key={item.to} to={item.to === "/viewprofile" ? getDashboardPath(user?.role) + "/myprofile" : item.to} onClick={() => setOpen("")}>
            <item.icon aria-hidden="true" />{item.name}
          </NavLink>)}
        </div>
      </div>
    </header>
  );
}
