import { getUserID } from "@/utils/helpers";
import { api } from "./api";

// Fetch Communities
export const fetchCommunities = async ({
  sortby = "pCount",
  period = "",
  order = "DESC",
  page = 1,
  limit = 20,
}: {
  sortby: string;
  order: string;
  page: number;
  limit: number;
  period?: "hourly" | "daily" | "monthly" | "yearly" | "";
}) => {
  try {
    const uid = await getUserID();
    let url = `/community?sortBy=${sortby}&order=${order}&page=${page}&limit=${limit}&uid=${uid}`;

    if (period) {
      url += `&period=${period}`;
    }
    const response = await api.get(url);
    const data = Array.isArray(response?.data?.communities)
      ? response?.data?.communities
      : response?.data || [];
    return data;
  } catch (error) {
    console.error("Fetch Communities Error: ", error);
    throw error;
  }
};

// Create Community
export const createCommunity = async (data: any) => {
  try {
    const response = await api.post("/community", data);
    // await followApi({ fwid: response.data.id, typ: "c" });
    return response.data;
  } catch (error) {
    console.error("Create Community Error: ", error);
    throw error;
  }
};

// Fetch Community by Name
export const fetchCommunityByCname = async (cName: string) => {
  if (!cName) return null;
  try {
    const uid = await getUserID();
    const { data } = await api.get(`/community/cname/${cName}?uid=${uid}`);
    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Fetch Community by CName Error: ", error);
    throw error;
  }
};
