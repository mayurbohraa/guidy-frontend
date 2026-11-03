import Axiosinstance from "../Api/axios";

export async function getCoursesApi() {
  const response = await Axiosinstance.get("/course/get-courses?search&page=1&limit=40", {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}
