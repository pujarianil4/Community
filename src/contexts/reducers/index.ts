import { commonSlice } from "./common";
import { userSlice } from "./user";
import { notifications } from "./notificationSlice";
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

export const { addNotification, markAsRead, clearNotifications } =
  notifications.actions;

export const userReducer = userSlice.reducer;
export const commonReducer = commonSlice.reducer;
export const notificationsReducer = notifications.reducer;
