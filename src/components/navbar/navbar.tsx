"use client";
// @ts-nocheck
import { getSignMessage } from "@/config/ethers";
import { useAccount } from "wagmi";
// import { useSigner } from 'wagmi';
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState, ChangeEvent } from "react";
import { Modal, Divider, Popover } from "antd";
import { useDisconnect } from "wagmi";
import { PiUserCircleDuotone } from "react-icons/pi";
import { AiOutlinePlus } from "react-icons/ai";
import { IoLogOutOutline } from "react-icons/io5";
import "./navbar.scss";
import CButton from "../common/Button";
import { FaRegBell } from "react-icons/fa6";
import { IoSearch } from "react-icons/io5";

import { NotificationIcon, AddIcon, DropdownLowIcon } from "@/assets/icons";

import useRedux from "@/hooks/useRedux";
import {
  fetchUserById,
  fetchUserByUserName,
  handleLogIn,
  handleLogOut,
  handleSignup,
} from "@/services/api/api";

import CreatePost from "../createPost/CreatePost";
import { RootState } from "@/contexts/store";
import {
  debounce,
  deleteClientSideCookie,
  getClientSideCookie,
  getImageSource,
  setClientSideCookie,
} from "@/utils/helpers";
import Link from "next/link";

import { sigMsg } from "@/utils/constants";
import { IoSettingsOutline } from "react-icons/io5";

import CInput from "../common/Input";
import Image from "next/image";
import NotificationMessage from "../common/Notification";
import { useRouter } from "next/navigation";
import EvmAuthComponent from "../common/auth/EvmAuth";
import SolanaAuthComponent from "../common/auth/SolanaAuth";
import TelegramLogin from "../common/auth/telegramAuth";
import { TelegramAuthData } from "@/utils/types/types";
export interface ISignupData {
  username: string;
  name: string;
}

const msg = sigMsg;

const commonSelector = (state: RootState) => state?.common;
const userNameSelector = (state: RootState) => state?.user;

const tgBotName = process.env.TG_BOT_NAME;
export default function Navbar() {
  const userAccount = useAccount();

  const [{ dispatch, actions }, [user, common]] = useRedux([
    userNameSelector,
    commonSelector,
  ]);

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
  const [userSession, setUserSession] = useState<any>(user || userData);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const hasCalledRef = useRef(false);
  const [modalTab, setModalTab] = useState(1);

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

  useEffect(() => {
    console.log("userSession", userSession);
  }, [userSession]);

  const userLogout = async () => {
    try {
      const logout = await handleLogOut();
      deleteClientSideCookie("authToken");
      setUserSession(null);
      const initialState: any = {
        username: "",
        name: "",
        uid: 0,
        token: "",
        img: "",
      };
      router.push("/");
      dispatch(actions.setUserData(initialState));
    } catch (error) {}
  };

  useEffect(() => {
    if (user?.token == "" || user.token == null || user.token == undefined) {
      setUserSession(null);
    } else {
      setUserSession(user);
    }
  }, [user]);

  // fetch user details after refresh
  const fetchUser = async () => {
    const userData1: any = getClientSideCookie("authToken");
    console.log("userFetc", userData1);

    if (userData?.uid) {
      const response = await fetchUserById(userData?.uid);
      const user = {
        username: response?.username,
        name: response?.name,
        uid: response?.id,
        token: userData1?.token,
        img: response?.img,
      };
      setUserSession(user);
      // setClientSideCookie("authToken", JSON.stringify(user));
      dispatch(actions.setUserData(user));
    }
  };
  useEffect(() => {
    fetchUser();
    if (common?.refetch?.user) {
      dispatch(actions.setRefetchUser(false));
    }
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
            <span className='text_sub'>@{userSession?.username}</span>
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

  // return <></>;

  return (
    <>
      <nav className='nav_container'>
        <div>
          <Link href='#'>
            <h2>Numity</h2>
          </Link>
        </div>
        <div className='search_container'>
          <CInput
            prefix={<IoSearch />}
            placeholder='Search Post Here'
            className='search'
          />
        </div>
        <div className='signin'>
          {userSession?.token || userData ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <CButton className='create_post' onClick={showCreatePost}>
                <AddIcon />
                Create Post
              </CButton>
              <FaRegBell className='notification' size={25} />
              <div className='user_icon'>
                <Popover
                  placement='bottomRight'
                  content={content}
                  trigger='click'
                >
                  {userSession?.img ? (
                    <Image
                      width={40}
                      height={40}
                      loading='lazy'
                      className='avatar'
                      src={userSession?.img}
                      alt='avatar'
                    />
                  ) : (
                    <PiUserCircleDuotone
                      color='var(--primary-text)'
                      size={40}
                    />
                  )}
                </Popover>
              </div>
            </div>
          ) : (
            <CButton auth='auth' onClick={showModal}>
              LogIn
            </CButton>
          )}
        </div>
      </nav>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={<></>}>
        <SignUpModal
          modalTab={modalTab}
          setModalTab={setModalTab}
          handleCancel={handleCancel}
          isModalOpen={isModalOpen}
        />
      </Modal>
      <Modal
        className='create_post_modal'
        open={isPostModalOpen}
        onCancel={handleClosePostModal}
        footer={<></>}
        centered
      >
        <CreatePost setIsPostModalOpen={setIsPostModalOpen} />
      </Modal>
    </>
  );
}

interface ISignUpModal {
  handleCancel: () => void;
  isModalOpen: boolean;
  modalTab: number;
  setModalTab: (tab: number) => void;
  // signupData: ISignupData;
  // setSignupData: React.Dispatch<React.SetStateAction<ISignupData>>;
  // setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpModal = ({
  handleCancel,
  isModalOpen,
  modalTab,
  setModalTab,
}: ISignUpModal) => {
  const [usernameError, setUsernameError] = useState<string>("");
  const CommonSelector = (state: RootState) => state?.common;

  const [{ dispatch, actions }, [common]] = useRedux([CommonSelector]);
  const [signUpData, setSignUpData] = useState({ username: "", name: "" });
  const [isSignUp, setIsSignUp] = useState(false);

  useEffect(() => {
    setModalTab(1);
    console.log("modal", modalTab, isModalOpen);

    return () => setModalTab(1);
  }, [isModalOpen]);

  const debouncedCheckUsername = debounce(async (username: string) => {
    try {
      if (username === "") {
        setUsernameError("");
        return;
      }
      const user = await fetchUserByUserName(username);
      const isAvailable = user?.username === username;
      if (isAvailable) {
        setUsernameError("Username already exists");
      } else {
        setUsernameError("Username is available");
      }
    } catch (error) {
      setUsernameError("Error checking username availability");
    }
  }, 500);
  const handleAuth = (isSignup: boolean = true) => {
    console.log("IF_CALL");
    dispatch(actions.setWalletRoute("auth"));
    // openModal && openModal();
    setModalTab(3);
    setIsSignUp(isSignup);
  };
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignUpData({ ...signUpData, username: value.trim() });
    debouncedCheckUsername(value);
  };

  const handleUserAuthData = (user: any) => {
    if (user.error) {
      setSignUpData({ username: "", name: "" });
      setModalTab(1);
      setIsSignUp(false);
      handleCancel();
    } else {
      setClientSideCookie("authToken", JSON.stringify(user));
      // setToLocalStorage("userSession", user);
      dispatch(actions.setUserData(user));
      dispatch(actions.setRefetchUser(true));
      setSignUpData({ username: "", name: "" });
      setModalTab(1);
      setIsSignUp(false);
      handleCancel();
    }

    // if (user?.token == "" || user.token == null || user.token == undefined) {
    //   // setUserSession(null);
    // } else {
    //   //setUserSession(user);
    // }
  };
  const handleTelegramAuth = (user: TelegramAuthData) => {
    console.log("User authenticated:", user);
  };

  return (
    <div className='signUpModal'>
      {modalTab === 1 && (
        <div className='login'>
          <h4>Log In</h4>
          <CButton auth='auth' onClick={() => handleAuth(false)}>
            Connect Wallet
          </CButton>
          {/* <button>
            <TelegramLogin
              botUsername={"communitysetupbot"}
              onAuthCallback={handleTelegramAuth}
            />
          </button> */}
          <p>
            Don&apos;t have account?
            <span onClick={() => setModalTab(2)}>SignUp</span>
          </p>
        </div>
      )}

      {modalTab === 2 && (
        <div className='signup'>
          <h4>SignUp</h4>
          <CInput
            onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
            type='text'
            placeholder='UserName'
            value={signUpData.username}
          />
          <p
            className={`${
              usernameError == "Username is available" ? "success" : "error"
            }`}
          >
            {usernameError}
          </p>
          <CInput
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSignUpData({ ...signUpData, name: e.target.value.trim() })
            }
            type='text'
            placeholder='Name (Optional)'
            value={signUpData.name}
          />
          <CButton
            auth='auth'
            disabled={
              usernameError === "Username already exists" ||
              !signUpData?.username ||
              !signUpData?.name
            }
            onClick={() => handleAuth()}
            size={18}
          >
            Sign Up
          </CButton>
          <p>
            have account? <span onClick={() => setModalTab(1)}>LogIn</span>
          </p>
        </div>
      )}
      {modalTab == 3 && (
        <div className='wallet_modal'>
          <EvmAuthComponent
            isSignUp={isSignUp}
            signUpData={signUpData}
            setUserAuthData={handleUserAuthData}
          />
          <SolanaAuthComponent
            isSignUp={isSignUp}
            signUpData={signUpData}
            setUserAuthData={handleUserAuthData}
          />
        </div>
      )}
    </div>
  );
};
