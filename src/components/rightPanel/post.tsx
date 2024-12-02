"use client";
import { getImageSource, identifyMediaType } from "@/utils/helpers";
import React from "react";
import "./index.scss";
import { DropdownUpIcon, MessageIcon } from "@/assets/icons";
import { IPost } from "@/utils/types/types";
import Image from "next/image";
import MarkdownRenderer from "../common/MarkDownRender";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiArrowFatUpDuotone } from "react-icons/pi";

interface IProps {
  post: IPost;
}

export default function Post({ post }: IProps) {
  const router = useRouter();

  const handleRedirectPost = () => {
    router.push(`/post/${post?.id}`);
  };
  const isMedia =
    post?.media &&
    post?.media.length > 0 &&
    identifyMediaType(post?.media[0]) === "image";
  return (
    <Link href={`post/${post?.id}`} as={`/post/${post?.id}`}>
      <div className='post_heading'>
        <div className='post_bx'>
          <Image
            src={getImageSource(post?.user.img?.pro, "u")}
            alt={post?.user.name || "username"}
            width={25}
            height={25}
            loading='lazy'
          />

          <div className='post_info'>
            <span className='username'>{post?.user.username} </span>
            <span className='community'> {post?.community.username}</span>
          </div>
        </div>
        <div className='post_content_bx'>
          <div className='post_content'>
            <div
              style={{ width: `${isMedia ? "190px" : "276px"}` }}
              className='redirect_content'
              onClick={handleRedirectPost}
            >
              <MarkdownRenderer markdownContent={post?.text} limit={3} />
            </div>
            <div className='post_comment'>
              <span>
                <PiArrowFatUpDuotone size={15} /> {post.up - post.down || 0}
              </span>

              <span>
                <MessageIcon width={15} height={15} /> {post.ccount || 0}
                <span>Comments</span>
              </span>
            </div>
          </div>
          <div className='post_inn_bx' onClick={handleRedirectPost}>
            {/* TODO: Update for Video too */}
            {isMedia && post?.media && (
              <Image
                src={post?.media[0]}
                alt='post_img'
                width={96}
                height={78}
                loading='lazy'
              />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export function PostLoader() {
  return (
    <div className='post_heading'>
      <div className='post_bx skeleton'></div>
      <div className='post_content_bx'>
        <div
          style={{ width: 96, height: 78 }}
          className='post_inn_bx skeleton'
        ></div>
        <div style={{ height: "78px" }} className='post_content skeleton'></div>
      </div>
    </div>
  );
}
