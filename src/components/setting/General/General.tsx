"use client";
import "./index.scss";
import { getSignMessage } from "@/config/ethers";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import {
  getAddressesByUserId,
  linkAddress,
  updateUser,
} from "@/services/api/api";
import { sigMsg } from "@/utils/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import TelegramLogin from "@/components/common/auth/telegramAuth";
import CButton from "@/components/common/Button";
import { TelegramAuthData } from "@/utils/types/types";
import NotificationMessage from "@/components/common/Notification";
import AuthModal from "@/components/common/auth/AuthModal";

export default function General() {
  const { openConnectModal } = useConnectModal();
  const CommonSelector = (state: RootState) => state?.common;
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [common, user]] = useRedux([
    CommonSelector,
    userNameSelector,
  ]);
  const { isLoading, data, callFunction } = useAsync(
    getAddressesByUserId,
    user.uid
  );
  const userAccount = useAccount();
  const { disconnect } = useDisconnect();
  const [messageHash, setMessageHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const hasCalledRef = useRef<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    dispatch(actions.setWalletRoute("linkWallet"));
    setIsModalOpen(true);
    // openConnectModal && openConnectModal();
    // callFunction(getAddressesByUserId, user.uid);
  };

  const handleLinkAddress = async () => {
    try {
      // const sign = await getSignMessage(sigMsg);
      // setMessageHash(sign);
      // const response = await linkAddress({
      //   sig: sign,
      //   msg: sigMsg,
      // });
      callFunction(getAddressesByUserId, user.uid);
      setIsModalOpen(false);
      dispatch(actions.setWalletRoute("auth"));
      // setTimeout(() => {
      //   dispatch(actions.setWalletRoute("auth"));
      // }, 4000);
    } catch (error) {
      // setTimeout(() => {
      //   disconnect();
      //   console.log("disconnect");
      //   setMessageHash(undefined);
      //   hasCalledRef.current = false;
      // }, 4000);
    }
  };

  useEffect(() => {
    if (!data) {
      callFunction(getAddressesByUserId, user.uid);
    }
  }, [userAccount.isConnected, user]);

  const handleTelegramAuth = async (user: TelegramAuthData) => {
    try {
      console.log("User authenticated:", user);
      updateUser({ tid: String(user.id) })
        .then((res) => {
          NotificationMessage("success", "Telegram Profile linked.");
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      console.error("Error authenticating user:", error);
    }
  };

  return (
    <>
      <div className='general_container'>
        <div className='linkAddress'>
          <div className='header'>
            <h2>Link Address</h2>
            <CButton onClick={handleOpenModal}>Link </CButton>
          </div>
          <div className='addresses'>
            {data?.map((wallet: { address: string; typ: string }) => (
              <span key={wallet.address}>
                {wallet.address} ({wallet.typ})
              </span>
            ))}
          </div>
        </div>
        <div className='linkAddress'>
          <div className='header'>
            <h2>Social</h2>
          </div>
          <div className='addresses'>
            <div>
              <span>Telegram</span>
              <TelegramLogin
                botUsername={"communitysetupbot"}
                onAuthCallback={handleTelegramAuth}
              />{" "}
            </div>
          </div>
        </div>
      </div>
      <AuthModal
        visible={isModalOpen}
        setVisible={setIsModalOpen}
        callBack={handleLinkAddress}
      />
    </>
  );
}
