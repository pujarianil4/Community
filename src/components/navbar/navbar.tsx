"use client";
import { getSignMessage, useEthersSigner } from "@/config/ethers";
import { ConnectButton, useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, Divider } from "antd";
import { useSignMessage, useDisconnect } from "wagmi";
import "./navbar.scss";
import CustomButton from "../common/Button";
import CustomInput from "../common/Input";

export default function Navbar() {
  const signer = useEthersSigner();
  const { disconnect } = useDisconnect();
  const { signMessage } = useSignMessage();
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

          <CustomButton onClick={openConnectModal}>Connect Wallet</CustomButton>
        </div>
        <Divider className='divider'>Or</Divider>
        <div className='signup'>
          <h4>SignUp</h4>
          <CustomInput type='text' placeholder='UserName' />
          <CustomInput type='text' placeholder='Name (Optional)' />
          <CustomButton size={18}>Sign Up</CustomButton>
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
          <CustomButton onClick={showModal}>LogIn</CustomButton>
          {/* <ConnectButton /> */}
        </div>
      </nav>
      <Modal open={isModalOpen} onCancel={handleCancel} footer={<></>}>
        <SignUpModal />
      </Modal>
    </>
  );
}
