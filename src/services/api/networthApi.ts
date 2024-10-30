import { store } from "@contexts/store";
import { api } from "./api";

export const fetchNetworth = async () => {
  try {
    const { data } = await api.get(`/networth`);
    console.log("=========Fetche Networth==========", data);
    return data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    throw error;
  }
};
