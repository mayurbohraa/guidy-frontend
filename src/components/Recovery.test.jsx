import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ForgotPassword from "./ForgotPassword";
import { guidyPost } from "../Api/api.service";
jest.mock("../Api/api.service", () => ({ guidyPost: jest.fn() }));

function enterEmail() {
  fireEvent.change(screen.getByLabelText("University email"), {target: {value: "student@qu.edu.qa"}});
  fireEvent.click(screen.getByRole("button", {name: "Continue"}));
}

test("requests simulated delivery from the code step", async () => {
  guidyPost.mockResolvedValue({message: "Request received."});
  render(<MemoryRouter><ForgotPassword /></MemoryRouter>);
  enterEmail();
  expect(screen.queryByLabelText("New password")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", {name: "Request account recovery"}));
  expect(await screen.findByRole("status")).toHaveTextContent("Delivery is simulated");
  expect(guidyPost).toHaveBeenCalledWith("/forgot-password", {email: "student@qu.edu.qa"});
});

test("verifies a code before showing password fields", async () => {
  guidyPost.mockResolvedValue({});
  render(<MemoryRouter initialEntries={["/forgotpassword"]}><Routes>
    <Route path="/forgotpassword" element={<ForgotPassword />} />
    <Route path="/" element={<p>Login destination</p>} />
  </Routes></MemoryRouter>);
  enterEmail();
  const code = "A".repeat(32);
  fireEvent.change(screen.getByLabelText("Recovery code"), {target: {value: code}});
  fireEvent.click(screen.getByRole("button", {name: "Continue"}));
  fireEvent.change(await screen.findByLabelText("New password"), {target: {value: "Replacement@123"}});
  fireEvent.change(screen.getByLabelText("Confirm new password"), {target: {value: "Replacement@123"}});
  fireEvent.click(screen.getByRole("button", {name: "Reset password"}));
  expect(await screen.findByText("Login destination")).toBeVisible();
  expect(guidyPost).toHaveBeenNthCalledWith(1, "/verify-recovery-code", {email: "student@qu.edu.qa", code});
  expect(guidyPost).toHaveBeenNthCalledWith(2, "/reset-password", {email: "student@qu.edu.qa", code, password: "Replacement@123"});
});
