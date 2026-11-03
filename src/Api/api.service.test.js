import axiosInstance from "./axios";

import { guidyPut } from "./api.service";

jest.mock("axios", () => {
  const client = {
    put: jest.fn().mockResolvedValue({ data: { status: 200 } }),
    interceptors: { request: { use: jest.fn() } },
  };
  return { create: jest.fn(() => client) };

});

const attachToken = axiosInstance.interceptors.request.use.mock.calls[0][0];

beforeEach(() => {
  localStorage.clear();
  axiosInstance.put.mockResolvedValue({ data: { status: 200 } });
});

test("reads the current login token when any service sends a request", () => {
  const config = { url: "/events/get-events", headers: {} };
  localStorage.setItem("token_status", "first-session");
  expect(attachToken(config).headers.Authorization).toBe("Bearer first-session");
  localStorage.setItem("token_status", "new-session");
  expect(attachToken({ url: "/registration/register", headers: {} }).headers.Authorization)
    .toBe("Bearer new-session");
});

test("sends task edits as JSON and lets Axios set a file upload boundary", async () => {
  await guidyPut("/tasks/update-task/123", { taskDescription: "Revise notes" });
  expect(axiosInstance.put.mock.calls[0][2].headers["Content-Type"]).toBe("application/json");
  const upload = new FormData();
  upload.append("file", new File(["notes"], "notes.txt"));
  await guidyPut("/resources", upload);
  expect(axiosInstance.put.mock.calls[1][2].headers["Content-Type"]).toBeUndefined();
});
