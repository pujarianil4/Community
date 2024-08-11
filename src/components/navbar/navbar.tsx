"use client";
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
import CInput from "../common/Input";
import useRedux from "@/hooks/useRedux";
import {
  fetchUserById,
  fetchUserByUserName,
  handleLogIn,
  handleLogOut,
  handleSignup,
} from "@/services/api/api";
import { User } from "@/contexts/reducers/user";
import CreatePost from "../createPost/CreatePost";
import { RootState } from "@/contexts/store";
import { debounce, getImageSource } from "@/utils/helpers";
import Link from "next/link";
import { setToLocalStorage } from "@/utils/helpers";

export interface ISignupData {
  username: string;
  name: string;
}

const msg = `Sign this message to prove you have access to this wallet in order to sign in to Community. This won't cost you any Gas. Date: ${Date.now()} `;

export default function Navbar() {
  const userAccount = useAccount();
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);
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
  const [userSession, setUserSession] = useState<any>(user);
  const [isSignup, setIsSignup] = useState<boolean>(false);
  const hasCalledRef = useRef(false);

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
  };

  const handleClosePostModal = () => {
    setIsPostModalOpen(false);
  };

  const userLogout = async () => {
    try {
      const logout = await handleLogOut();
      setUserSession(null);
      const initialState: any = {
        username: "",
        name: "",
        uid: 0,
        token: "",
        img: "",
      };
      dispatch(actions.setUserData(initialState));
    } catch (error) {}
  };

  const handleAuth = async () => {
    try {
      const sign = await getSignMessage(msg);
      setMessageHash(sign);
      let response;
      if (isSignup) {
        response = await handleSignup(signupData.username, sign, msg);
      } else {
        response = await handleLogIn({ sig: sign, msg });
      }
      const userdata = await fetchUserById(response.uid);
      const user = {
        username: userdata.username,
        name: userdata.name,
        uid: response?.uid || 0,
        token: response?.token || "",
        img: getImageSource(userdata?.img),
      };
      setToLocalStorage("userSession", user);
      dispatch(actions.setUserData(user));
      if (user?.token == "" || user.token == null || user.token == undefined) {
        setUserSession(null);
      } else {
        setUserSession(user);
      }
      handleCancel();
      setSignupData({ username: "", name: "" });
      setTimeout(() => {
        disconnect();
        console.log("disconnect");
        setMessageHash(undefined);
        hasCalledRef.current = false;
      }, 4000);
    } catch (error) {
      setTimeout(() => {
        disconnect();
        setMessageHash(undefined);
        hasCalledRef.current = false;
      }, 4000);
    }
  };

  useEffect(() => {
    if (user?.token == "" || user.token == null || user.token == undefined) {
      setUserSession(null);
    } else {
      setUserSession(user);
    }
    if (userAccount.isConnected && !messageHash && !hasCalledRef.current) {
      handleAuth();
      hasCalledRef.current = true;
    }
  }, [userAccount.isConnected]);

  // fetch user details after refresh
  const fetchUser = async () => {
    const value = localStorage?.getItem("userSession");
    const userData: any = value ? JSON.parse(value) : null;
    if (userData?.uid) {
      const response = await fetchUserById(userData?.uid);
      const user = {
        username: response?.username,
        name: response?.name,
        uid: response?.uid || 0,
        // token: response?.token || "",
        img: getImageSource(response?.img),
      };
      dispatch(actions.setUserData(user));
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  const content = (
    <div className='user_popover'>
      <Link
        href={`/u/${userSession?.username}`}
        as={`/u/${userSession?.username}`}
      >
        <div className='row'>
          <PiUserCircleDuotone size={25} />
          <span className='text'>
            <span className='text_main'>Profile</span>
            <span className='text_sub'>@{userSession?.username}</span>
          </span>
        </div>
      </Link>

      <Link href={"/settings"} as={"/settings"}>
        <div className='row'>
          <PiUserCircleDuotone size={25} />
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
      <nav className='nav_container'>
        <div></div>
        <div>
          <a href=''>Home</a>
          <a href=''>Stats</a>
        </div>
        <div className='signin'>
          {userSession ? (
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <CButton className='create_post' onClick={showCreatePost}>
                <AiOutlinePlus />
                Create
              </CButton>
              <div className='user_icon'>
                <Popover
                  placement='bottomRight'
                  content={content}
                  trigger='click'
                >
                  <PiUserCircleDuotone color='var(--primary-text)' size={40} />
                </Popover>
              </div>
            </div>
          ) : (
            <CButton onClick={showModal}>LogIn</CButton>
          )}

          {/* <ConnectButton /> */}
        </div>
      </nav>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={<></>}>
        <SignUpModal
          openModal={openConnectModal}
          signupData={signupData}
          setSignupData={setSignupData}
          setIsSignup={setIsSignup}
        />
      </Modal>
      <Modal
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
  openModal: (() => void) | undefined;
  signupData: ISignupData;
  setSignupData: React.Dispatch<React.SetStateAction<ISignupData>>;
  setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
}

const SignUpModal = ({
  openModal,
  signupData,
  setSignupData,
  setIsSignup,
}: ISignUpModal) => {
  const [usernameError, setUsernameError] = useState<string>("");

  const debouncedCheckUsername = debounce(async (username: string) => {
    try {
      const user = await fetchUserByUserName(username);
      const isAvailable = user?.username === username;
      if (isAvailable) {
        setUsernameError("Username already exists");
      } else {
        setUsernameError("");
      }
    } catch (error) {
      setUsernameError("Error checking username availability");
    }
  }, 500);
  const handleAuth = (isSignup: boolean = true) => {
    if (!!usernameError || !signupData?.username || !signupData?.name) {
      openModal && openModal();
      setIsSignup(isSignup);
    }
  };
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSignupData({ ...signupData, username: value.trim() });
    debouncedCheckUsername(value);
  };
  return (
    <div className='signUpModal'>
      <div className='login'>
        <h4>Log In</h4>
        <CButton onClick={() => handleAuth(false)}>Connect Wallet</CButton>
      </div>
      <Divider className='divider'>Or</Divider>
      <div className='signup'>
        <h4>SignUp</h4>
        <CInput
          onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e)}
          type='text'
          placeholder='UserName'
        />
        <p className='user_name_message'>{usernameError}</p>
        <CInput
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSignupData({ ...signupData, name: e.target.value.trim() })
          }
          type='text'
          placeholder='Name (Optional)'
        />
        <CButton
          disabled={
            !!usernameError || !signupData?.username || !signupData?.name
          }
          onClick={() => handleAuth()}
          size={18}
        >
          Sign Up
        </CButton>
      </div>
    </div>
  );
};
