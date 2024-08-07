"use client";
import useAsync from "@/hooks/useAsync";
import { getPosts, getUserById } from "@/services/api/api";
import React, { useEffect } from "react";
import FeedPost from "./feedPost";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";

export default function FeedList() {
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);
  const { data: userData, error } = useAsync(getUserById, user.uid);
  const { isLoading, data: posts } = useAsync(getPosts);
  console.log("USER_DATA", userData);

  // useEffect(() => {
  //   dispatch(actions.setUserData(userData));
  // }, [user]);
  return (
    <>
      {!isLoading && posts ? (
        posts?.map((post: any) => <FeedPost key={post.id} post={post} />)
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}
