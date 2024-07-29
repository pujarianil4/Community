import { LocalStore } from "@/utils/helpers";
import axios from "axios";

const userSession = LocalStore.get("userSession");
const url = process.env.BASE_API_URL;
const api = axios.create({
  baseURL: url,
  headers: { Authorization: `bearer ${userSession?.token}` },
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
  const response = await api.patch("/auth/logout");

  console.log(response);
  LocalStore.remove("userSession");
  return response.data;
};
