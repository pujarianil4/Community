import { api } from "./api";

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
