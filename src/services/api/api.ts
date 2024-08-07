import { removeFromLocalStorage } from "./../../utils/helpers/index";
import { setToLocalStorage } from "@/utils/helpers";
import axios, { AxiosInstance } from "axios";
import { store } from "@contexts/store";
import { User } from "@/utils/types/types";

const url = process.env.BASE_API_URL;
const api: AxiosInstance = axios.create({
  baseURL: url,
});

const updateAuthorizationHeader = () => {
  const token = store.getState().user?.token;
  // const value = winodw && localStorage?.getItem("userSession");
  // const userSession: any = value ? JSON.parse(value) : null;
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
  //if (userSession?.token) {
  // api.defaults.headers.common[
  //   "Authorization"
  // ] = `Bearer ${userSession?.token}`;
  //} else
  else {
    delete api.defaults.headers.common["Authorization"];
  }
};

updateAuthorizationHeader();
store.subscribe(updateAuthorizationHeader);

export const handleLogIn = async (payload: {
  sig: `0x${string}` | undefined;
  msg: string;
}) => {
  const response = await api.post("/auth/login", payload);

  console.log("LOGIN_RES", response);
  setToLocalStorage("userSession", response.data);
  return response.data;
};

export const handleLogOut = async () => {
  console.log("api1", url);
  const response = await api.patch("/auth/logout");

  console.log(response);
  removeFromLocalStorage("userSession");
  return response.data;
};

export const handleSignup = async (
  username: string,
  sig: string | undefined
) => {
  try {
    const response = await api.post("/auth/signup", { username, sig });
    console.log("==============userSignUp=================", response);
    setToLocalStorage("userSession", response.data);
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

export const fetchUser = async (username: string) => {
  try {
    const response = await api.get(`/users/${username}`);

    return response.data;
  } catch (error) {
    console.error("Fetch User ", error);
  }
};

export const updateUser = async (payload: Partial<User>) => {
  try {
    const response = await api.patch("/users", payload);

    return response.data;
  } catch (error) {
    console.error("UpdateUser ", error);
  }
};

export const fetchCommunities = async () => {
  try {
    const response = await api.get("/community");

    return response.data;
  } catch (error) {
    console.error("Fetch Communities ", error);
  }
};

export const createCommunity = async (data: any) => {
  try {
    const response = await api.post("/community", data);
    return response.data;
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
  }
};

export const fetchCommunityByCname = async (cName: string) => {
  try {
    const response = await api.get(`/community/${cName}`);

    return response.data;
  } catch (error) {
    console.error("Fetch Communities ", error);
  }
};

export const getPosts = async () => {
  try {
    const response = await api.get("/posts");
    console.log("============Fetched all posts=============", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
  }
};

export const patchPost = async (data: any) => {
  try {
    const response = await api.patch("/posts", data);
    console.log("============Fetched all posts=============", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
  }
};
