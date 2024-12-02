"use client";
import FeedPost from "@/components/feedPost/feedPost";
import React, { useEffect, useState } from "react";
import Comments from "./comments/comments";
import { IPost } from "@/utils/types/types";
import { useParams } from "next/navigation";
import { getPostsByPostId } from "@/services/api/postApi";
import useAsync from "@/hooks/useAsync";

interface IProps {
  postData: IPost;
}
export default function PageContainer() {
  const { postId } = useParams<{ postId: string }>();
  const { data: postData } = useAsync(getPostsByPostId, postId);
  const [commentCount, setCommentCount] = useState<number>(postData?.ccount);

  useEffect(() => {
    setCommentCount(postData?.ccount);
  }, [postData]);
  return (
    <>
      {postData && (
        <main className='post_page'>
          {/* <Post post={postData} /> */}
          <FeedPost post={{ ...postData, ccount: commentCount }} />
          <Comments
            postId={postData?.id as number}
            setCommentCount={setCommentCount}
            status={postData?.sts}
          />
        </main>
      )}
    </>
  );
}
