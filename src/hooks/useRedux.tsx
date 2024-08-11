import React from "react";

import { useSelector, useDispatch, Selector } from "react-redux";
import { RootState, store } from "@/contexts/store";
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

  console.log("selectors", selectors, selectedStates);

  return [{ dispatch, actions }, selectedStates];
}
