import React from "react";

import { useSelector, useDispatch, Selector } from "react-redux";
import { RootState } from "@/contexts/store";
import { setUserName } from "@/contexts/reducers";

type ActionCreators = {
  setUserName: typeof setUserName;
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
    setUserName,
    // Add other actions here if needed
  };

  const selectedStates =
    selectors?.map((selector) => useSelector(selector)) || [];

  return [{ dispatch, actions }, selectedStates];
}
