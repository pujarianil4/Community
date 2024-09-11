// "use client";

import React from "react";
import PageWraper from "@/components/Wrapers/PageWraper";
import "./index.scss";
import Comments from "./comments";
import Post from "./post";
import { getPostsByPostId } from "@/services/api/api";
import FeedPost from "@/components/feedPost/feedPost";

interface Iprops {
  params: any;
}

export default async function PostPage({ params }: Iprops) {
  const { postId } = params;
  const postData = await getPostsByPostId(postId);
  return (
    <PageWraper hideRightPanel>
      <main className='post_page'>
        {/* <Post post={postData} /> */}
        <FeedPost post={postData} />
        <Comments postId={postId} />
      </main>
    </PageWraper>
  );
}
