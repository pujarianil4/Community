import React from "react";
import "./index.scss";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { BsEye } from "react-icons/bs";

import { ICommunity, IUser } from "@/utils/types/types";
import Image from "next/image";
import Link from "next/link";
import { IoIosMore } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import { Popover } from "antd";
import CPopup from "../popup";
import { IoFlagOutline } from "react-icons/io5";

interface IProps {
  user: IUser;
  community: ICommunity;
  time: string;
  showMore?: boolean;
}

interface List {
  label: string;
  icon?: any;
}

export default function UHead({
  user,
  community,
  time,
  showMore = false,
}: IProps) {
  const content = (
    <div className='options_popup'>
      <div className='option'>
        <IoIosMore />
        <span>Block</span>
      </div>
    </div>
  );

  const popupList: Array<List> = [
    {
      label: "Block",
      icon: <MdBlock />,
    },
    {
      label: "Report",
      icon: <IoFlagOutline />,
    },
  ];

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
          <CPopup list={popupList}>
            <div className='options'>
              <IoIosMore />
            </div>
          </CPopup>
          <div className='views'>
            <span>2323</span> <BsEye />
          </div>
        </div>
      )}
    </div>
  );
}
