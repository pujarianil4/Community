import React from "react";

import { useDispatch } from "react-redux";
import { store } from "@/contexts/store";
import { setUserData, setWalletRoute } from "@/contexts/reducers";

type ActionCreators = {
  setUserData: typeof setUserData;
  setWalletRoute: typeof setWalletRoute;
  // Add other actions here if needed
};

type UseReduxHook = {
  dispatch: ReturnType<typeof useDispatch>;
  actions: ActionCreators;
};

export default function useRedux<T>(selectors?: any): [UseReduxHook, any] {
  const dispatch = useDispatch();
  const actions: ActionCreators = {
    setUserData,
    setWalletRoute,
    // Add other actions here if needed
  };

  const selectedStates =
    selectors?.map((selector: any) => selector(store.getState())) || [];

  return [{ dispatch, actions }, selectedStates];
}
