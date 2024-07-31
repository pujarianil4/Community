import React from "react";

import { useSelector, useDispatch, Selector } from "react-redux";
import { RootState } from "@/contexts/store";
import { setUserData } from "@/contexts/reducers";

type ActionCreators = {
  setUserData: typeof setUserData;
  // Add other actions here if needed
};

type UseReduxHook = {
  dispatch: ReturnType<typeof useDispatch>;
  actions: ActionCreators;
};

export default function useRedux<T>(
  selectors?: Selector<RootState, T>[]
): [UseReduxHook, T[]] {
  const dispatch = useDispatch();
  const actions: ActionCreators = {
    setUserData,
    // Add other actions here if needed
  };

  const selectedStates =
    selectors?.map((selector) => useSelector(selector)) || [];

  return [{ dispatch, actions }, selectedStates];
}
