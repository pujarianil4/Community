import React, { useState } from "react";
import "./index.scss";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { BsEye } from "react-icons/bs";

import { ICommunity, IPost, IUser } from "@/utils/types/types";
import Image from "next/image";
import Link from "next/link";
import { IoIosMore } from "react-icons/io";
import { MdBlock } from "react-icons/md";
import { Popover } from "antd";
import CPopup from "../popup";
import { IoFlagOutline } from "react-icons/io5";

interface IProps {
  showMore?: boolean;
  self?: boolean;
  callBack?: (data: any) => void;
  post: IPost;
}

interface List {
  label: string;
  icon?: any;
}

export default function UHead({
  showMore = false,
  self = false,
  callBack,
  post,
}: IProps) {
  const [open, setOpen] = useState(false);
  const { user, community, cta } = post;
  const popupList: Array<List> = [
    {
      label: "Block",
      icon: <MdBlock />,
    },
    {
      label: "Report",
      icon: <IoFlagOutline />,
    },
    ...(self
      ? [
          {
            label: "Edit",
            icon: <IoIosMore />,
          },
          {
            label: "Delete",
            icon: <IoFlagOutline />,
          },
        ]
      : []),
  ];

  const handleSelectMore = (label: string) => {
    setOpen(false);
    callBack && callBack(String(label).toLowerCase());
  };

  const handleOpen = () => {
    if (post && post.sts != "archived") {
      setOpen(true);
    }
  };

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
      <p className='post_time'>&bull; {timeAgo(cta)}</p>
      {showMore && (
        <div className='more'>
          <CPopup
            onSelect={handleSelectMore}
            open={open}
            list={popupList}
            onAction='hover'
          >
            <div onClick={handleOpen} className='options'>
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
