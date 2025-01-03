import { createSlice, PayloadAction } from "@reduxjs/toolkit";
// import { Notification } from '../types/notificationTypes';

interface NotificationsState {
  notifications: any;
  unreadCount: number;
}

const initialState: NotificationsState = {
  notifications: [],
  unreadCount: 0,
};

export const notifications = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
      state.unreadCount += 1;
    },
    markAsRead: (state) => {
      state.unreadCount = 0;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
  },
});
