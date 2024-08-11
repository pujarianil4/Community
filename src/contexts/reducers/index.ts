import { commonSlice } from "./common";
import { userSlice } from "./user";

export const { setUserData } = userSlice.actions;
export const { setWalletRoute } = commonSlice.actions;

export const userReducer = userSlice.reducer;
export const commonReducer = commonSlice.reducer;
