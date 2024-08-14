import { removeFromLocalStorage } from "./../../utils/helpers/index";
import { setToLocalStorage } from "@/utils/helpers";
import axios, { AxiosInstance } from "axios";
import { store } from "@contexts/store";
import {
  IFollowAPI,
  IFollowersAPI,
  IPostCommentAPI,
  IUser,
} from "@/utils/types/types";

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
  name: string,
  sig: string | undefined,
  msg: string
) => {
  try {
    const response = await api.post("/auth/signup", {
      username,
      name,
      sig,
      msg,
    });
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

    return response.data;
  } catch (error) {
    console.error("FETCH_BY_NAME_ERROR", error);
  }
};

export const handlePostToCommunity = async (data: any) => {
  try {
    const response = await api.post("/posts", data);
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
    throw error;
  }
};

export const fetchUser = async (username: string) => {
  try {
    const response = await api.get(`/users/uname/${username}`);
    const isFollowed = await isUserFollowed({
      fwid: response?.data?.id,
      type: "u",
    });

    return {
      ...response.data,
      isFollowed,
    };
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

export const updateUser = async (payload: Partial<IUser>) => {
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
    let isFollowed = false;

    if (response?.data?.id) {
      isFollowed = await isUserFollowed({
        fwid: response?.data?.id,
        type: "c",
      });
    }
    return {
      ...response.data,
      isFollowed,
    };
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
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
  }
};

export const patchPost = async (data: any) => {
  try {
    const response = await api.patch("/posts", data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
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

export const getFollowersByUserId = async ({ userId, type }: IFollowersAPI) => {
  console.log(userId, type);

  try {
    const response = await api.get(`/followers/fwrs/${userId}?typ=${type}`);
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

export const fetchComments = async (postId: string) => {
  try {
    const response = await api.get(`/comments/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("COMMENTS_ERROR: ", error);
  }
};

export const postComments = async (data: IPostCommentAPI) => {
  try {
    const response = await api.post("/comments", data);
    return response.data;
  } catch (error) {
    console.error("POST_COMMENT_ERROR: ", error);
  }
};
export const linkAddress = async (payload: {
  sig: `0x${string}` | undefined;
  msg: string;
}) => {
  const response = await api.post("/users/address", payload);

  console.log("LOGIN_RES", response);
  setToLocalStorage("userSession", response.data);
  return response.data;
};

export const getAddressesByUserId = async (userId: string) => {
  if (userId == "0") {
    return null;
  }
  try {
    const response = await api.get(`/users/address/${userId}`);
    return response.data;
  } catch (error) {
    console.error("getFollowinsByUserId", error);
    throw error;
  }
};

export const isUserFollowed = async ({
  fwid,
  type,
}: {
  fwid: string;
  type: string;
}) => {
  const uid = store.getState().user?.uid;

  console.log("UID", uid);

  try {
    const response = await api.get(
      `/followers/isFollow/${uid}?fwid=${fwid}&typ=${type}`
    );
    return response.data;
  } catch (error) {
    console.error("getFollowinsByUserId", error);
    throw error;
  }
};

export const UnFollowAPI = async (id: string) => {
  try {
    const response = await api.delete(`/followers/${id}`);
    return response.data;
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
    throw error;
  }
};

export const uploadSingleFile = async (file: File) => {
  try {
    // Create a new FormData instance
    const formData = new FormData();

    // Append the file to the form data
    formData.append("file", file);

    const response = await api.post("/upload/single", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("File uploaded successfully", response.data);
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};
