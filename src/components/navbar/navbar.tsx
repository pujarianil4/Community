"use client";
import { getSignMessage, useEthersSigner } from "@/config/ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import { Modal, Divider } from "antd";
import { useDisconnect } from "wagmi";
import "./navbar.scss";
import CButton from "../common/Button";
import CInput from "../common/Input";
import useRedux from "@/hooks/useRedux";

export default function Navbar() {
  const signer = useEthersSigner();
  const [{ dispatch, actions }] = useRedux();
  const { disconnect } = useDisconnect();
  const { openConnectModal } = useConnectModal();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageHash, setMessageHash] = useState<`0x${string}` | undefined>(
    undefined
  );
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
    const sign = await getSignMessage();

    setMessageHash(sign);
    console.log(sign);
    setTimeout(() => {
      handleDisconnect();
    }, 5000);
  };

  const handleDisconnect = async () => {
    disconnect();
    setMessageHash(undefined);
    hasCalledRef.current = false;
    console.log("disconnected");
  };

  useEffect(() => {
    dispatch(actions.setUserName("anil"));
    if (signer && !messageHash && !hasCalledRef.current) {
      call();
      hasCalledRef.current = true;
    } else if (signer && hasCalledRef.current) {
      // handleDisconnect();
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

  return (
    <>
      <nav className='nav_container'>
        <div></div>
        <div>
          <a href=''>Home</a>
          <a href=''>Stats</a>
        </div>
        <div className='signin'>
          <CButton onClick={showModal}>LogIn</CButton>
          {/* <ConnectButton /> */}
        </div>
      </nav>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={<></>}>
        <SignUpModal />
      </Modal>
    </>
  );
}
