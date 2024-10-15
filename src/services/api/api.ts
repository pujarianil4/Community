import axios, { AxiosInstance } from "axios";
import { store } from "@contexts/store";

const url = "https://community-slr7.onrender.com"; //process.env.BASE_API_URL;
export const api: AxiosInstance = axios.create({
  baseURL: url,
});
// TODO create seperate file for each catogery
// UI for notification

const updateAuthorizationHeader = () => {
  const token = store.getState().user?.token;

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
};

updateAuthorizationHeader();
store.subscribe(updateAuthorizationHeader);
