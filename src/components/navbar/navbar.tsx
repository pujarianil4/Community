"use client";
import { getSignMessage, useEthersSigner } from "@/config/ethers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState, use, ChangeEvent } from "react";
import { Modal, Divider, Popover } from "antd";
import { useDisconnect } from "wagmi";
import { PiUserCircleDuotone } from "react-icons/pi";
import "./navbar.scss";
import CButton from "../common/Button";
import CInput from "../common/Input";
import useRedux from "@/hooks/useRedux";
import { handleLogIn, handleLogOut, handleSignup } from "@/services/api/api";
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
  const [signupData, setSignupData] = useState({ userName: "", Name: "" });
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

  const handleSignupData = (
    event: ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    event.preventDefault();
    const value = event.target.value;
    const inputVal = {
      ...signupData,
      [field]: value,
    };
    setSignupData(inputVal);
  };

  const handleSignupUser = async () => {
    if (signupData?.userName != "") {
      openConnectModal;
    }
  };

  const call = async () => {
    try {
      const sign = await getSignMessage();

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
    } catch (error) {}
  };

  const userLogout = async () => {
    try {
      const logout = await handleLogOut();

      setUserSession(null);
    } catch (error) {}
  };

  useEffect(() => {
    dispatch(actions.setUserName("anil"));
    setUserSession(LocalStore.get("userSession"));
    if (signer && !messageHash && !hasCalledRef.current) {
      call();
      hasCalledRef.current = true;
    }
  }, [signer]);

  useEffect(() => {
    if (signupData.userName != "" && messageHash != undefined)
      handleSignup(signupData.userName, messageHash);
  }, [messageHash, signupData]);

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
          {/* <CInput
            // value={signupData.userName}
            // onChange={(e: { target: { value: string } }) =>
            //   setSignupData({ ...signupData, userName: e.target.value })
            // }
            value={signupData.userName}
            name='userName'
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              handleSignupData(e, "userName")
            }
            type='text'
            placeholder='userName'
          /> */}
          <input
            value={signupData.userName}
            placeholder='userName'
            name='userName'
            onChange={(e) =>
              setSignupData({ ...signupData, userName: e.target.value })
            }
            type='text'
          />
          <CInput type='text' placeholder='Name (Optional)' />
          <CButton onClick={handleSignupUser} size={18}>
            Sign Up
          </CButton>
        </div>
      </div>
    );
  };

  const content = (
    <div>
      <p onClick={userLogout}>LogOut</p>
      <p>Content</p>
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
              <Popover content={content} trigger='click'>
                <PiUserCircleDuotone color='var(--primary-border)' size={40} />
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
