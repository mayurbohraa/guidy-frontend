import axiosInstance from "./axios";

export function getHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token_status")}`,
    "Content-Type": "application/json"
  };

}
export async function guidyGet(url) {
  return (await axiosInstance.get(url, {
    headers: getHeaders()
  })).data;
}
export async function guidyPost(url, body) {
  return (await axiosInstance.post(url, body, {
    headers: getHeaders()
  })).data;
}
export async function guidyPut(url, body) {
  return (await axiosInstance.put(url, body, {
    // Axios supplies the multipart boundary for file uploads; edits use JSON.
    headers: body instanceof FormData ? {
      Authorization: `Bearer ${localStorage.getItem("token_status")}`
    } : getHeaders()
  })).data;
}
export async function guidyDelete(url) {
  return (await axiosInstance.delete(url, {
    headers: getHeaders()
  })).data;
}
export async function downloadResource(id, filename) {
  const response = await axiosInstance.get(`/resources/${id}/download`, {
    headers: getHeaders(),
    responseType: "blob"
  });
  const url = URL.createObjectURL(response.data);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
