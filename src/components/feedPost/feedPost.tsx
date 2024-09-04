"use client";
import React from "react";
import dynamic from "next/dynamic";
import "./index.scss";
import { GoComment } from "react-icons/go";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getImageSource, numberWithCommas, timeAgo } from "@/utils/helpers";
import { IPost } from "@/utils/types/types";
import SwipeCarousel from "../common/carousel";
import { IoIosMore } from "react-icons/io";
import {
  DropdownLowIcon,
  DropdownUpIcon,
  SaveIcon,
  ShareIcon,
} from "@/assets/icons";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";

const MarkdownRenderer = dynamic(() => import("../common/MarkDownRender"), {
  ssr: false,
});

interface IProps {
  post: IPost;
}

const imgLink = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
export default function FeedPost({ post }: IProps) {
  const { text, up, down, time, media, user, community, id, ccount } = post;
  const router = useRouter();

  const handleRedirectPost = () => {
    router.push(`/post/${id}`);
  };

  return (
    <div className='postcard_container'>
      {/* <div className='user_head'>
        <div>
          <Image src={user?.img ?? imgLink} alt='user' width={24} height={24} />
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
                src={community?.logo || imgLink}
                alt='community'
                width={24}
                height={24}
              />
              <span>{community?.username ?? "Community"}</span>
            </div>
          </Link>
        </div>
        <span>{timeAgo(time)}</span>
      </div> */}
      <div className='user_head'>
        <Link
          href={`u/${post?.user.username}`}
          as={`/u/${post?.user.username}`}
          className='user_avatar'
        >
          <Image
            src={getImageSource(post?.user.img?.pro, "u")}
            alt={post?.user.username || "user"}
            width={52}
            height={52}
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
        <p className='post_time'>&bull; {timeAgo(post?.time)}</p>
        <div className='more'>
          <IoIosMore />
        </div>
      </div>

      <div
        className='content'
        onClick={(event) => {
          handleRedirectPost();
          event.stopPropagation();
        }}
      >
        <MarkdownRenderer markdownContent={text} />
        {media && media?.length > 0 && <SwipeCarousel assets={media} />}
      </div>

      <div className='actions'>
        <div className='up_down'>
          <PiArrowFatUpLight size={18} />

          <span>{up}</span>
          <PiArrowFatDownLight size={18} />
        </div>
        <Link href={`post/${id}`} as={`/post/${id}`}>
          <GoComment size={18} />
          <span>{numberWithCommas(ccount) || "comments"}</span>
        </Link>
        <div>
          <ShareIcon width={18} />
          <span>Share</span>
        </div>
        <div>
          <SaveIcon width={16} height={16} />
          <span>Save</span>
        </div>
      </div>
    </div>
  );
}
