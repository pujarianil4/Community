import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { store } from "@/contexts/store";
import {
  setUserData,
  setWalletRoute,
  setRefetchCommunity,
  setRefetchPost,
  setRefetchUser,
  resetRefetch,
  setProposalVote,
} from "@/contexts/reducers";

type ActionCreators = {
  setUserData: typeof setUserData;
  setWalletRoute: typeof setWalletRoute;
  setRefetchCommunity: typeof setRefetchCommunity;
  setRefetchPost: typeof setRefetchPost;
  setRefetchUser: typeof setRefetchUser;
  resetRefetch: typeof resetRefetch;
  setProposalVote: typeof setProposalVote;
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
    setRefetchCommunity,
    setRefetchPost,
    setRefetchUser,
    resetRefetch,
    setProposalVote,
    // Add other actions here if needed
  };

  // const selectedStates =
  //   selectors?.map((selector: any) => useSelector(selector)) || [];
  // const selectedStates =
  //   selectors?.map((selector: any) => selector(store.getState())) || [];

  const [selectedStates, setSelectedStates] = useState<T[]>(
    selectors?.map((selector: any) => selector(store.getState()))
  );

  useEffect(() => {
    const handleChange = () => {
      setSelectedStates(
        selectors?.map((selector: any) => selector(store.getState()))
      );
    };

    const unsubscribe = store.subscribe(handleChange);
    return () => {
      unsubscribe();
    };
  }, [selectors]);
  return [{ dispatch, actions }, selectedStates];
}
