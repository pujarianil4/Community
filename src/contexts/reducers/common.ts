import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Common {
  walletRoute: string;
  refetch: {
    post: boolean;
    user: boolean;
    community: boolean;
  };
  proposalVote: boolean;
}

//TODO update Later
const initialState: Common = {
  walletRoute: "auth",
  refetch: {
    post: false,
    user: false,
    community: false,
  },
  proposalVote: false,
};

export const commonSlice = createSlice({
  name: "common",
  initialState,
  reducers: {
    setWalletRoute: (state, action: PayloadAction<string>) => {
      state.walletRoute = action.payload;
    },
    setRefetchUser: (state, action: PayloadAction<boolean>) => {
      state.refetch.user = action.payload;
    },
    setRefetchPost: (state, action: PayloadAction<boolean>) => {
      state.refetch.post = action.payload;
    },
    setRefetchCommunity: (state, action: PayloadAction<boolean>) => {
      state.refetch.community = action.payload;
    },
    setProposalVote: (state, action: PayloadAction<boolean>) => {
      state.proposalVote = action.payload;
    },
    resetRefetch: (state) => {
      state.refetch.community = false;
      state.refetch.post = false;
      state.refetch.user = false;
    },
  },
});
