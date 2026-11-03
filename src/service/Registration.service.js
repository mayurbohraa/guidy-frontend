import Axiosinstance from "../Api/axios";

import { getHeaders } from "../Api/api.service";
export async function createRegistrationApi(body) {
  const response = await Axiosinstance.post("/registration/register", body, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}
export async function getRegistrationApi() {
  const response = await Axiosinstance.get("/registration/get-registered", {
    headers: getHeaders()
  });
  return response.data;
}
export async function dropCourseApi(courseId) {
  const response = await Axiosinstance.delete(`/registration/drop-course/${courseId}`, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}
export async function endSemesterApi() {
  const response = await Axiosinstance.delete("/registration/end-semester", {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}
