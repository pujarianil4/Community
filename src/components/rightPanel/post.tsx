"use client";
import { getImageSource, getRandomImageLink } from "@/utils/helpers";
import React from "react";
import "./index.scss";
import { DropdownUpIcon, MessageIcon } from "@/assets/icons";
import { IPost } from "@/utils/types/types";
import Image from "next/image";
import MarkdownRenderer from "../common/MarkDownRender";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IProps {
  post: IPost;
}

export default function Post({ post }: IProps) {
  const router = useRouter();

  const handleRedirectPost = () => {
    router.push(`/post/${post?.id}`);
  };
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
            <span className='community'>- {post?.community.username}</span>
          </div>
        </div>
        <div className='post_content_bx'>
          <div className='post_inn_bx' onClick={handleRedirectPost}>
            {/* TODO: Update for Video too */}
            {post?.media && post?.media.length > 0 && (
              <Image
                src={post?.media[0]}
                alt='post_img'
                width={96}
                height={78}
                loading='lazy'
              />
            )}
          </div>
          <div className='post_content'>
            <div className='redirect_content' onClick={handleRedirectPost}>
              <MarkdownRenderer markdownContent={post?.text} limit={120} />
            </div>
            <div className='post_comment'>
              <span>
                <DropdownUpIcon width={12} height={12} /> {post.up || 0}
              </span>

              <span>
                <MessageIcon width={15} height={15} /> {post.ccount || 0}
                <span>Comments</span>
              </span>
            </div>
          </div>
        </div>
        {/* <div className='post_bx'>
        <img src='https://testcommunity.s3.amazonaws.com/0125f211-bf33-4610-8e73-6fc864787743-metamaskicon.png' />
        <span className='username'> anilpujari</span>
        <span className='community'> anilpujaricommunity</span>
      </div>
      <div className='post_content_bx'>
        <div className='post_inn_bx'>
          <img src='https://testcommunity.s3.amazonaws.com/0125f211-bf33-4610-8e73-6fc864787743-metamaskicon.png' />
        </div>
        <div>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nam magni
            dhjdashdajsda doloribus volup werrrewwerer
          </p>
          <div className='post_comment'>
            <span>
              <DropdownUpIcon width={12} height={12} /> 625
            </span>
            <span>
              <MessageIcon width={15} height={15} /> 65 Comments
            </span>
          </div>
        </div>
      </div> */}
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
