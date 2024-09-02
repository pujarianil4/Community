// "use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosMore } from "react-icons/io";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { GoComment } from "react-icons/go";
import { IPost } from "@/utils/types/types";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import SwipeCarousel from "@/components/common/carousel";
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

export default async function Post({ post }: Iprops) {
  // TODO use below code to get data after fixing local storage problem
  // const posts = await getPostsByPostId(postId);
  // const { isLoading, data: post } = useAsync(getPostsByPostId, postId);
  // const post = await getPostsByPostId(postId);
  console.log("POST", post);
  // if (isLoading) {
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
            src={getImageSource(post?.user.img, "u")}
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
        {post?.images && post?.images.length > 0 && (
          <SwipeCarousel assets={post?.images} />
        )}
      </div>
      <div className='actions '>
        <div className='up_down'>
          <DropdownUpIcon width={18} />
          <span>{post?.up}</span>
          <DropdownLowIcon width={18} />
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
      </div>
    </section>
  );
}
