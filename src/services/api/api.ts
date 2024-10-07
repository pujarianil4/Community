import { getClientSideCookie } from "@/utils/helpers";
import { PublicKey } from "@solana/web3.js";

import axios, { AxiosInstance } from "axios";
import { store } from "@contexts/store";
import {
  ICreateProposalPayload,
  IFollowAPI,
  IFollowersAPI,
  IPostCommentAPI,
  IUser,
  IVotePayload,
  IVoteProposalPayload,
} from "@/utils/types/types";

const url = "https://community-slr7.onrender.com"; //process.env.BASE_API_URL;
export const api: AxiosInstance = axios.create({
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


export const handlePostToCommunity = async (data: any) => {
  try {
    const response = await api.post("/posts", data);
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
    throw error;
  }
};







export const fetchCommunities = async (sortby: string) => {
  const uid = store.getState().user?.uid;
  try {
    const response = await api.get(
      `/community?sortBy=${sortby}&order=DESC&page=1&limit=20&uid=${uid}`
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
  const uid = store.getState().user?.uid;

  if (!cName) {
    return null;
  }
  try {
    const { data } = await api.get(`/community/cname/${cName}?uid=${uid}`);
    return Array.isArray(data) ? data[0] : data;
    // if (response.data) {
    //   if (response?.data?.id) {
    //     isFollowed = await isUserFollowed({
    //       fwid: response?.data?.id,
    //       type: "c",
    //     });
    //   }
    //   return {
    //     ...response.data,
    //     isFollowed,
    //   };
    // } else {
    //   throw new Error("user not available");
    // }
  } catch (error) {
    console.error("Fetch Communities ", error);
    throw error;
  }
};

export const getPosts = async ({
  sortby = "time",
  order = "DESC",
  page = 1,
  limit = 20,
}: {
  sortby: string;
  order: string;
  page: number;
  limit: number;
}) => {
  const uid = store.getState().user?.uid;

  try {
    const response = await api.get(
      `/posts?sortBy=${sortby}&order=${order}&page=${page}&limit=${limit}&uid=${uid}`
    );
    console.log("============Fetched all posts=============", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

export const getPostsBycName = async ({
  nameId,
  page = 1,
  limit = 20,
}: {
  nameId: string;
  page: number;
  limit: number;
}) => {
  const uid = store.getState().user?.uid;
  try {
    const response = await api.get(
      `/posts/community/cname/${nameId}?page=${page}&limit=${limit}&uid=${uid}`
    );
    console.log("=========Fetched all posts By Cname=========", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

export const getPostsByuName = async ({
  nameId,
  page = 1,
  limit = 20,
}: {
  nameId: string;
  page: number;
  limit: number;
}) => {
  const uid = store.getState().user?.uid;
  try {
    const response = await api.get(
      `/posts/username/${nameId}?page=${page}&limit=${limit}&uid=${uid}`
    );
    console.log("=========Fetched all posts By Uname==========", response.data);
    return response.data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};

export const getPostsByPostId = async (postId: string) => {
  const uid = store.getState().user?.uid;
  try {
    const response = await api.get(`/posts/${postId}?uid=${uid}`);
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
  const uid = store.getState().user?.uid;
  try {
    const response = await api.get(
      `/comments/post/${postId}?page=1&limit=100&uid=${uid}`
    );
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



export const isUserFollowed = async ({
  fwid,
  type,
}: {
  fwid: string;
  type: string;
}) => {
  const uid = store.getState().user?.uid;

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

export const UnFollowAPI = async ({
  fwid,
  type,
}: {
  fwid: string;
  type: string;
}) => {
  try {
    const response = await api.delete(`/followers/${fwid}?typ=${type}`);
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
    console.error("Upload failed:", error);
    throw error;
  }
};

//fetch sessions




export const sendVote = async (payload: IVotePayload) => {
  try {
    const user = getClientSideCookie("authToken");
    const response = await api.post("/vote", { ...payload, uid: user?.uid });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//GOVERNANCE
export const createProposal = async (payload: ICreateProposalPayload) => {
  try {
    const { data } = await api.post(`/governance/proposal`, payload);
    console.log("=====New Proposal Created=====");
    return data;
  } catch (error) {
    console.error("Proposal_Error", error);
    throw error;
  }
};

export const fetchAllProposals = async ({
  page = 1,
  limit = 10,
}: {
  page: number;
  limit: number;
}) => {
  const uid = store.getState().user?.uid;
  try {
    const { data } = await api.get(
      `/governance/proposal?page=${page}&limit=${limit}&uid=${uid}`
    );
    return data;
  } catch (error) {
    console.error("Fetch_Proposals_Error", error);
    throw error;
  }
};

export const fetchProposalsByCId = async ({
  cid,
  page = 1,
  limit = 10,
}: {
  cid: number;
  page: number;
  limit: number;
}) => {
  const uid = store.getState().user?.uid;
  try {
    const { data } = await api.get(
      `/governance/proposal/c/${cid}?page=${page}&limit=${limit}&uid=${uid}`
    );
    return data;
  } catch (error) {
    console.error("Fetch_Proposals_Error", error);
    throw error;
  }
};

export const fetchProposalByID = async (proposalId: number) => {
  const uid = store.getState().user?.uid;
  try {
    const { data } = await api.get(
      `/governance/proposal/${proposalId}?uid=${uid}`
    );

    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Fetch_ProposalByID_Error", error);
    throw error;
  }
};

export const voteToProposal = async (payload: IVoteProposalPayload) => {
  try {
    const { data } = await api.post(`/governance/vote`, payload);
    console.log("=====Proposal Vote=====");
    return data;
  } catch (error) {
    console.error("Vote Proposal Error", error);
    throw error;
  }
};








