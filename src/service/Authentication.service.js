import Axiosinstance from "../Api/axios";

export async function LoginApi(body) {
  const response = await Axiosinstance.post("/login", body, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}

export async function SignupApi(body) {
  const response = await Axiosinstance.post("/signup", body, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
}
