import axiosInstance from "./axios";

export function getHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem("token_status")}`,
    "Content-Type": "application/json" ,
  };
}

export async function guidyGet(url) {
  return (
    await axiosInstance.get(url, {
      headers: getHeaders(),
    })
  ).data;
}

export async function guidyPost(url, body) {
  return (
    await axiosInstance.post(url, body, {
      headers: getHeaders(),
    })
  ).data;
}

export async function guidyPut(url, body) {
  return (
    await axiosInstance.put(url, body, {
      headers:{
        ...getHeaders(),
        "Content-Type": "multipart/form-data",
      } 
    })
  ).data;
}

export async function guidyDelete(url) {
  return (
    await axiosInstance.delete(url, {
      headers: getHeaders(),
    })
  ).data;
}
