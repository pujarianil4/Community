import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { parseCookies } from "nookies";

export interface User {
  username: string;
  name: string;
  uid: number;
  token?: string;
  img: string;
}
const cookies = parseCookies();
const auth = cookies?.authToken;

const userData: any = auth && JSON.parse(auth);

//TODO update Later
const initialState: User = {
  username: userData?.username || "",
  name: userData?.name || "",
  uid: userData?.uid || 0,
  token: userData?.token || "",
  img: userData?.img,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.username = action.payload?.username;
      state.name = action.payload?.name;
      state.uid = action.payload?.uid;
      state.token = action.payload?.token;
      state.img = action.payload?.img;
    },
  },
});
