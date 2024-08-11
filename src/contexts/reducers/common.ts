import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Common {
  walletRoute: string;
}

//TODO update Later
const initialState: Common = {
  walletRoute: "auth",
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setWalletRoute: (state, action: PayloadAction<string>) => {
      state.walletRoute = action.payload;
    },
  },
});
