"use client";

import React, { useEffect, useState, ChangeEvent } from "react";

import useRedux from "@/hooks/useRedux";
import { fetchUserByUserName } from "@/services/api/api";

import { RootState } from "@/contexts/store";
import { debounce, setClientSideCookie } from "@/utils/helpers";

import CButton from "../Button";
import CInput from "../Input";
import EvmAuthComponent from "./EvmAuth";
import SolanaAuthComponent from "./SolanaAuth";
import { Modal } from "antd";

import dynamic from "next/dynamic";
import CosmosAuthComponent from "./CosmosAuth";

// Dynamically import TronAuthComponent, disabling SSR
const TronAuthComponent = dynamic(() => import("./TronAuth"), {
  ssr: false,
});
interface ISignUpModal {
  handleCancel: () => void;
  isModalOpen: boolean;
  modalTab: number;
  setModalTab: (tab: number) => void;
  // signupData: ISignupData;
  // setSignupData: React.Dispatch<React.SetStateAction<ISignupData>>;
  // setIsSignup: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SignUpModal = ({
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
    setModalTab(3);

    return () => setModalTab(3);
  }, [isModalOpen]);

  const debouncedCheckUsername = debounce(async (username: string) => {
    try {
      if (username === "") {
        setUsernameError("");
        return;
      }
      const user = await fetchUserByUserName(username);
      if (user?.username) {
        const isAvailable = user?.username === username;

        if (isAvailable) {
          setUsernameError("Username already exists");
        } else {
          setUsernameError("Username is available");
        }
      }
    } catch (error: any) {
      if (username && error == "Error: user not available") {
        setUsernameError("Username is available");
      } else {
        setUsernameError("");
      }
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
    setSignUpData({
      ...signUpData,
      username: value.trim().toLocaleLowerCase(),
    });
    debouncedCheckUsername(value);
  };

  const handleUserAuthData = (user: any) => {
    console.log("user", user);

    if (user.notRegistered) {
      setSignUpData({ username: "", name: "" });
      setModalTab(2);
    } else if (user.error) {
      setSignUpData({ username: "", name: "" });
      setModalTab(3);
      setIsSignUp(false);
      handleCancel();
    } else {
      //setClientSideCookie("authToken", JSON.stringify(user));
      // setToLocalStorage("userSession", user);
      // dispatch(actions.setUserData(user));
      // dispatch(actions.setRefetchUser(true));
      setSignUpData({ username: "", name: "" });
      setModalTab(3);
      setIsSignUp(false);
      handleCancel();
    }

    // if (user?.token == "" || user.token == null || user.token == undefined) {
    //   // setUserSession(null);
    // } else {
    //   //setUserSession(user);
    // }
  };

  return (
    <Modal open={isModalOpen} onCancel={handleCancel} footer={<></>}>
      <div className='signUpModal'>
        {modalTab === 1 && (
          <div className='login'>
            <h4>Log In</h4>
            <CButton
              auth='auth'
              onClick={() => handleAuth(false)}
              className='login_btn'
            >
              Connect Wallet
            </CButton>
            <p>
              Don&apos;t have account?
              <span onClick={() => setModalTab(2)}> SignUp</span>
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
              className='signup_btn'
            >
              Connect Wallet
            </CButton>
            <p>
              Already have account?{" "}
              <span onClick={() => setModalTab(3)}>LogIn</span>
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

            <TronAuthComponent
              isSignUp={isSignUp}
              signUpData={signUpData}
              setUserAuthData={handleUserAuthData}
            />
            <CosmosAuthComponent
              isSignUp={isSignUp}
              signUpData={signUpData}
              setUserAuthData={handleUserAuthData}
            />
            <p>
              Don&apos;t have account?
              <span onClick={() => setModalTab(2)}> SignUp</span>
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
