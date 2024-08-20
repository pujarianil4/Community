import React from "react";
import "./index.scss";
import { LiaArrowRightSolid } from "react-icons/lia";
import { PiArrowFatUpLight, PiArrowFatDownLight } from "react-icons/pi";
import { GoComment, GoShareAndroid } from "react-icons/go";
import Image from "next/image";
import { patchPost } from "@/services/api/api";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import {
  getImageSource,
  getRandomImageLink,
  getRandomPost,
  identifyMediaType,
  timeAgo,
} from "@/utils/helpers";
import CVideo from "../common/Video";

interface IProps {
  post: any;
}

const imgLink = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
export default function FeedPost({ post }: IProps) {
  const { text, up, down, comments, time, user, community, id } = post;

  const handleUP = async () => {
    await patchPost({ up: up + 1 });
  };

  const handleDown = async () => {
    await patchPost({ up: down + 1 });
  };
  const mediaURL = getRandomPost();

  console.log("media", mediaURL);

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

      <Link href={`post/${id}`} as={`/post/${id}`}>
        <div className='content'>
          {/* <p>{text}</p> */}
          <ReactMarkdown>{text}</ReactMarkdown>
          <div className='postMedia'>
            <img
              loading='lazy'
              className='imgbg'
              src={getRandomImageLink()}
              alt='postbg'
            />
            {identifyMediaType(mediaURL) == "image" && (
              <img className='media' src={mediaURL} alt='post' />
            )}
            {identifyMediaType(mediaURL) == "video" && (
              <CVideo src={mediaURL} />
            )}
          </div>
        </div>
      </Link>
      <div className='actions'>
        <div>
          {/* <button onClick={() => handleUP()}> */}
          <PiArrowFatUpLight size={18} />
          {/* </button> */}
          <span>{up}</span>
          {/* <button onClick={() => handleDown()}> */}
          <PiArrowFatDownLight size={18} />
          {/* </button> */}
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
