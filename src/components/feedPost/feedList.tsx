"use client";
import React from "react";
import useAsync from "@/hooks/useAsync";
import { getPosts, getPostsBycName, getPostsByuName } from "@/services/api/api";
import { useParams } from "next/navigation";
import FeedPost from "./feedPost";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";

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

  const { isLoading, data: posts } = useAsync(
    getFunctionByMethod[method],
    userId || communityId
  );

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
