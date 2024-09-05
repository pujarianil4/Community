"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosMore } from "react-icons/io";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { GoComment } from "react-icons/go";
import { IPost } from "@/utils/types/types";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import SwipeCarousel from "@/components/common/carousel";
import { PiArrowFatDownDuotone, PiArrowFatUpDuotone } from "react-icons/pi";
import {
  DropdownLowIcon,
  DropdownUpIcon,
  SaveIcon,
  ShareIcon,
} from "@/assets/icons";
import PostPageLoader from "@/components/common/loaders/postPage";

interface Iprops {
  post: IPost;
}

export default function Post({ post }: Iprops) {
  // TODO use below code to get data after fixing local storage problem
  // const posts = await getPostsByPostId(postId);
  // const { isLoading, data: post } = useAsync(getPostsByPostId, postId);
  // const post = await getPostsByPostId(postId);
  // if (isLoading) {

  const [vote, setVote] = useState({
    value: 1,
    type: "",
  });

  const handleVote = (action: string) => {
    if (action === "up" && vote.type != "up") {
      setVote({ value: vote.value + 1, type: "up" });
    } else if (action === "down" && vote.type != "down") {
      setVote({ value: vote.value - 1, type: "down" });
    }
  };
  if (!post) {
    return <PostPageLoader />;
  }

  return (
    <section className='post_container'>
      <div className='user_head'>
        <Link
          href={`u/${post?.user.username}`}
          as={`/u/${post?.user.username}`}
          className='community_logo'
        >
          <Image
            src={getImageSource(post?.user.img?.pro, "u")}
            alt={post?.user.username || "user"}
            width={32}
            height={32}
          />
        </Link>
        <div className='names'>
          <Link
            href={`u/${post?.user.username}`}
            as={`/u/${post?.user.username}`}
            className='user_name'
          >
            {post?.user.username}
          </Link>
          <Link
            href={`c/${post?.community.username}`}
            as={`/c/${post?.community.username}`}
            className='community_name'
          >
            {post?.community.username}
          </Link>
        </div>
        <p className='post_time'>
          {/* <GoDotFill /> */}
          &bull; {timeAgo(post?.time)}
        </p>
        <div className='more'>
          <IoIosMore />
        </div>
      </div>
      {/* Content */}
      <div className='content post_content'>
        <MarkdownRenderer markdownContent={post?.text} />
        {post?.media && post?.media.length > 0 && (
          <SwipeCarousel assets={post?.media} />
        )}
      </div>
      {/* <div className='actions '>
        <div className='up_down'>
          <PiArrowFatUpDuotone size={18} />
          <span>{post?.up}</span>
          <PiArrowFatDownDuotone size={18} />
        </div>
        <div>
          <GoComment size={18} />
          <span>{post?.ccount > 0 ? post.ccount : "comments"}</span>
        </div>
        <div>
          <ShareIcon width={18} />
          <span>Share</span>
        </div>
        <div>
          <SaveIcon width={16} height={16} />
          <span>Save</span>
        </div>
      </div> */}
      <div className='actions'>
        <div className='up_down'>
          <div className='up_down'>
            <PiArrowFatUpDuotone
              className={vote.type == "up" ? "active" : ""}
              onClick={() => handleVote("up")}
              size={18}
            />
            <span>{vote.value}</span>
            <PiArrowFatDownDuotone
              className={vote.type == "down" ? "active" : ""}
              onClick={() => handleVote("down")}
              size={18}
            />
          </div>
        </div>
        <div className='comments'>
          <GoComment size={18} />
          <span>{post?.ccount > 0 ? post.ccount : "comments"}</span>
        </div>

        <div className='share'>
          <ShareIcon width={18} />
          <span>Share</span>
        </div>
        <div className='save'>
          <SaveIcon width={16} height={16} />
          <span>Save</span>
        </div>
      </div>
    </section>
  );
}
