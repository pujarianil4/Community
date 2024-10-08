"use client";
import React from "react";
import "./index.scss";
import UHead from "@/components/common/uhead";
import { IPost } from "@/utils/types/types";
import Actions from "@/components/common/actions";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import Image from "next/image";
import { identifyMediaType } from "@/utils/helpers";
import { useRouter } from "next/navigation";

interface IProps {
  post: IPost;
}

export default function SearchPostItem({ post }: IProps) {
  const router = useRouter();
  const { id, user, community, cta, text, media } = post;
  const firstMediaIsImage =
    media && media.length > 0 && identifyMediaType(media[0]) === "image";

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
    <article onClick={handleClick} className='search_post_item'>
      <div className='content'>
        <UHead post={post} />
        <MarkdownRenderer markdownContent={text} limit={2} />
        <Actions post={post} type='p' />
      </div>
      {firstMediaIsImage && (
        <Image
          className='post_img'
          src={media[0]}
          alt=''
          width={160}
          height={128}
        />
      )}
    </article>
  );
}
