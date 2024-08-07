import React from "react";
import "./index.scss";
import { LiaArrowRightSolid } from "react-icons/lia";
import { PiArrowFatUpLight, PiArrowFatDownLight } from "react-icons/pi";
import { GoComment, GoShareAndroid } from "react-icons/go";
import Image from "next/image";
import { patchPost } from "@/services/api/api";

interface IProps {
  post: any;
}

// DO we need isUp and isDown?
export default function FeedPost({ post }: IProps) {
  const { text, up, down, comments, time, user, community } = post;

  // const handleUP = async () => {
  //   await patchPost({ up: up + 1 });
  // };

  // const handleDown = async () => {
  //   await patchPost({ up: down + 1 });
  // };
  return (
    <div className='postcard_container'>
      <div className='user_head'>
        <div>
          {/* <Image src={user?.img ?? imgLink} alt='user' width={24} height={24} /> */}
          <Image
            src='https://cdn.vectorstock.com/i/1000x1000/26/37/user-profile-icon-in-flat-style-member-avatar-vector-45692637.webp'
            alt='user'
            width={24}
            height={24}
          />
          <span>{user?.username ?? "User Name"}</span>
          <LiaArrowRightSolid />
          <Image
            // src={community?.logo ?? imgLink}
            src='https://cdn.vectorstock.com/i/1000x1000/26/37/user-profile-icon-in-flat-style-member-avatar-vector-45692637.webp'
            alt='community'
            width={24}
            height={24}
          />
          <span>{community?.username ?? "Community"}</span>
        </div>
        <span>{time}</span>
      </div>
      <div className='content'>
        <p>{text}</p>
      </div>
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
        <div>
          <GoComment size={18} />
          <span>Comments</span>
        </div>
        <div>
          <GoShareAndroid size={18} />
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}
