import { commonSlice } from "./common";
import { userSlice } from "./user";

export const { setUserData, setUserError, setUserLoading } = userSlice.actions;
export const {
  setWalletRoute,
  setRefetchCommunity,
  setRefetchPost,
  setRefetchUser,
  resetRefetch,
  setProposalData,
  setNavbarSearch,
} = commonSlice.actions;

export const userReducer = userSlice.reducer;
export const commonReducer = commonSlice.reducer;
