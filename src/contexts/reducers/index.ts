import { userSlice } from "./user";

export const { setUserData } = userSlice.actions;

export const userReducer = userSlice.reducer;
