"use client";
import { getUserProfile } from "@/services/api/userApi";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";
import { setUserData, setUserError, setUserLoading } from "./reducers";
import { store } from "./store";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<typeof store>(store);
  // const profile = useAppSelector((state) => state.user.profile);
  // if (!storeRef.current) {
  //   // Create the store instance the first time this renders
  //   storeRef.current = store;
  // }

  useEffect(() => {
    const state = storeRef.current?.getState();
    const profile = state?.user;
    console.log(
      "profile",
      profile,
      profile && Object.keys(profile).length == 0
    );
    // Object.keys(profile).length;
    const user = getUserProfile().then((user) => {});
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
