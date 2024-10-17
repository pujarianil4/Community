import { store } from "@contexts/store";
import { api } from "./api";
import { followApi } from "./userApi";

// Fetch Communities
export const fetchCommunities = async ({
  sortby = "pCount",
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
      `/community?sortBy=${sortby}&order=${order}&page=${page}&limit=${limit}&uid=${uid}`
    );
    return response.data;
  } catch (error) {
    console.error("Fetch Communities Error: ", error);
    throw error;
  }
};

// Create Community
export const createCommunity = async (data: any) => {
  try {
    const response = await api.post("/community", data);
    await followApi({ fwid: response.data.id, typ: "c" });
    return response.data;
  } catch (error) {
    console.error("Create Community Error: ", error);
    throw error;
  }
};

// Fetch Community by Name
export const fetchCommunityByCname = async (cName: string) => {
  const uid = store.getState().user?.uid;
  if (!cName) return null;
  try {
    const { data } = await api.get(`/community/cname/${cName}?uid=${uid}`);
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Fetch Community by CName Error: ", error);
    throw error;
  }
};
