"use client";
// @ts-nocheck
import { useAccount } from "wagmi";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState, ChangeEvent, memo } from "react";
import { Modal, Popover } from "antd";
import { useDisconnect } from "wagmi";
import { PiUserCircleDuotone } from "react-icons/pi";

import { IoLogOutOutline } from "react-icons/io5";
import "./navbar.scss";
import CButton from "../common/Button";
import { FaRegBell } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

import { AddIcon } from "@/assets/icons";

import useRedux from "@/hooks/useRedux";

import { fetchUserById } from "@services/api/userApi";

import CreatePost from "../createPost/CreatePost";
import { RootState } from "@/contexts/store";
import {
  debounce,
  deleteClientSideCookie,
  getClientSideCookie,
  setClientSideCookie,
} from "@/utils/helpers";
import Link from "next/link";

import { sigMsg } from "@/utils/constants";
import { IoSettingsOutline } from "react-icons/io5";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { SignUpModal } from "../common/auth/signUpModal";
import Searchbar from "./searchbar";
import { IoMdArrowBack } from "react-icons/io";
import { handleLogOut } from "@/services/api/authapi";
import { IUser } from "@/utils/types/types";
export interface ISignupData {
  username: string;
  name: string;
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
  const showModal = () => {
    setIsModalOpen(true);
  };

  const showCreatePost = () => {
    setIsPostModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setModalTab(1);
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  // useEffect(() => {
  //   console.log("userSession", userSession);
  // }, [userSession]);

  const userLogout = async () => {
    try {
      deleteClientSideCookie("authToken");
      const logout = await handleLogOut();
      // deleteClientSideCookie("authToken");
      setUserSession(null);
      const initialState: any = {
        username: "",
        name: "",
        uid: 0,
        token: "",
        img: "",
        sid: "",
        netWrth: 0,
        effectiveNetWrth: 0,
      };

      dispatch(actions.setUserData(initialState));
      // Add a short delay before reloading the page
      // setTimeout(() => {
      //   deleteClientSideCookie("authToken");
      //   router.push("/");
      //   window?.location?.reload();
      // }, 1000);
      // window?.location?.reload();
    } catch (error) {
      deleteClientSideCookie("authToken");
      setUserSession(null);
      const initialState: any = {
        username: "",
        name: "",
        uid: 0,
        token: "",
        img: "",
        sid: "",
        netWrth: 0,
        effectiveNetWrth: 0,
      };

      dispatch(actions.setUserData(initialState));
      // Add a short delay before reloading the page
      // setTimeout(() => {
      //   deleteClientSideCookie("authToken");
      //   router.push("/");
      //   window?.location?.reload();
      // }, 1000);
      //  window?.location?.reload();
    }
  };

  // useEffect(() => {
  //   console.log("userData", user);

  //   // if (!userData?.token) {
  //   //   setUserSession({ userAvailable: false });
  //   // } else {
  //   //   setUserSession(user);
  //   // }
  // }, []);

  const fetchFromCookies = () => {
    const userData1: any = getClientSideCookie("authToken");
    console.log("userFetc", userData1);
    if (userData?.uid) {
      setUserSession(userData);
      dispatch(actions.setUserData(userData));
    }
  };

  // fetch user details after refresh
  const fetchUser = async () => {
    const userData1: any = getClientSideCookie("authToken");
    console.log("userData1", userData1);
    if (userData?.uid) {
      const response = await fetchUserById(userData?.uid);
      console.log("response", response);
      const user = {
        username: response?.username,
        name: response?.name,
        uid: response?.id,
        token: userData1?.token,
        img: response?.img?.pro,
        sid: response?.id || "",
        netWrth: response?.netWrth,
        effectiveNetWrth: response?.effectiveNetWrth,
      };
      setUserSession(user);
      console.log("user", user);
      setClientSideCookie("authToken", JSON.stringify(user));
      dispatch(actions.setUserData(userData));
    }
  };
  useEffect(() => {
    // fetchFromCookies();
    // if (common?.refetch?.user) {
    //   fetchUser();
    //   dispatch(actions.setRefetchUser(false));
    // }
  }, [common?.refetch?.user]);

  const content = (
    <div className='user_popover'>
      <Link
        href={`/u/${userSession?.username}`}
        as={`/u/${userSession?.username}`}
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
              <Link href='#'>
                <h2>Numity</h2>
              </Link>
            </div>
            <div className='hidesearchbar'>
              <Searchbar />
            </div>
          </div>

          <div className='signin'>
            {userProfile?.username ? (
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
                <FaRegBell className='notification' size={25} />
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
            ) : userSession?.userAvailable == false || !userSession ? (
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
