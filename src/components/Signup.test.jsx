import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Signup from "./Signup";
import { SignupApi } from "../service/Authentication.service";
jest.mock("../service/Authentication.service", () => ({ SignupApi: jest.fn() }));

test("keeps format help compact, keyboard accessible, and separate from validation", () => {
  render(<MemoryRouter><Signup /></MemoryRouter>);
  const button = screen.getByRole("button", { name: "Email format information" });
  const hint = screen.getByText("Use your university email, e.g. name@qu.edu.qa.");
  expect(hint).not.toBeVisible();
  fireEvent.mouseEnter(button);
  expect(hint).toBeVisible();
  expect(hint).toHaveTextContent("name@qu.edu.qa");
  expect(button).toHaveAttribute("aria-expanded", "true");
  fireEvent.mouseLeave(button);
  expect(hint).not.toBeVisible();
  act(() => button.focus());
  expect(hint).toBeVisible();
  fireEvent.keyDown(button, { key: "Escape" });
  expect(hint).not.toBeVisible();
  expect(button).toHaveFocus();
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "wrong@example.com" } });
  fireEvent.blur(screen.getByLabelText("Email"));
  expect(screen.getByLabelText("Email")).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Use a university email such as name@qu.edu.qa.")).toBeVisible();
  fireEvent.click(screen.getByRole("button", { name: "Create account" }));
  expect(screen.getByLabelText("First name")).toHaveFocus();
  expect(SignupApi).not.toHaveBeenCalled();
});

test("submits only supported signup fields and retains entries when the server rejects them", async () => {
  SignupApi.mockRejectedValue({ response: { status: 409 } });
  render(<MemoryRouter><Signup /></MemoryRouter>);
  const entries = { "First name": "Demo", "Last name": "Student", Email: "demonew@qu.edu.qa", "Mobile number": "+97455123456", Password: "GuidyDemo@123", "Confirm password": "GuidyDemo@123" };
  for (const [label, value] of Object.entries(entries)) fireEvent.change(screen.getByLabelText(label), { target: { value } });
  fireEvent.click(screen.getByRole("radio", { name: "Student" }));
  fireEvent.click(screen.getByRole("button", { name: "Create account" }));
  expect(await screen.findByRole("alert")).toHaveTextContent("already registered");
  expect(SignupApi).toHaveBeenCalledWith({ firstName: "Demo", lastName: "Student", email: "demonew@qu.edu.qa", mobileNumber: "+97455123456", password: "GuidyDemo@123", role: "student" });
  expect(screen.getByLabelText("Email")).toHaveValue("demonew@qu.edu.qa");
  expect(screen.getByRole("button", { name: "Create account" })).toBeEnabled();
});
