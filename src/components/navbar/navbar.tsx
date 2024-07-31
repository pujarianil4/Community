"use client";
import { getSignMessage, useEthersSigner } from "@/config/ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState, use } from "react";
import { Modal, Divider, Popover } from "antd";
import { useDisconnect } from "wagmi";
import { PiUserCircleDuotone } from "react-icons/pi";
import { IoLogOutOutline } from "react-icons/io5";

import "./navbar.scss";
import CButton from "../common/Button";
import CInput from "../common/Input";
import useRedux from "@/hooks/useRedux";
import { handleLogIn, handleLogOut } from "@/services/api/api";
import { LocalStore } from "@/utils/helpers";

export default function Navbar() {
  const signer = useEthersSigner();
  const [{ dispatch, actions }] = useRedux();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageHash, setMessageHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const [userSession, setUserSession] = useState(LocalStore.get("userSession"));
  const hasCalledRef = useRef(false);
  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const call = async () => {
    try {
      const sign = await getSignMessage();
      console.log(sign);

      setMessageHash(sign);

      await handleLogIn(sign);
      setUserSession(LocalStore.get("userSession"));
      handleCancel();
      console.log(sign);
      setTimeout(() => {
        disconnect();
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

  const userLogout = async () => {
    try {
      const logout = await handleLogOut();

      setUserSession(null);
    } catch (error) {}
  };

  useEffect(() => {
    dispatch(actions.setUserName("anil"));
    setUserSession(null);
    if (signer && !messageHash && !hasCalledRef.current) {
      call();
      hasCalledRef.current = true;
    }
  }, [signer]);

  const SignUpModal = () => {
    return (
      <div className='signUpModal'>
        <div className='login'>
          <h4>Log In</h4>

          <CButton onClick={openConnectModal}>Connect Wallet</CButton>
        </div>
        <Divider className='divider'>Or</Divider>
        <div className='signup'>
          <h4>SignUp</h4>
          <CInput type='text' placeholder='UserName' />
          <CInput type='text' placeholder='Name (Optional)' />
          <CButton size={18}>Sign Up</CButton>
        </div>
      </div>
    );
  };

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
            <div className='user_icon'>
              <Popover
                placement='bottomRight'
                content={content}
                trigger='click'
              >
                <PiUserCircleDuotone color='var(--primary-text)' size={40} />
              </Popover>
            </div>
          ) : (
            <CButton onClick={showModal}>LogIn</CButton>
          )}

          {/* <ConnectButton /> */}
        </div>
      </nav>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={<></>}>
        <SignUpModal />
      </Modal>
    </>
  );
}
