"use client";
import React, { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Menu, MenuProps, Popover } from "antd";
import Image from "next/image";
import { IoMdArrowBack } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { BsWindowStack } from "react-icons/bs";
import { TbBandageOff } from "react-icons/tb";
import { LuUsers, LuBarChart3 } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";

import "./index.scss";
import useAsync from "@/hooks/useAsync";
import { fetchCommunityByCname } from "@/services/api/communityApi";
import { getFollowinsByUserId } from "@/services/api/userApi";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { ICommunity } from "@/utils/types/types";

type MenuItem = Required<MenuProps>["items"][number];

const loadingCommunities: MenuItem[] = [
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
    key: "general",
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
  const activeKey = pathname.split("/")[3] || "insights";
  console.log("path", activeKey);

  const userSelector = (state: RootState) => state?.user?.profile;
  const [{ dispatch, actions }, [user]] = useRedux([userSelector]);
  const router = useRouter();
  const { community } = useParams<{ community: string }>();

  const { isLoading, data: communityList } = useAsync(getFollowinsByUserId, {
    userId: user?.id,
    type: "c",
  });

  const followCList = communityList?.map((item: any) => item.followedCommunity);
  console.log("followlist", followCList);

  const handleCommunitySelect = (username: string) => {
    const pathSegments = pathname.split("/");
    const toolIndex = pathSegments.indexOf("tool");

    if (toolIndex !== -1) {
      pathSegments[toolIndex + 1] = username;

      const updatedPath = pathSegments.join("/");
      console.log("Navigating to:", updatedPath);
      router.push(updatedPath);
    } else {
      console.error("Tool segment not found in the path");
    }
  };

  const popoverContent = isLoading
    ? loadingCommunities.map((item: any) => (
        <div key={item?.key}>{item.label}</div>
      ))
    : followCList?.map((item: ICommunity) => (
        <div
          key={item.username}
          className='community_item'
          onClick={() => {
            handleCommunitySelect(item.username);
          }}
        >
          <div className='img'>
            <Image
              src={item?.img.pro}
              width={20}
              alt='communitylogo'
              height={20}
            />
          </div>

          <div className='content'>{item.username}</div>
        </div>
      ));

  const items: MenuItem[] = [
    {
      key: "exit",
      icon: <IoMdArrowBack size={20} />,
      label: "Exit Tool",
    },
    {
      key: "community",
      label: (
        <Popover
          content={<div className='popover_content'>{popoverContent}</div>}
          trigger='click'
        >
          <span>c/{community}</span>
        </Popover>
      ),

      icon: <FaChevronDown size={12} />,
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
    const startIndex = input.indexOf("tool/");
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
    } else if (e.key === "community") {
      console.log("this works");
      return;
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
      <div className={`sidebar_container ${isOpen ? "open" : ""}`}>
        <Menu
          selectedKeys={[activeKey]}
          defaultOpenKeys={["overviews", "settings"]}
          mode='inline'
          theme='dark'
          onClick={onClick}
          items={items}
        />
      </div>
    </>
  );
};

export default DashBoardSideBar;
