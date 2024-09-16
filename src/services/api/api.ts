import { getClientSideCookie } from "@/utils/helpers";
import { PublicKey } from "@solana/web3.js";

import axios, { AxiosInstance } from "axios";
import { store } from "@contexts/store";
import {
  IFollowAPI,
  IFollowersAPI,
  IPostCommentAPI,
  IUser,
  IVotePayload,
} from "@/utils/types/types";

const url = "https://community-slr7.onrender.com"; //process.env.BASE_API_URL;
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
  sig: `0x${string}` | string | undefined;
  msg: string;
  pubKey?: PublicKey | string | null;
}) => {
  const response = await api.post("/auth/login", payload);

  console.log("LOGIN_RES", response);
  // setToLocalStorage("userSession", response.data);
  return response.data;
};

export const handleLogOut = async () => {
  try {
    const response = await api.patch("/auth/logout");

    // removeFromLocalStorage("userSession");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const handleSignup = async (
  username: string | undefined,
  name: string | undefined,
  sig: string | undefined,
  msg: string,
  pubKey?: PublicKey | string | null
) => {
  try {
    const response = await api.post("/auth/signup", {
      username,
      name,
      sig,
      msg,
      pubKey,
    });
    console.log("==============userSignUp=================", response);
    // setToLocalStorage("userSession", response.data);
    return response.data;
  } catch (error) {
    console.error("SIGNUP_ERROR ", error);
    throw error;
  }
};

export const fetchUserByUserName = async (username: string) => {
  try {
    const response = await api.get(`/users/uname/${username}`);
    console.log("response", response.data);
    if (response.data) {
      return response.data;
    }
    throw new Error("user not available");
  } catch (error) {
    console.error("FETCH_BY_NAME_ERROR", error);
    throw error;
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
  if (!username) {
    return null;
  }
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

export const fetchCommunities = async (sortby: string) => {
  try {
    const response = await api.get(
      `/community?sortBy=${sortby}&order=desc&page=1&limit=20`
    );

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
  if (!cName) {
    return null;
  }
  try {
    const response = await api.get(`/community/cname/${cName}`);
    let isFollowed = false;

    if (response.data) {
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
    } else {
      throw new Error("user not available");
    }
  } catch (error) {
    console.error("Fetch Communities ", error);
    throw error;
  }
};

export const getPosts = async (sortby: string) => {
  console.log("sortBy", sortby);

  try {
    const response = await api.get(
      `/posts?sortBy=${sortby}&order=DESC&page=1&limit=20`
    );
    console.log("============Fetched all posts=============", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

export const getPostsBycName = async (cname: string) => {
  try {
    const response = await api.get(
      `/posts/community/cname/${cname}?page=1&limit=20`
    );
    console.log("============Fetched all posts=============", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

export const getPostsByuName = async (uname: string) => {
  try {
    const response = await api.get(`/posts/username/${uname}?page=1&limit=20`);
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

export const getPostsForMeta = async (postId: string) => {
  try {
    const response = await api.get(`/posts/${postId}`);
    const { text, media } = response.data;
    return { text, media };
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    return null;
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

export const getFollowinsByUserId = async ({ userId, type }: any) => {
  try {
    const response = await api.get(`/followers/fwng/${userId}?typ=${type}`);
    return response.data;
  } catch (error) {
    console.error("getFollowinsByUserId", error);
    throw error;
  }
};

export const getFollowersByUserId = async ({ userId, type }: IFollowersAPI) => {
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
    const response = await api.get(`/comments/post/${postId}?page=1&limit=100`);
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
  sig: `0x${string}` | string | undefined;
  msg: string;
  pubKey?: PublicKey | string;
}) => {
  const response = await api.post("/users/address", payload);

  console.log("LOGIN_RES", response);
  // setToLocalStorage("userSession", response.data);
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

    console.log("File uploaded successfully", response.data.url);
    return response.data.url;
  } catch (error) {
    console.error("Error uploading file", error);
    throw error;
  }
};

export const uploadMultipleFile = async (files: FileList) => {
  try {
    const formData = new FormData();

    Array.from(files).forEach((file, index) => {
      formData.append(`files`, file);
    });

    console.log("This is my form data!", formData);

    // Send a POST request with the form data and Bearer token
    const response = await api.post("/upload/multi", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error) {
    throw error;
    console.error("Upload failed:", error);
  }
};

// export const uploadMultipleFile = async (files: FileList) => {
//   try {
//     console.log("BEFORE", files);
//     const formData = new FormData();

//     // Append each file to the form data
//     // Array.from(files).forEach((file, index) => {
//     //   formData.append(`files[]`, file);
//     // });

//     for (let i = 0; i < files.length; i++) {
//       console.log("CURRENT_FILE", files[i]);
//       formData.append("files[]", files[i]);
//     }
//     console.log("UPLOAD_FILES", formData);

//     const response = await api.post("/upload/multi", files, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     console.log("Files uploaded successfully", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error uploading files", error);
//     throw error;
//   }
// };

// export const uploadMultipleFile = async (files: FileList) => {
//   try {
//     console.log("Selected Files:", files);

//     const formData = new FormData();

//     for (let i = 0; i < files.length; i++) {
//       formData.append(`files${i}`, fs.createReadStream(files[i]));
//     }

//     console.log("FormData before upload:", formData);

//     const response = await api.post("/upload/multi", formData, {
//       headers: {
//         "Content-Type": "multipart/form-data",
//       },
//     });

//     console.log("Files uploaded successfully", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error uploading files", error);
//     throw error;
//   }
// };

//fetch sessions

export const getSession = async () => {
  try {
    const response = await api.get("/users/sessions");
    return response.data;
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
    throw error;
  }
};

export const getUserData = async () => {
  try {
    const response = await api.patch("/users");
    return response.data;
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
    throw error;
  }
};

export const sendVote = async (payload: IVotePayload) => {
  try {
    const user = getClientSideCookie("authToken");
    const response = await api.post("/vote", { ...payload, uid: user?.uid });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// remove Address
export const removeAddress = async (address: string) => {
  try {
    const response = await api.patch("/users/address/remove", {
      address: address,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//remove Session
export const removeSession = async (sessionId: string) => {
  try {
    const response = await api.patch(`/users/session/${sessionId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
