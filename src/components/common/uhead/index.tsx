import React from "react";
import "./index.scss";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { ICommunity, IUser } from "@/utils/types/types";
import Image from "next/image";
import Link from "next/link";
import { IoIosMore } from "react-icons/io";

interface IProps {
  user: IUser;
  community: ICommunity;
  time: string;
  showMore?: boolean;
}

export default function UHead({
  user,
  community,
  time,
  showMore = false,
}: IProps) {
  return (
    <div className='user_head'>
      <Link
        href={`u/${user?.username}`}
        as={`/u/${user?.username}`}
        className='user_avatar'
      >
        <Image
          src={getImageSource(user?.img?.pro, "u")}
          alt={user?.username || "user"}
          width={52}
          height={52}
        />
      </Link>
      <div className='names'>
        <Link
          href={`u/${user?.username}`}
          as={`/u/${user?.username}`}
          className='user_name'
        >
          {user?.username}
        </Link>
        <Link
          href={`c/${community?.username}`}
          as={`/c/${community?.username}`}
          className='community_name'
        >
          {community?.username}
        </Link>
      </div>
      <p className='post_time'>&bull; {timeAgo(time)}</p>
      {showMore && (
        <div className='more'>
          <IoIosMore />
        </div>
      )}
    </div>
  );
}
