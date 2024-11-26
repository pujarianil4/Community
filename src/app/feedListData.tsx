"use client";

import { useEffect, useState } from "react";
import FeedList from "@/components/feedPost/feedList";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";

export default function FeedListData() {
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);

  const [id, setId] = useState<string | null>(null);

  useEffect(() => {
    if (user?.profile?.id) {
      setId(user.profile.id);
    } else {
      setId(null);
    }
  }, [user?.profile?.id]);

  return (
    <>
      <FeedList method='allPosts' id={id} sortby='time' order='DESC' />
    </>
  );
}
