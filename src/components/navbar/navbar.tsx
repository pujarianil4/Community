"use client";
// @ts-nocheck
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState, ChangeEvent, memo } from "react";
import { Popover, Badge, Modal } from "antd";
import { useDisconnect } from "wagmi";
import { PiUserCircleDuotone } from "react-icons/pi";

import { IoLogOutOutline } from "react-icons/io5";
import "./navbar.scss";
import CButton from "../common/Button";
import { FaRegBell } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";
import Link from "next/link";
import { AddIcon } from "@/assets/icons";

import useRedux from "@/hooks/useRedux";

import VirtualList from "../common/virtualList";
import { fetchUserById } from "@services/api/userApi";

import CreatePost from "../createPost/CreatePost";
import { RootState } from "@/contexts/store";
import {
  debounce,
  deleteClientSideCookie,
  getClientSideCookie,
  setClientSideCookie,
} from "@/utils/helpers";

import { sigMsg } from "@/utils/constants";
import { IoSettingsOutline } from "react-icons/io5";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { SignUpModal } from "../common/auth/signUpModal";
import Searchbar from "./searchbar";
import { IoMdArrowBack } from "react-icons/io";
import { handleLogOut } from "@/services/api/authapi";
import { IUser } from "@/utils/types/types";
import { clearTokens } from "@/services/api/api";
import EmptyData from "../common/Empty";
import FeedPostLoader from "../common/loaders/Feedpost";
import Notification from "../common/notifications";
import Notify from "../common/notifications/notify";
export interface ISignupData {
  username: string;
  name: string;
}

export interface INotification {
  message: string;
}
const msg = sigMsg;

const commonSelector = (state: RootState) => state?.common;
const userNameSelector = (state: RootState) => state?.user;

const tgBotName = process.env.TG_BOT_NAME;
function Navbar() {
  const secretCode = process.env.NEXT_PUBLIC_DISCORD_ID;
  const userAccount = useAccount();

  const [{ dispatch, actions }, [{ profile, isLoading, error }, common]] =
    useRedux([userNameSelector, commonSelector]);
  const userProfile: IUser = profile;
  const userData: any = getClientSideCookie("authToken");
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [messageHash, setMessageHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [signupData, setSignupData] = useState<ISignupData>({
    username: "",
    name: "",
  });
  const router = useRouter();
  const [userSession, setUserSession] = useState<any>(userData);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const hasCalledRef = useRef(false);
  const [modalTab, setModalTab] = useState(3);
  const [discordUser, setDiscordUser] = useState(null);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const [page, setPage] = useState(1);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const limit = 10;
  const showCreatePost = () => {
    setIsPostModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setModalTab(1);
    setIsModalOpen(false);
  };
  const toggleNotifications = () => {
    setNotificationVisible(!notificationVisible);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  // useEffect(() => {
  //   console.log("userSession", userSession);
  // }, [userSession]);

  const userLogout = async () => {
    try {
      const logout = await handleLogOut();
      clearTokens();
      dispatch(actions.setUserData({} as IUser));
      // Add a short delay before reloading the page
      setTimeout(() => {
        window?.location?.reload();
      }, 1000);
    } catch (error) {
      setUserSession(null);
      clearTokens();
      dispatch(actions.setUserData({} as IUser));
      // Add a short delay before reloading the page
      setTimeout(() => {
        window?.location?.reload();
      }, 1000);
    }
  };

  useEffect(() => {
    // fetchFromCookies();
    if (common?.refetch?.user) {
      // fetchUser();
      dispatch(actions.setRefetchUser(false));
    }
  }, [common?.refetch?.user]);

  useEffect(() => {
    // fetchFromCookies();
    console.log("profileUpdate", profile, userProfile);
  }, [profile]);

  const notificationsData = [
    { id: 1, message: "Your post received a new comment!" },
    { id: 2, message: "Your profile was updated successfully." },
    { id: 3, message: "New follower added to your profile!" },
    { id: 4, message: "New follower added to your profile 4!" },
    { id: 5, message: "New follower added to your profile 5!" },
    { id: 6, message: "New follower added to your profile 6!" },
  ];

  // useEffect(() => {
  //   if (notificationsData && notificationsData?.length > 0) {
  //     if (page === 1) {
  //       setNotifications(notificationsData);
  //     } else {
  //       setNotifications((prevNotifications) => [
  //         ...prevNotifications,
  //         ...notificationsData,
  //       ]);
  //     }
  //   }
  // }, [notificationsData]);

  // useEffect(() => {
  //   if (notificationsData && notificationsData?.length > 0) {
  //     if (page === 1) {
  //       setNotifications(notificationsData); // Set notifications only if page is 1
  //     } else {
  //       setNotifications((prevNotifications) => [
  //         ...prevNotifications,
  //         ...notificationsData,
  //       ]);
  //     }
  //   }
  // }, [notificationsData, page]); // Add page as dependency to prevent infinite loop

  // useEffect(() => {
  //   if (page !== 1) refetch();
  // }, [page]);

  const content = (
    <div className='user_popover'>
      <Link
        href={`/u/${userProfile?.username}`}
        as={`/u/${userProfile?.username}`}
      >
        <div className='row'>
          <PiUserCircleDuotone size={28} />
          <span className='text'>
            <span className='text_main'>Profile</span>
            <span className='text_sub'>@{userProfile?.username}</span>
          </span>
        </div>
      </Link>

      <Link href={"/settings"} as={"/settings"}>
        <div className='row'>
          <IoSettingsOutline size={25} />
          <span className='text'>
            <span className='text_main'>Settings</span>
          </span>
        </div>
      </Link>
      <div onClick={userLogout} className='row'>
        <IoLogOutOutline size={25} />
        <span className='text'>
          <span className='text_main'>Log Out</span>
        </span>
      </div>
    </div>
  );

  const NotificationContent = (
    <div className='notification_list'>
      {/* <div className='notification-header'>
        <h3>Notifications</h3>
      </div> */}
      {notificationsData.length === 0 ? (
        <EmptyData />
      ) : (
        <>
          <Notification notifications={notificationsData} />
          {/* <VirtualList
            listData={notificationsData}
            isLoading={isLoading}
            page={1}
            setPage={1}
            limit={4}
            renderComponent={(index: number, post: any) => (
              <Notify key={index} notifications={post} />
            )}
            footerHeight={10}
          /> */}

          <div className='see_all_bx'>
            <Link href='/notifications'>
              <div className='see_text'> See All !</div>
            </Link>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {showSearchBar ? (
        <div className='mobile_search_container'>
          <div className='mobile_search'>
            <IoMdArrowBack onClick={() => setShowSearchBar(false)} />
            <Searchbar />
          </div>
        </div>
      ) : (
        <nav className='nav_container'>
          <div className='first_child'>
            <div className='logo'>
              <Link href='/'>
                <h2>Numity</h2>
              </Link>
            </div>
            <div className='hidesearchbar'>
              <Searchbar />
            </div>
          </div>

          <div className='signin'>
            {userProfile?.username && !isLoading ? (
              <div className='user_actions'>
                {!showSearchBar && (
                  <IoSearch
                    className='mobile_search_icon'
                    onClick={() => setShowSearchBar(true)}
                  />
                )}
                <CButton className='create_post' onClick={showCreatePost}>
                  <AddIcon />
                  <span>Create Post</span>
                </CButton>

                <Popover
                  content={NotificationContent}
                  trigger='click'
                  open={notificationVisible}
                  onOpenChange={setNotificationVisible}
                  placement='bottom'
                  overlayClassName='noti_popup'
                >
                  <Badge count={notificationsData.length} offset={[10, 0]}>
                    <FaRegBell className='notification' size={25} />
                  </Badge>
                </Popover>
                <div className='user_icon'>
                  <Popover
                    placement='bottomRight'
                    content={content}
                    trigger='click'
                  >
                    {userProfile?.img ? (
                      <Image
                        width={50}
                        height={50}
                        loading='lazy'
                        className='avatar'
                        src={userProfile?.img.pro}
                        alt='avatar'
                      />
                    ) : (
                      <PiUserCircleDuotone
                        color='var(--primary-text)'
                        size={40}
                      />
                    )}
                    {/* <GoChevronDown className='downarrow' size={20} /> */}
                  </Popover>
                </div>
              </div>
            ) : error || (!userProfile.id && !isLoading) ? (
              <CButton auth='auth' onClick={showModal}>
                LogIn
              </CButton>
            ) : (
              <div></div>
            )}
          </div>
        </nav>
      )}

      <SignUpModal
        modalTab={modalTab}
        setModalTab={setModalTab}
        handleCancel={handleCancel}
        isModalOpen={isModalOpen}
      />

      <Modal
        className='create_post_modal'
        open={isPostModalOpen}
        onCancel={handleCancel}
        footer={<></>}
        centered
      >
        {isPostModalOpen && (
          <CreatePost
            isPostModalOpen={isPostModalOpen}
            setIsPostModalOpen={setIsPostModalOpen}
          />
        )}
      </Modal>
    </>
  );
}

export default memo(Navbar);
