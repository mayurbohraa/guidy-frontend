import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { UilBell } from "@iconscout/react-unicons";
import { ProfileDD } from "../data/data";
import HeaderSearch from "./HeaderSearch";
import Popup from "./Popup";
import {
  getCurrentUser,
  getDashboardPath,
} from "../service/Authentication.service";
import { guidyGet, guidyPost } from "../Api/api.service";
import apiRoutes from "../Api/apiRoutes";
import { PanelState, useWorkspaceData } from "./Workspace";

const loadNotifications = async () => {
  const { data } = await guidyGet(apiRoutes.getNotifications);
  if (!Array.isArray(data)) throw new Error("Invalid notification list");
  return data;
};

export default function Navbar({ menuOpen, menuButtonRef, onMenuToggle }) {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    if (location.state?.confirmLogout) {
      setLogoutOpen(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);
  const [retrying, setRetrying] = useState(false);
  const [deliveryMessage, setDeliveryMessage] = useState("");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [open, setOpen] = useState("");
  useEffect(() => {
    if (new URLSearchParams(location.search).get("panel") === "notifications")
      setOpen("notifications");
  }, [location.key, location.search]);
  const headerRef = useRef();
  const notifications = useWorkspaceData(loadNotifications);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (!headerRef.current?.contains(event.target)) setOpen("");
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    return () =>
      document.removeEventListener("pointerdown", closeOnOutsideClick);
  }, []);
  const [user, setUser] = useState(getCurrentUser);
  const name =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ") ||
    "Guidy account";
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
  const unread = notifications.data?.filter((item) => !item.isRead).length ?? 0;
  useEffect(() => {
    const refreshAccount = () => setUser(getCurrentUser());
    window.addEventListener("guidy:account-updated", refreshAccount);
    return () =>
      window.removeEventListener("guidy:account-updated", refreshAccount);
  }, []);

  const toggle = (panel) =>
    setOpen((current) => (current === panel ? "" : panel));

  return (
    <header
      ref={headerRef}
      className="navbar workspace-navbar"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen("");
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.currentTarget.querySelector('[aria-expanded="true"]')?.focus();
          setOpen("");
        }
      }}
    >
      {onMenuToggle && <button ref={menuButtonRef} type="button" className="workspace-header-button workspace-menu-toggle"
        aria-label="Open navigation" aria-controls="workspace-navigation" aria-expanded={Boolean(menuOpen)} onClick={onMenuToggle}>☰</button>}
      <HeaderSearch />
      <div className="workspace-menu">
        <button
          type="button"
          className="workspace-header-button"
          aria-expanded={open === "notifications"}
          aria-controls="guidy-notifications"
          aria-label={
            unread ? "Notifications, " + unread + " unread" : "Notifications"
          }
          onClick={() => toggle("notifications")}
        >
          <UilBell aria-hidden="true" />
          {unread > 0 && <span className="workspace-badge">{unread}</span>}
        </button>
        <section
          id="guidy-notifications"
          className="workspace-popover"
          hidden={open !== "notifications"}
        >
          <h2>Notifications</h2>
          {user?.role === "admin" && (
            <button
              type="button"
              className="workspace-secondary workspace-notification-retry"
              disabled={retrying}
              onClick={async () => {
                if (retrying) return;
                setRetrying(true);
                setDeliveryMessage("");
                try {
                  await guidyPost("/notifications/retry", {});
                  setDeliveryMessage("Queued notifications checked.");
                  notifications.retry();
                } catch {
                  setDeliveryMessage(
                    "Queued notifications could not be retried.",
                  );
                } finally {
                  setRetrying(false);
                }
              }}
            >
              {retrying ? "Retrying…" : "Retry queued notifications"}
            </button>
          )}
          {deliveryMessage && <p role="status">{deliveryMessage}</p>}
          <PanelState
            request={notifications}
            empty={
              notifications.data?.length === 0 &&
              "You have no notifications yet."
            }
          >
            <ul className="workspace-list">
              {notifications.data?.map((item) => (
                <li key={item._id}>
                  <strong>{item.title}</strong>
                  {item.description && <span>{item.description}</span>}
                  {item.createdAt && (
                    <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  )}
                </li>
              ))}
            </ul>
          </PanelState>
        </section>
      </div>
      <div className="workspace-menu">
        <button
          type="button"
          className="workspace-header-button workspace-account"
          aria-expanded={open === "profile"}
          aria-controls="guidy-profile"
          aria-label={name}
          onClick={() => toggle("profile")}
        >
          <span className="workspace-avatar" aria-hidden="true">
            {initials}
          </span>
          <span className="workspace-account-text">
            <strong title={name}>{name}</strong>
            <small>{user?.role || "Account"}</small>
          </span>
        </button>
        <div
          id="guidy-profile"
          className="workspace-popover workspace-profile-links"
          hidden={open !== "profile"}
        >
          {ProfileDD.map((item) =>
            item.to === "/logout" ? (
              <button
                type="button"
                key={item.to}
                onClick={() => {
                  setOpen("");
                  setLogoutOpen(true);
                }}
              >
                <item.icon aria-hidden="true" />
                {item.name}
              </button>
            ) : (
              <NavLink
                key={item.to}
                to={
                  item.to === "/viewprofile"
                    ? getDashboardPath(user?.role) + "/myprofile"
                    : item.to
                }
                onClick={() => setOpen("")}
              >
                <item.icon aria-hidden="true" />
                {item.name}
              </NavLink>
            ),
          )}
        </div>
      </div>
      {logoutOpen && (
        <Popup
          label="Confirm logout"
          className="guidy-logout-modal"
          handleClose={() => setLogoutOpen(false)}
          content={
            <div className="workspace-confirm-dialog">
              <h2>Log out of Guidy?</h2>
              <p>You can sign in again to continue where you left off.</p>
              <div className="workspace-actions">
                <button
                  type="button"
                  className="workspace-secondary"
                  onClick={() => setLogoutOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="workspace-button"
                  onClick={() => {
                    localStorage.removeItem("login_status");
                    localStorage.removeItem("token_status");
                    toast.success("You have been logged out.", {
                      toastId: "logout",
                    });
                    navigate("/", { replace: true });
                  }}
                >
                  Log out
                </button>
              </div>
            </div>
          }
        />
      )}
    </header>
  );
}
