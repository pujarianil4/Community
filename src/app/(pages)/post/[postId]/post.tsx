// "use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosMore } from "react-icons/io";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";
import { GoComment, GoShareAndroid } from "react-icons/go";
// import { getPostsByPostId } from "@/services/api/api";
// import useAsync from "@/hooks/useAsync";
// import ReactMarkdown from "react-markdown";
// import PostPageLoader from "@/components/common/loaders/postPage";
import { IPost } from "@/utils/types/types";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import SwipeCarousel from "@/components/common/carousel";

interface Iprops {
  post: IPost;
}

export default function Post({ post }: Iprops) {
  // TODO use below code to get data after fixing local storage problem
  // const posts = await getPostsByPostId(postId);
  // const { isLoading, data: post } = useAsync(getPostsByPostId, postId);

  // if (isLoading) {
  //   return <PostPageLoader />;
  // }

  return (
    <section className='post_container'>
      <div className='user_head'>
        <Link
          href={`c/${post?.community.username}`}
          as={`/c/${post?.community.username}`}
          className='community_logo'
        >
          <Image
            src={getImageSource(post?.community.logo)}
            alt={post?.community.username || "community"}
            width={32}
            height={32}
          />
        </Link>
        <div className='names'>
          <Link
            href={`c/${post?.user.username}`}
            as={`/c/${post?.user.username}`}
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
      <div className='content'>
        <MarkdownRenderer markdownContent={post?.text} />
        {post?.images && <SwipeCarousel assets={post?.images} />}
      </div>
      <div className='actions'>
        <div>
          <PiArrowFatUpLight size={18} />
          <span>{post?.up}</span>
          <PiArrowFatDownLight size={18} />
        </div>
        <div>
          <GoComment size={18} />
          <span>{post?.ccount > 0 ? post.ccount : "comments"}</span>
        </div>
        <div>
          <GoShareAndroid size={18} />
          <span>Share</span>
        </div>
      </div>
    </section>
  );
}
