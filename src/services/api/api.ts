import { LocalStore } from "@/utils/helpers";
import axios from "axios";

const userSession = LocalStore.get("userSession");
const url = process.env.BASE_API_URL;

console.log("api2", url, userSession);

const api = axios.create({
  baseURL: url,
  headers: { Authorization: `Bearer ${userSession?.token}` },
});

export const handleLogIn = async (sign: `0x${string}` | undefined) => {
  const response = await api.post("/auth/login", {
    sig: sign,
  });

  console.log(response);
  LocalStore.set("userSession", response.data);
  return response.data;
};

export const handleLogOut = async () => {
  console.log("api1", url);
  const response = await api.patch("/auth/logout");

  console.log(response);
  LocalStore.remove("userSession");
  return response.data;
};

export const handleSignup = async (
  username: string,
  sig: string | undefined
) => {
  const response = await api.post("/auth/signup", { username, sig });
  console.log(response);
  LocalStore.set("==============userSignUp=================", response.data);

  return response.data;
};
