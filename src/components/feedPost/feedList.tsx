"use client";
import React, { useEffect } from "react";
import useAsync from "@/hooks/useAsync";
import { getPosts, getPostsBycName, getPostsByuName } from "@/services/api/api";
import { useParams } from "next/navigation";
import FeedPost from "./feedPost";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { useSelector } from "react-redux";

const getFunctionByMethod = {
  allPosts: getPosts,
  byCName: getPostsBycName,
  byUName: getPostsByuName,
};

interface IFeedList {
  method: keyof typeof getFunctionByMethod;
}

export default function FeedList({ method }: IFeedList) {
  const { userId, communityId } = useParams<{
    userId: string;
    communityId: string;
  }>();

  const {
    isLoading,
    data: posts,
    refetch,
  } = useAsync(getFunctionByMethod[method], userId || communityId);

  const refetchRoute = (state: RootState) => state?.common.refetch.user;
  const [{ dispatch, actions }, [refetchData]] = useRedux([refetchRoute]);

  useEffect(() => {
    console.log("refetchData?.user", refetchData);

    if (refetchData == true) {
      refetch();
      dispatch(actions.resetRefetch());
    }
  }, [refetchData]);

  return (
    <>
      {posts ? (
        posts?.map((post: any) => <FeedPost key={post.id} post={post} />)
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}
