"use client";
import FeedPost from "@/components/feedPost/feedPost";
import React, { useState } from "react";
import Comments from "./comments/comments";
import { IPost } from "@/utils/types/types";

interface IProps {
  postData: IPost;
}
export default function PageContainer({ postData }: IProps) {
  const [commentCount, setCommentCount] = useState<number>(postData?.ccount);
  return (
    <main className='post_page'>
      {/* <Post post={postData} /> */}
      <FeedPost post={{ ...postData, ccount: commentCount }} />
      <Comments
        postId={postData?.id as number}
        setCommentCount={setCommentCount}
        status={postData?.sts}
      />
    </main>
  );
}
