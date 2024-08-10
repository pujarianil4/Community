import { removeFromLocalStorage } from "./../../utils/helpers/index";
import { setToLocalStorage } from "@/utils/helpers";
import axios, { AxiosInstance } from "axios";
import { store } from "@contexts/store";
import { IFollowAPI, User } from "@/utils/types/types";

const url = process.env.BASE_API_URL;
const api: AxiosInstance = axios.create({
  baseURL: url,
});
// TODO create seperate file for each catogery
// UI for notification
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
  // else {
  //   delete api.defaults.headers.common["Authorization"];
  // }
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
  try {
    const response = await api.patch("/auth/logout");

    removeFromLocalStorage("userSession");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleSignup = async (
  username: string,
  sig: string | undefined,
  msg: string
) => {
  try {
    const response = await api.post("/auth/signup", { username, sig, msg });
    console.log("==============userSignUp=================", response);
    setToLocalStorage("userSession", response.data);
    return response.data;
  } catch (error) {
    console.error("SIGNUP_ERROR ", error);
    throw error;
  }
};

export const fetchUserByUserName = async (username: string) => {
  try {
    const response = await api.get(`/users/uname/${username}`);
    console.log(
      "==========fetchUserByUserName successfully===========",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("FETCH_BY_NAME_ERROR", error);
  }
};

export const handlePostToCommunity = async (data: any) => {
  try {
    const response = await api.post("/posts", data);
    console.log("============Posted successfully=============", response);
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
    throw error;
  }
};

export const fetchUser = async (username: string) => {
  try {
    const response = await api.get(`/users/uname/${username}`);

    return response.data;
  } catch (error) {
    console.error("Fetch User ", error);
    throw error;
  }
};

export const fetchUserById = async (id: string) => {
  try {
    const response = await api.get(`/users/${id}`);

    return response.data;
  } catch (error) {
    console.error("Fetch User ", error);
    throw error;
  }
};

export const updateUser = async (payload: Partial<User>) => {
  try {
    const response = await api.patch("/users", payload);

    return response.data;
  } catch (error) {
    console.error("UpdateUser ", error);
    throw error;
  }
};

export const fetchCommunities = async () => {
  try {
    const response = await api.get("/community");

    return response.data;
  } catch (error) {
    console.error("Fetch Communities ", error);
    throw error;
  }
};

export const createCommunity = async (data: any) => {
  try {
    const response = await api.post("/community", data);
    return response.data;
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
    throw error;
  }
};

export const fetchCommunityByCname = async (cName: string) => {
  try {
    const response = await api.get(`/community/cname/${cName}`);

    return response.data;
  } catch (error) {
    console.error("Fetch Communities ", error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const response = await api.get("/posts");
    console.log("============Fetched all posts=============", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

export const getPostsBycName = async (cname: string) => {
  try {
    const response = await api.get(`/posts/community/cname/${cname}`);
    console.log("============Fetched all posts=============", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

export const getPostsByuName = async (uname: string) => {
  try {
    const response = await api.get(`/posts/uname/${uname}`);
    console.log("============Fetched all posts=============", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

export const getPostsByPostId = async (postId: string) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    console.log("============Fetched Post=============", response.data);
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
    throw error;
  }
};

export const getUserById = async (userId: string) => {
  try {
    const response = await api.get(`/users/${userId}`);

    return response.data;
  } catch (error) {
    console.error("GET_USER_BY_ID_ERROR", error);
    throw error;
  }
};

export const getFollowinsByUserId = async (userId: string) => {
  try {
    const response = await api.get(`/followers/fwng/${userId}`);
    return response.data;
  } catch (error) {
    console.error("getFollowinsByUserId", error);
    throw error;
  }
};

export const followApi = async (data: IFollowAPI) => {
  try {
    const response = await api.post("/followers", data);
    return response.data;
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
    throw error;
  }
};
