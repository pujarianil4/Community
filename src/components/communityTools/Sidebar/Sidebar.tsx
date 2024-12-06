"use client";
import React, { useState } from "react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { Menu, MenuProps } from "antd";
import { FiBookmark, FiGlobe } from "react-icons/fi";

import { FcAbout } from "react-icons/fc";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { PiGlobeStand } from "react-icons/pi";
import { MdOutlineTopic, MdContentPaste } from "react-icons/md";
import { IoMdArrowBack } from "react-icons/io";
import { FaChevronDown } from "react-icons/fa6";
import { BsWindowStack } from "react-icons/bs";
import { TbBandageOff } from "react-icons/tb";
import { LuUsers, LuBarChart3 } from "react-icons/lu";
import { RxHamburgerMenu } from "react-icons/rx";

import "./index.scss";
import useAsync from "@/hooks/useAsync";
import { fetchCommunityByCname } from "@/services/api/communityApi";
import { FaBullseye } from "react-icons/fa";
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

  const handleCommunitySelect = (username: string) => {
    const pathname = usePathname();
    const router = useRouter();
    const pathSegments = pathname.split("/");
    const toolIndex = pathSegments.indexOf("tool");

    if (toolIndex !== -1 && pathSegments[toolIndex + 1]) {
      pathSegments[toolIndex + 1] = username;

      const updatedPath = pathSegments.join("/");
      console.log("new url", updatedPath);
      router.push(updatedPath);
    }
  };

  const items: MenuItem[] = [
    {
      key: "exit",
      icon: <IoMdArrowBack size={20} />,
      label: "Exit Tool",
    },
    {
      key: "dropdown",
      label: `c/${community}`,

      children: isLoading
        ? loadingCommunities
        : followCList?.map((item: ICommunity) => ({
            key: item.username,
            label: (
              <div
                className='community_item'
                onClick={() => handleCommunitySelect(item.username)}
              >
                <div className='content'>{item.username}</div>
              </div>
            ),
          })),
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
    } else if (e.key === "dropdwon") {
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
