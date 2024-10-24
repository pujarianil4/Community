import { api } from "./api";
import { store } from "@contexts/store";
import { IFollowersAPI, IUser } from "@/utils/types/types";
import { PublicKey } from "@solana/web3.js";

import { IFollowAPI, IPostCommentAPI, IVotePayload } from "@/utils/types/types";
import { getClientSideCookie } from "@/utils/helpers";
import { setUserData, setUserError, setUserLoading } from '@/contexts/reducers';

// Follow API
export const followApi = async (data: IFollowAPI) => {
  try {
    const response = await api.post("/followers", data);
    return response.data;
  } catch (error) {
    console.error("Follow API Error: ", error);
    throw error;
  }
};

// unfollow api
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

// Vote
export const sendVote = async (payload: IVotePayload) => {
  try {
    const user = getClientSideCookie("authToken");
    const response = await api.post("/vote", { ...payload, uid: user?.uid });
    return response.data;
  } catch (error) {
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

export const fetchUser = async (username: string) => {
  const uid = store.getState().user?.profile.uid;
  if (!username) {
    return null;
  }
  try {
    const { data } = await api.get(`/users/uname/${username}?uid=${uid}`);
    return Array.isArray(data) ? data[0] : data;
    // const isFollowed = await isUserFollowed({
    //   fwid: response?.data?.id,
    //   type: "u",
    // });
    // console.log("CHECK_U", response.data);
    // return {
    //   ...response.data,
    //   isFollowed,
    // };
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

export const getUserProfile = async () => {
  store.dispatch(setUserLoading())
  try {
    const response = await api.get(`/users/me`);
   
    console.log("responseUSer", response.data);
    
  store.dispatch(setUserData(response.data))
    return response.data;
  } catch (error) {
    console.error("Fetch User ", error);
    store.dispatch(setUserError("failed"))
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

export const getFollowinsByUserId = async ({
  userId,
  type,
  page = 1,
  limit = 20,
}: {
  userId: number;
  type: string;
  page: number;
  limit: number;
}) => {
  try {
    const response = await api.get(
      `/followers/fwng/${userId}?typ=${type}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("getFollowinsByUserId", error);
    throw error;
  }
};

export const getFollowersByUserId = async ({
  userId,
  type,
  page = 1,
  limit = 20,
}: {
  userId: number;
  type: string;
  sortby: string;
  order: string;
  page: number;
  limit: number;
}) => {
  try {
    const response = await api.get(
      `/followers/fwrs/${userId}?typ=${type}&page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error) {
    console.error("getFollowinsByUserId", error);
    throw error;
  }
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

export const getSession = async () => {
  try {
    const response = await api.get("/users/sessions");
    return response.data;
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
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

export const getUserData = async () => {
  try {
    const response = await api.patch("/users");
    return response.data;
  } catch (error) {
    console.error("POSTS_ERROR: ", error);
    throw error;
  }
};

export const fetchDelegatesByUname = async (payload: {
  username: string;
  type: "dgte" | "dgtr";
  page: number;
  limit: number;
}) => {
  const { username, type, page, limit } = payload;
  try {
    const { data } = await api.get(
      `/governance/delegate/${username}?page=${page}&limit=${limit}&typ=${type}`
    );
    return data;
  } catch (error) {
    console.error("Fetch_Proposals_Error", error);
    throw error;
  }
};

export const undoDelegateNetWorth = async (delegateId: number) => {
  try {
    const response = await api.post(`/governance/delegate/undo/${delegateId}`);
    console.log("=====Undo Delegate Successful=====");
  } catch (error) {
    console.error("Delegate Error", error);
    throw error;
  }
};

export const delegateNetWorth = async (userId: number) => {
  try {
    const response = await api.post(`/governance/delegate/${userId}`);
    console.log("=====Delegate Successful=====");
  } catch (error) {
    console.error("Delegate Error", error);
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
  const uid = store.getState().user?.profile.uid;

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
