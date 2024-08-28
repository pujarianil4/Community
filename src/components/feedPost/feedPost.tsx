"use client";
import React from "react";
import dynamic from "next/dynamic";
import "./index.scss";
import { LiaArrowRightSolid } from "react-icons/lia";
import { PiArrowFatUpLight, PiArrowFatDownLight } from "react-icons/pi";
import { GoComment, GoShareAndroid } from "react-icons/go";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { IPost } from "@/utils/types/types";
import SwipeCarousel from "../common/carousel";

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

  // TODO repleace these with actual data
  const dummyImgs: any[] = [
    "https://picsum.photos/300/300?random=1",
    "https://picsum.photos/200/300?random=2",
    "https://picsum.photos/300/300?random=3",
    "https://picsum.photos/200/300?random=4",
    "https://picsum.photos/300/300?random=5",
    "https://www.w3schools.com/html/mov_bbb.mp4",
  ];

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
      </div>

      <div
        className='content'
        onClick={(event) => {
          handleRedirectPost();
          event.stopPropagation();
        }}
      >
        <MarkdownRenderer markdownContent={text} />
        {dummyImgs.length > 0 && <SwipeCarousel assets={dummyImgs} />}
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
