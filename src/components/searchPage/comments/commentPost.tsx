"use client";
import Actions from "@/components/common/actions";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import UHead from "@/components/common/uhead";
import { IComment, ICommunity, IUser } from "@/utils/types/types";
import { useRouter } from "next/navigation";
import React from "react";

interface IProps {
  commentData: IComment;
}
export default function CommentPost({ commentData }: IProps) {
  const router = useRouter();

  const { id, img, content, up, down, rCount, cta, user, post } = commentData;
  const commentAction = {
    up,
    down,
    id,
    isVoted: false, // TODO: update after isVoted api update completes.
    ccount: 1,
    text: content,
    media: [img as string],
    uid: id,
    cid: id,
    cta,
    user,
    community: post?.community as ICommunity,
    sts: post?.sts,
  };

  const handleRedirectPost = () => {
    router.push(`/post/${id}`);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if ((event.target as HTMLElement).closest("a")) {
      return;
    }
    handleRedirectPost();
  };
  return (
    <article onClick={handleClick} className='comment_post_card'>
      {/* TODO: Change Community data here */}
      {/* <UHead user={post?.user} community={post?.community} time={post?.cta} /> */}
      <UHead post={post} />
      <MarkdownRenderer markdownContent={post?.text} limit={2} />
      <div className='comment'>
        <UHead post={commentAction} />
        <MarkdownRenderer markdownContent={content} limit={2} />
        {/* TODO: update actions with the comments */}
        <Actions post={commentAction} type='c' />
      </div>
      <Actions post={post} type='c' />
    </article>
  );
}
