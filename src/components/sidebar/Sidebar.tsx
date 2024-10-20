"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { MenuProps, Modal } from "antd";
import { AiOutlinePlus } from "react-icons/ai";

import { HiOutlineUserGroup } from "react-icons/hi2";
import { Button, Menu } from "antd";
import { FiUpload, FiBookmark, FiGlobe } from "react-icons/fi";
import { BiCategory } from "react-icons/bi";
import { FcAbout } from "react-icons/fc";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { PiGlobeStand } from "react-icons/pi";
import { MdOutlineTopic, MdContentPaste } from "react-icons/md";
import TiptapEditor from "../common/tiptapEditor";
import "./index.scss";
import CButton from "../common/Button";

import { fetchCommunities } from "@/services/api/communityApi";
import { RxHamburgerMenu } from "react-icons/rx";
import useAsync from "@/hooks/useAsync";
import NotificationMessage from "../common/Notification";
import { GoStack } from "react-icons/go";
import {
  debounce,
  getClientSideCookie,
  getImageSource,
  getRandomImageLink,
} from "@/utils/helpers";
import CommunityList from "../common/loaders/communityList";

import FocusableDiv from "../common/focusableDiv";
import {
  AddIcon,
  HomeIcon,
  NotificationIcon,
  SettingIcon,
  StatIcon,
  UploadIcon,
} from "@/assets/icons";
import useRedux from "@/hooks/useRedux";
import { RootState } from "@/contexts/store";
import TurndownService from "turndown";
import { ICommunity } from "@/utils/types/types";
import Image from "next/image";
import CHead from "../common/chead";
import Avatar from "@/components/common/loaders/userAvatar";
import ProfileAvatar from "@/components/common/loaders/profileAvatar";
import { CreateCommunityModal } from "./CreateCommunityModal";
import { getFollowinsByUserId } from "@/services/api/userApi";

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

const categories = [
  {
    key: "about",
    label: "About",
    icon: <FcAbout size={20} />,
  },
  {
    key: "help",
    label: "Help",
    icon: <IoIosHelpCircleOutline size={20} />,
  },
  {
    key: "best_of_numa",
    label: "Best of Numa",
    icon: <PiGlobeStand size={20} />,
  },
  {
    key: "topics",
    label: "Topics",
    icon: <MdOutlineTopic size={20} />,
  },
  {
    key: "content_policy",
    label: "Content Policy",
    icon: <MdContentPaste size={20} />,
  },
];

const SideBar: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [communityList, SetCommunityList] = useState<Array<any>>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [recentCommunities, setRecentCommunities] = useState([]);

  const refetchCommunitySelector = (state: RootState) =>
    state.common.refetch.community;
  const userSelector = (state: RootState) => state.user.profile;
  const [{ dispatch, actions }, [comminityRefetch, user]] = useRedux([
    refetchCommunitySelector,
    userSelector,
  ]);
  const { isLoading, callFunction, data, refetch } = useAsync();

  const router = useRouter();

  const items: MenuItem[] = [
    { key: "", icon: <HomeIcon />, label: "Home" },
    { key: "popular", icon: <StatIcon />, label: "Popular" },
    {
      key: "communities",
      icon: <FiGlobe size={20} />,
      label: "Explore Communities",
    },
    {
      key: "save",
      icon: <FiBookmark size={20} />,
      label: "Saved",
    },

    {
      type: "divider",
    },
    recentCommunities.length > 0
      ? { key: "recentCommunity", label: "Recent", children: recentCommunities }
      : null,
    {
      key: "community",
      label: "My Community",

      children: [
        {
          key: "createCommunity",
          label: (
            <div className='community_item'>
              <CButton icon={<AddIcon />} className='createText'>
                Create Community
              </CButton>
            </div>
          ),
        },
      ].concat(isLoading ? LodingCommunities : communityList),
    },

    {
      key: "categories",
      label: "Categories",
      children: categories,
    },
  ];

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

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
    if (e.key == "createCommunity") {
      const user = getClientSideCookie("authToken");
      if (user) {
        showModal();
      } else {
      }
    } else if (e.key[0] === "c" && e.key[1] === "/") {
      const path = extractNextString(e.key);
      router.push(`/${path}`);
    } else if (!["popular"].includes(e.key)) {
      router.push(`/${e.key}`);
    }
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getRandomImageLink();
  };

  const getCommunities = async (cmnties: Array<any>) => {
    const inFormat = cmnties.map((cm: any) => {
      return {
        key: "c/" + cm.followedCommunity.username,
        label: (
          <>
            {/* <div className='community_item'>
              <img
                loading='lazy'
                src={getImageSource(cm?.img?.pro, "c")}
                alt='profile'
                onError={handleError}
              />
              <span>{cm?.name}</span>
            </div> */}
            <CHead community={cm.followedCommunity} />
          </>
        ),
      };
    });

    SetCommunityList(inFormat);
  };

  const fetchUserCommunities = async () => {
    if (user.id) {
      const data: any = await callFunction(getFollowinsByUserId, {
        userId: user.id,
        type: "c",
      });
      getCommunities(data);
      return data;
    }
  };

  const handleCallback = () => {
    fetchUserCommunities();
    console.log("refectch");

    dispatch(actions.setRefetchCommunity(true));
  };

  const getRecentCommunities = () => {
    const value = localStorage?.getItem("recentCommunity");
    let prevCommunities = [];
    prevCommunities = value ? JSON.parse(value) : [];
    if (prevCommunities?.length > 0) {
      const updateData = prevCommunities?.map(
        (item: ICommunity, index: number) => ({
          key: `c/${item.username}/${index}`,
          label: <CHead community={item} />,
        })
      );
      setRecentCommunities(updateData.reverse());
    } else {
      setRecentCommunities([]);
    }
  };

  useEffect(() => {
    getRecentCommunities();
  }, []);

  useEffect(() => {
    if (comminityRefetch) {
      fetchUserCommunities();
      dispatch(actions.setRefetchCommunity(false));
    }
  }, [comminityRefetch]);

  useEffect(() => {
    fetchUserCommunities();
  }, [user]);
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
            defaultSelectedKeys={["1"]}
            defaultOpenKeys={["community", "categories", "recentCommunity"]}
            mode='inline'
            theme='dark'
            onClick={onClick}
            items={items}
          />
        </div>
      </div>

      <CreateCommunityModal
        isModalOpen={isModalOpen}
        onClose={handleCancel}
        refetchCommunities={handleCallback}
      />
    </>
  );
};

export default SideBar;
