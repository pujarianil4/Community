"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { IoIosMore } from "react-icons/io";
import { timeAgo } from "@/utils/helpers";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";
import { GoComment, GoShareAndroid } from "react-icons/go";
import { getPostsByPostId } from "@/services/api/api";
import useAsync from "@/hooks/useAsync";

interface Iprops {
  postId: string;
}

export default function Post({ postId }: Iprops) {
  // TODO use below code to get data after fixing local storage problem
  // const posts = await getPostsByPostId(postId);
  const { isLoading, data: posts } = useAsync(getPostsByPostId, postId);

  const user = {
    id: 5,
    username: "test_me",
    name: "test",
    img: "https://i.imgur.com/Qpw6j8D_d.webp?maxwidth=760&fidelity=grand",
    sts: 1,
    cta: "2024-08-02T10:09:15.193Z",
    uta: "2024-08-02T10:09:15.193Z",
  };
  const community = {
    id: 1,
    username: "example community",
    name: "unilend Finance Community",
    ticker: "string",
    logo: "https://i.imgur.com/Qpw6j8D_d.webp?maxwidth=760&fidelity=grand",
    metadata: "string",
    pCount: 0,
    followers: 0,
    totalSupply: 0,
    sts: 0,
    cta: "2024-08-02T10:09:15.193Z",
    uta: "2024-08-05T06:38:15.128Z",
  };
  // TODO: update this after API update
  const post = { ...posts, user, community };

  return (
    <section className='post_container'>
      <div className='user_head'>
        <Link
          href={`c/${post?.community.username}`}
          as={`/c/${post?.community.username}`}
          className='community_logo'
        >
          <Image
            src={post?.community.logo}
            alt={post?.community.username}
            width={32}
            height={32}
          />
        </Link>
        <div className='names'>
          <Link
            href={`c/${post?.community.username}`}
            as={`/c/${post?.community.username}`}
            className='community_name'
          >
            {post?.community.username}
          </Link>
          <Link
            href={`c/${post?.user.username}`}
            as={`/c/${post?.user.username}`}
            className='user_name'
          >
            {post?.user.username}
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
        {/* <div className='post-image'>
      <Image
        src='https://i.imgur.com/Qpw6j8D_d.webp?maxwidth=760&fidelity=grand'
        loading='lazy'
        alt='blog'
        fill
      />
    </div> */}
        <p>{post?.text}</p>
      </div>
      <div className='actions'>
        <div>
          <PiArrowFatUpLight size={18} />
          <span>{post?.up}</span>
          <PiArrowFatDownLight size={18} />
        </div>
        <div>
          <GoComment size={18} />
          <span>{post?.comments > 0 ? post.comments : "comments"}</span>
        </div>
        <div>
          <GoShareAndroid size={18} />
          <span>Share</span>
        </div>
      </div>
    </section>
  );
}
