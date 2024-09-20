import { commonSlice } from "./common";
import { userSlice } from "./user";

export const { setUserData } = userSlice.actions;
export const {
  setWalletRoute,
  setRefetchCommunity,
  setRefetchPost,
  setRefetchUser,
  resetRefetch,
  setProposalVote,
} = commonSlice.actions;

export const userReducer = userSlice.reducer;
export const commonReducer = commonSlice.reducer;
