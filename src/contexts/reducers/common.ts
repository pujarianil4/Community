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
  proposal: {
    isVoted: boolean;
    yes: number;
    no: number;
  };
  navbarSearch: {
    pill: {
      img: string;
      label: string;
      type: "c" | "u" | null;
    };
    searchVal: string;
  };
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
  proposal: {
    isVoted: false,
    yes: 0,
    no: 0,
  },
  navbarSearch: {
    pill: {
      img: "",
      label: "",
      type: null,
    },
    searchVal: "",
  },
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
    setProposalData: (state, action) => {
      state.proposal.isVoted = action.payload.isVoted;
      state.proposal.yes = action.payload.yes;
      state.proposal.no = action.payload.no;
    },
    setNavbarSearch: (state, action) => {
      state.navbarSearch.searchVal = action.payload.searchVal;
      state.navbarSearch.pill = action.payload.pill;
    },
    resetRefetch: (state) => {
      state.refetch.community = false;
      state.refetch.post = false;
      state.refetch.user = false;
    },
  },
});
