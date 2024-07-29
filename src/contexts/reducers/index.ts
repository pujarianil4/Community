import { userSlice } from "./user";

export const { setUserName } = userSlice.actions;

export const userReducer = userSlice.reducer;
