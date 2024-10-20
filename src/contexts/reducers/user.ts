import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { IUser } from '@/utils/types/types';

// export interface User {
//   username: string;
//   name: string;
//   uid: number;
//   token?: string;
//   img: string;
//   sid: number;
//   netWrth: number;
//   effectiveNetWrth: number;
// }

interface state{
  profile: IUser,
  isLoading: boolean,
  error: string
}


//TODO update Later
const initialState: state = {

  profile: {} as IUser,
  isLoading: false,
  error: ""

};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<IUser>) => {
      console.log("setUserData", action);
      
     state.profile= action.payload
     state.isLoading = false,
     state.error = ""
    },
    setUserLoading: (state) => {
      state.isLoading = true;
    },
    setUserError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});
