import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter, Link } from "react-router-dom";
import DashboardLayout from "./DashboardLayout";

jest.mock("./Navbar", () => function Header({ onMenuToggle, menuOpen, menuButtonRef }) {
  return <button ref={menuButtonRef} onClick={onMenuToggle} aria-expanded={menuOpen}>Open navigation</button>;
});

test("mobile navigation opens, closes with Escape, and closes after a destination is chosen", () => {
  const original = window.matchMedia;
  window.matchMedia = () => ({ matches: true, addEventListener: jest.fn(), removeEventListener: jest.fn() });
  try {
    render(<MemoryRouter><DashboardLayout className="userdashboard" contentClassName="userDash2"
      sidebar={<nav><Link to="/profile">My profile</Link></nav>}><h1>Dashboard</h1></DashboardLayout></MemoryRouter>);
    const toggle = screen.getByRole("button", { name: "Open navigation" });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    const dialog = screen.getByRole("dialog", { name: "Navigation" });
    expect(within(dialog).getByRole("button", { name: "Close navigation" })).toHaveFocus();
    fireEvent.keyDown(dialog, { key: "Escape" });
    expect(toggle).toHaveFocus();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole("link", { name: "My profile" }));
    expect(toggle).toHaveAttribute("aria-expanded", "false");
  } finally { window.matchMedia = original; }
});
