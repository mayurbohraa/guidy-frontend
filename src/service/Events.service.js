import Axiosinstance from "../Api/axios";

export async function createEventsApi(body) {
  const response = await Axiosinstance.post("/events/create-event", body, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}
export async function getEventsApi(focus) {
  const response = await Axiosinstance.get("/events/get-events?limit=50&page=1" + (focus ? "&focus=" + encodeURIComponent(focus) : ""), {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}
export async function deleteEventApi(id) {
  const response = await Axiosinstance.delete(`/events/delete-event/${id}`, {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}
export async function deleteAllEventsApi() {
  const response = await Axiosinstance.delete("/events/delete-all-events", {
    headers: {
      "Content-Type": "application/json"
    }
  });
  return response.data;
}
