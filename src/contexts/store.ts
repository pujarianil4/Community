import { userReducer, commonReducer } from "./reducers/index";
import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";

export const store = configureStore({
  reducer: {
    user: userReducer,
    common: commonReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
