import { LocalStore } from "@/utils/helpers";
import axios, { AxiosInstance } from "axios";
import { store } from "@contexts/store";

const userSession = LocalStore.get("userSession");
const url = process.env.BASE_API_URL;
console.log("api2", url, userSession);

const api: AxiosInstance = axios.create({
  baseURL: url,
});

const updateAuthorizationHeader = () => {
  const token = store.getState().user?.token;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else if (userSession?.token) {
    api.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${userSession?.token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

updateAuthorizationHeader();
store.subscribe(updateAuthorizationHeader);

export const handleLogIn = async (sign: `0x${string}` | undefined) => {
  const response = await api.post("/auth/login", {
    sig: sign,
  });

  console.log("LOGIN_RES", response);
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
  try {
    const response = await api.post("/auth/signup", { username, sig });
    console.log("==============userSignUp=================", response);
    LocalStore.set("userSession", response.data);
    return response.data;
  } catch (error) {
    console.error("SIGNUP_ERROR ", error);
  }
};

export const handlePostToCommunity = async (data: any) => {
  try {
    const response = await api.post("/posts", data);
    console.log("============Posted successfully=============", response);
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
  }
};
