// "use client";

import React from "react";
import PageWraper from "@/components/Wrapers/PageWraper";
import "./index.scss";
import Comments from "./comments";
import Post from "./post";

interface Iprops {
  params: any;
}

export default function PostPage({ params }: Iprops) {
  const { postId } = params;

  return (
    <PageWraper hideRightPanel>
      <main className='post_page'>
        <Post postId={postId} />
        <Comments postId={postId} />
      </main>
    </PageWraper>
  );
}
