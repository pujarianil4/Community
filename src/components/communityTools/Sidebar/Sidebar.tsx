"use client";
import React, { useEffect, useRef, useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { MenuProps } from "antd";

import { Menu } from "antd";
import { FiBookmark, FiGlobe } from "react-icons/fi";

import { FcAbout } from "react-icons/fc";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { PiGlobeStand } from "react-icons/pi";
import { MdOutlineTopic, MdContentPaste } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { BsWindowStack } from "react-icons/bs";
import { TbBandageOff } from "react-icons/tb";
import { LuUsers } from "react-icons/lu";
import { LuBarChart3 } from "react-icons/lu";

import "./index.scss";

import { RxHamburgerMenu } from "react-icons/rx";

import { HomeIcon, StatIcon } from "@/assets/icons";
import useAsync from "@/hooks/useAsync";
import { fetchCommunityByCname } from "@/services/api/communityApi";

type MenuItem = Required<MenuProps>["items"][number];

const LodingCommunities = [
  {
    key: "loading1",
    label: (
      <div className='community_item'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
    ),
  },
  {
    key: "loading2",
    label: (
      <div className='community_item'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
    ),
  },
  {
    key: "loading3",
    label: (
      <div className='community_item'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
    ),
  },
  {
    key: "loading4",
    label: (
      <div className='community_item'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
    ),
  },
];

const overviews = [
  {
    key: "insights",
    label: "Insights",
    icon: <LuBarChart3 size={20} />,
  },
  {
    key: "queues",
    label: "Queues",
    icon: <BsWindowStack size={20} />,
  },
  {
    key: "postandcomments",
    label: "Post and Comments",
    icon: <BsWindowStack size={20} />,
  },
  {
    key: "restricted_users",
    label: "Restricted Users",
    icon: <TbBandageOff size={20} />,
  },
  {
    key: "members",
    label: "Members",
    icon: <LuUsers size={20} />,
  },
];

const settings = [
  {
    key: "general_settings",
    label: "General Settings",
    icon: <BsWindowStack size={20} />,
  },
  {
    key: "rules",
    label: "Rules",
    icon: <TbBandageOff size={20} />,
  },
  {
    key: "guide",
    label: "Community Guide",
    icon: <LuUsers size={20} />,
  },
];

const DashBoardSideBar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const pathArray = pathname.split("/");
  const activeKey = pathArray[3];
  console.log("path", pathArray, activeKey);

  const router = useRouter();
  const { community } = useParams<{ community: string }>();
  const { error, isLoading, data, refetch } = useAsync(
    fetchCommunityByCname,
    community
  );
  const items: MenuItem[] = [
    { key: "exit", icon: <IoMdArrowBack size={20} />, label: "Exit Tool" },
    {
      key: "dropdown",
      icon: <FaChevronDown size={12} />,
      label: `c/${community}`,
    },

    {
      type: "divider",
    },
    {
      key: "overviews",
      label: "Overview",
      children: overviews,
    },
    {
      key: "settings",
      label: "Settings",
      children: settings,
    },
  ];

  const extractNextString = (input: string) => {
    const startIndex = input.indexOf("c/");
    if (startIndex !== -1) {
      const endIndex = input.indexOf("/", startIndex + 2);
      if (endIndex !== -1) {
        return input.substring(startIndex, endIndex);
      } else {
        return input.substring(startIndex);
      }
    }
    return input;
  };

  const onClick: MenuProps["onClick"] = (e) => {
    if (e.key == "exit") {
      router.push(`/c/${community}`);
    } else {
      router.push(`/tool/${community}/${e.key}`);
    }
    // if (e.key[0] === "c" && e.key[1] === "/") {
    //   const path = extractNextString(e.key);
    //   router.push(`/${path}`);
    // } else if (e.key === "popular") {
    //   router.push("/popular");
    // } else if (!["popular"].includes(e.key)) {
    //   router.push(`/${e.key}`);
    // }
  };

  return (
    <>
      <RxHamburgerMenu
        className='hamburger'
        size={30}
        onClick={() => setIsOpen(!isOpen)}
      />
      <div className={`sidebar_container ${isOpen && "open"}`}>
        <div className='custom-menu'>
          <Menu
            // defaultSelectedKeys={["insights"]}
            selectedKeys={[activeKey]}
            defaultOpenKeys={["overviews", "settings"]}
            mode='inline'
            theme='dark'
            onClick={onClick}
            items={items}
          />
        </div>
      </div>
    </>
  );
};

export default DashBoardSideBar;
