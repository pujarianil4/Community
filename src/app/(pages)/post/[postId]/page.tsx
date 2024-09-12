// "use client";
import type { Metadata, ResolvingMetadata } from "next";
import React from "react";
import PageWraper from "@/components/Wrapers/PageWraper";
import "./index.scss";
import Comments from "./comments";
import Post from "./post";
import { getPostsByPostId, getPostsForMeta } from "@/services/api/api";

interface Iprops {
  params: any;
}

export default async function PostPage({ params }: Iprops) {
  const { postId } = params;
  const postData = await getPostsByPostId(postId);
  return (
    <PageWraper hideRightPanel>
      <main className='post_page'>
        <Post post={postData} />
        <Comments postId={postId} />
      </main>
    </PageWraper>
  );
}

export async function generateMetadata(
  { params }: Iprops,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { postId } = params;
  try {
    const post = await getPostsForMeta(postId);
    const postTitle = post?.text || "Welcome to Community";
    const postDescription = post?.text || "Community for connect web3 users";
    const postImage =
      post?.media[0] ||
      "https://testcommunity.s3.ap-south-1.amazonaws.com/ee27b86d-e9a6-4320-b240-33e4ab8d5306-38636.jpg";
    const previousImages = (await parent)?.openGraph?.images || [];
    return {
      title: postTitle,
      description: postDescription,
      openGraph: {
        images: [postImage, ...previousImages],
      },
    };
  } catch (error) {
    console.error("Failed to fetch post data", error);

    return {
      title: "Error fetching post",
      description: "Could not fetch the post details.",
    };
  }
}
