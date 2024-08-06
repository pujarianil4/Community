"use client";
import useAsync from "@/hooks/useAsync";
import { getPosts } from "@/services/api/api";
import React from "react";
import FeedPost from "./feedPost";

export default function FeedList() {
  const { isLoading, data } = useAsync(getPosts);
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
