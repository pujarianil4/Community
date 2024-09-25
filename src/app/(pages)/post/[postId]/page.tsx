// "use client";
import type { Metadata, ResolvingMetadata } from "next";
import React from "react";
import PageWraper from "@/components/Wrapers/PageWraper";
import "./index.scss";
import { getPostsByPostId, getPostsForMeta } from "@/services/api/api";

//markdown render
import markdownToTxt from "markdown-to-txt";

import ReactMarkdown from "react-markdown";
import PageContainer from "./pageContainer";
interface Iprops {
  params: any;
}

export default async function PostPage({ params }: Iprops) {
  const { postId } = params;
  const postData = await getPostsByPostId(postId);
  return (
    <PageWraper hideRightPanel>
      <PageContainer postData={postData} />
    </PageWraper>
  );
}

//regex function for markdown text change
function convertMarkdown(markdown: string): string {
  return (
    markdown
      // Remove markdown emphasis like **text**, *text*, _text_
      .replace(/\*\*(.+?)\*\*/g, "$1") // Bold
      .replace(/\*(.+?)\*/g, "$1") // Italic
      .replace(/_(.+?)_/g, "$1") // Underscore

      // Convert headings with proper spacing
      .replace(/^###\s*(.*)$/gim, "\n$1\n") // H3
      .replace(/^##\s*(.*)$/gim, "\n$1\n") // H2 (ignore as you want only H1, H2, H3)
      .replace(/^#\s*(.*)$/gim, "\n$1\n\n") // H1
      .replace(/^(.*)\n=+$/gm, "\n$1\n") // H1 underlined style
      .replace(/^(.*)\n-+$/gm, "\n$1\n") // H2 underlined style

      // Handle unordered lists with proper line breaks
      .replace(/^\*\s+(.*)$/gm, "\n$1") // Convert "* UL1" to "UL1"

      // Handle ordered lists with proper line breaks
      .replace(/^\d+\.\s+(.*)$/gm, "\n$1") // Convert "1. OL1" to "OL1"

      // Convert inline code `code`
      .replace(/`(.+?)`/g, "\nCode\n$1\n") // Convert inline code to "Code"

      // Handle code blocks ```js ... ``` with extra line breaks for clarity
      .replace(/```js\s*([\s\S]*?)```/gim, "\nCode-Block\n```js\n$1\n```\n") // Preserve JS code block

      // Convert blockquotes with proper spacing
      .replace(/^>\s*(.*)$/gm, "\nQuote\n$1\n") // Convert blockquote to "Quote"

      // Convert links [text](url) and [url](url)
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1") // For [text](link)
      .replace(/\[([^\]]+)\]\(([^\)]+)\)/g, "$2") // For [link](link)

      // Remove multiple newlines (more than two) and replace with a single newline
      .replace(/\n{3,}/g, "\n\n")

      // Ensure there's only one space between words
      .replace(/[ \t]+/g, " ")

      // Trim any leading or trailing newlines or spaces
      .trim()
  );
}

export async function generateMetadata(
  { params }: Iprops,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { postId } = params;

  try {
    const post = await getPostsForMeta(postId);

    // Use the regex function to strip markdown
    // const postTitle = convertMarkdown(post?.text || "Welcome to Community");
    // const postDescription = convertMarkdown(
    //   post?.text || "Community for connecting web3 users"
    // );

    // with external package
    const postTitle2 = markdownToTxt(post?.text || "Welcome to Community");
    const postDescription2 = markdownToTxt(
      post?.text || "Community for connecting web3 users"
    );

    const postImage =
      post?.media[0] ||
      "https://testcommunity.s3.ap-south-1.amazonaws.com/ee27b86d-e9a6-4320-b240-33e4ab8d5306-38636.jpg";

    const previousImages = (await parent)?.openGraph?.images || [];

    return {
      title: postTitle2,
      description: postDescription2,
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
// export async function generateMetadata(
//   { params }: Iprops,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const { postId } = params;

//   try {
//     const turndownService = new TurndownService();

//     const post = await getPostsForMeta(postId);
//     const markDownContent = turndownService.turndown(post?.text);
//     const postTitle = markDownContent;

//     const postDescription = markDownContent;
//     console.log("turndorn editor", postDescription);
//     const postImage =
//       post?.media[0] ||
//       "https://testcommunity.s3.ap-south-1.amazonaws.com/ee27b86d-e9a6-4320-b240-33e4ab8d5306-38636.jpg";
//     const previousImages = (await parent)?.openGraph?.images || [];
//     return {
//       title: postTitle,
//       description: postDescription,
//       openGraph: {
//         images: [postImage, ...previousImages],
//       },
//     };
//   } catch (error) {
//     console.error("Failed to fetch post data", error);

//     return {
//       title: "Error fetching post",
//       description: "Could not fetch the post details.",
//     };
//   }
// }
