"use client";
import useAsync from "@/hooks/useAsync";
import { getPosts, getPostsBycName, getPostsByuName } from "@/services/api/api";
import { useParams } from "next/navigation";
import React from "react";
import FeedPost from "./feedPost";

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

  const { isLoading, data } = useAsync(getFunctionByMethod[method], userId);

  console.log("data", data);

  return (
    <>
      {!isLoading && data ? (
        data.map((post: any) => <FeedPost key={post.id} post={post} />)
      ) : (
        <h1>Loading...</h1>
      )}
    </>
  );
}
