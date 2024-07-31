import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface User {
  username: string;
  name: string;
  uid: number;
  token: string;
}

const initialState: User = {
  username: "",
  name: "",
  uid: 0,
  token: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<User>) => {
      state.username = action.payload.username;
      state.name = action.payload.name;
      state.uid = action.payload.uid;
      state.token = action.payload.token;
    },
  },
});

// Action creators are generated for each case reducer function
