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
import { handleLogIn, handleLogOut, handleSignup } from "@/services/api/api";
import { User } from "@/contexts/reducers/user";
import CreatePost from "../createPost/CreatePost";
import { RootState } from "@/contexts/store";

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
    username: "UnilendOfficials",
    name: "Unilend",
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
        response = await handleSignup(signupData.username, sign);
      } else {
        response = await handleLogIn({ sig: sign, msg });
      }
      const user = {
        username: signupData.username,
        name: signupData.name,
        uid: response?.uid || 0,
        token: response?.token || "",
        img: response?.img || "",
      };
      dispatch(actions.setUserData(user));
      setUserSession(user);
      handleCancel();
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
    setUserSession(user);
    if (userAccount.isConnected && !messageHash && !hasCalledRef.current) {
      handleAuth();
      hasCalledRef.current = true;
    }
  }, [userAccount.isConnected]);

  const content = (
    <div className='user_popover'>
      <div className='row'>
        <PiUserCircleDuotone size={25} />
        <span className='text'>
          <span className='text_main'>Edit user</span>
          <span className='text_sub'>@username</span>
        </span>
      </div>
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
  const handleAuth = (isSignup: boolean = true) => {
    openModal && openModal();
    setIsSignup(isSignup);
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
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSignupData({ ...signupData, username: e.target.value })
          }
          type='text'
          placeholder='UserName'
        />
        <CInput
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setSignupData({ ...signupData, name: e.target.value })
          }
          type='text'
          placeholder='Name (Optional)'
        />
        <CButton onClick={() => handleAuth()} size={18}>
          Sign Up
        </CButton>
      </div>
    </div>
  );
};
