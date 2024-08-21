"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import "./index.scss";
import { LiaArrowRightSolid } from "react-icons/lia";
import { PiArrowFatUpLight, PiArrowFatDownLight } from "react-icons/pi";
import { GoComment, GoShareAndroid } from "react-icons/go";
import Image from "next/image";
import { patchPost } from "@/services/api/api";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { IPost } from "@/utils/types/types";
import Media from "./media";
// import MarkdownRenderer from "../common/MarkDownRender";

const MarkdownRenderer = dynamic(() => import("../common/MarkDownRender"), {
  ssr: false,
});

interface IProps {
  post: IPost;
}

const imgLink = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
export default function FeedPost({ post }: IProps) {
  const { text, up, down, time, img, user, community, id } = post;
  const router = useRouter();

  let postAssets: string[] = [];
  if (typeof img === "string") {
    postAssets = [img];
  } else if (Array.isArray(img)) {
    postAssets = img.filter((item) => typeof item === "string");
  }

  const handleRedirectPost = () => {
    router.push(`post/${id}`);
  };

  return (
    <div className='postcard_container'>
      <div className='user_head'>
        <div>
          {/* <Image src={user?.img ?? imgLink} alt='user' width={24} height={24} /> */}
          <Link href={`u/${user.username}`} as={`/u/${user.username}`}>
            <div className='head'>
              <Image
                src={getImageSource(user.img, true)}
                alt='user'
                width={24}
                height={24}
              />
              <span>{user?.username ?? "User Name"}</span>
            </div>
          </Link>
          <LiaArrowRightSolid />
          <Link
            href={`c/${community?.username}`}
            as={`/c/${community.username}`}
          >
            <div className='head'>
              <Image
                // src={community?.logo ?? imgLink}
                src={community.logo || imgLink}
                alt='community'
                width={24}
                height={24}
              />
              <span>{community?.username ?? "Community"}</span>
            </div>
          </Link>
        </div>
        <span>{timeAgo(time)}</span>
      </div>

      <div className='content' onClick={() => handleRedirectPost()}>
        <MarkdownRenderer markdownContent={text} />
        <Media assets={postAssets} />
      </div>

      <div className='actions'>
        <div>
          <PiArrowFatUpLight size={18} />
          <span>{up}</span>
          <PiArrowFatDownLight size={18} />
        </div>
        <Link href={`post/${id}`} as={`/post/${id}`}>
          <GoComment size={18} />
          <span>Comments</span>
        </Link>
        <div>
          <GoShareAndroid size={18} />
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}
