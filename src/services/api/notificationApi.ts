import { api } from "./api";
import { store } from "@contexts/store";
import { IUser } from "@/utils/types/types";

import { IFollowAPI, IVotePayload } from "@/utils/types/types";
import { getUserID } from "@/utils/helpers";
import { setUserData, setUserError, setUserLoading } from "@/contexts/reducers";

export const getNotification = async (userId: number) => {
  console.log("useridf", userId);
  try {
    const response = await api.get(`/notification-ws/?userId=${userId}`);
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
