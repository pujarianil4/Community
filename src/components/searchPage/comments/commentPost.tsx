"use client";
import Actions from "@/components/common/actions";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import UHead from "@/components/common/uhead";
import { useRouter } from "next/navigation";
import React from "react";

export default function CommentPost() {
  const router = useRouter();
  const post = {
    id: 1,
    uid: 1,
    cid: 1,
    text: "hello",
    media: [
      "https://testcommunity.s3.ap-south-1.amazonaws.com/aa33d3e3-0be5-45f9-9050-78a635d6920b-logo.jpg",
    ],
    up: 0,
    down: 0,
    ccount: 0,
    time: "2024-09-03T07:11:57.009Z",
    user: {
      id: 1,
      username: "anil",
      name: "anil",
      img: {
        pro: "https://testcommunity.s3.ap-south-1.amazonaws.com/338246b4-0d3c-4918-ba38-c0ee03e051c7-PHOTO-2024-07-15-09-41-52.jpg",
      },
      pcount: 3,
      tid: null,
      did: null,
      desc: "",
      sts: 1,
      fwrs: 1,
      fwng: 1,
      netWrth: 4906,
      cta: "2024-09-03T07:08:52.294Z",
      uta: "2024-09-03T08:46:48.218Z",
    },
    community: {
      id: 1,
      username: "Unilend",
      name: "Unilend",
      ticker: "UFT",
      logo: "https://testcommunity.s3.amazonaws.com/05b06751-aef7-468b-89b5-02d42e2a1d47-unilend_finance_logo.jpeg",
      metadata: "unilend",
      pCount: 5,
      followers: 3,
      tSupply: 0,
      sts: 1,
      cta: "2024-09-03T07:09:26.687Z",
      uta: "2024-09-03T07:09:26.687Z",
    },
    comments: [],
  };

  const handleRedirectPost = () => {
    router.push(`/post/${post?.id}`);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((event.target as HTMLElement).closest("a")) {
      return;
    }
    handleRedirectPost();
  };
  return (
    <article onClick={handleClick} className='comment_post_card'>
      <UHead user={post?.user} community={post?.community} time={post?.time} />
      <MarkdownRenderer markdownContent={post?.text} limit={2} />
      <div className='comment'>
        <UHead
          user={post?.user}
          community={post?.community}
          time={post?.time}
        />
        <MarkdownRenderer markdownContent={post?.text} limit={2} />
        <Actions post={post} />
      </div>
      <Actions post={post} />
    </article>
  );
}
