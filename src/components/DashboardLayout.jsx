import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";

export default function DashboardLayout({ className, contentClassName, sidebar, children }) {
  const [mobile, setMobile] = useState(() => window.matchMedia?.("(max-width: 1000px)").matches ?? false);
  const [open, setOpen] = useState(false);
  const sidebarRef = useRef();
  const toggleRef = useRef();
  const contentRef = useRef();
  const wasOpen = useRef(false);
  useEffect(() => {
    if (mobile && open) contentRef.current?.setAttribute("inert", "");
    else {
      contentRef.current?.removeAttribute("inert");
      if (wasOpen.current) toggleRef.current?.focus();
    }
    wasOpen.current = mobile && open;
  }, [mobile, open]);
  const location = useLocation();

  useEffect(() => {
    const media = window.matchMedia?.("(max-width: 1000px)");
    if (!media) return;
    const change = () => { setMobile(media.matches); setOpen(false); };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname, location.search]);

  useEffect(() => {
    if (!mobile || !open) return;
    const sidebar = sidebarRef.current;
    const controls = () => [...sidebar.querySelectorAll("button, a[href]")];
    controls()[0]?.focus();
    function keyboard(event) {
      if (event.key === "Escape") { setOpen(false); }
      if (event.key !== "Tab") return;
      const items = controls();
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    }
    sidebar.addEventListener("keydown", keyboard);
    return () => sidebar.removeEventListener("keydown", keyboard);
  }, [mobile, open]);

  function close() { setOpen(false); }

  return <div className={className + " workspace-shell"}>
    {mobile && open && <div className="workspace-nav-backdrop" onClick={close} />}
    <aside id="workspace-navigation" ref={sidebarRef}
      className={"workspace-navigation" + (open ? " is-open" : "")}
      role={mobile && open ? "dialog" : undefined}
      aria-modal={mobile && open ? true : undefined}
      aria-label={mobile && open ? "Navigation" : undefined}
      aria-hidden={mobile && !open ? true : undefined}
      onClick={event => { if (mobile && event.target.closest("a")) close(); }}>
      <button type="button" className="workspace-nav-close workspace-secondary" onClick={close} aria-label="Close navigation">Close ✕</button>
      {sidebar}
    </aside>
    <div ref={contentRef} className={contentClassName}>
      <Navbar menuOpen={open} menuButtonRef={toggleRef} onMenuToggle={() => setOpen(value => !value)} />
      <div className="workspace-scroll" role="region" aria-label="Dashboard content" tabIndex={0}>{children}</div>
    </div>
  </div>;
}
