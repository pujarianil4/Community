"use client";
import "./index.scss";
import { getSignMessage } from "@/config/ethers";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { getAddressesByUserId, linkAddress } from "@/services/api/api";
import { sigMsg } from "@/utils/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import TelegramLogin from "@/components/common/auth/telegramAuth";
import CButton from "@/components/common/Button";
import { TelegramAuthData } from "@/utils/types/types";

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

  const handleOpenModal = () => {
    dispatch(actions.setWalletRoute("linkWallet"));
    openConnectModal && openConnectModal();
  };

  const handleLinkAddress = async () => {
    try {
      const sign = await getSignMessage(sigMsg);
      setMessageHash(sign);
      const response = await linkAddress({
        sig: sign,
        msg: sigMsg,
      });
      callFunction(getAddressesByUserId, user.uid);
      setTimeout(() => {
        disconnect();
        console.log("disconnect");
        setMessageHash(undefined);
        hasCalledRef.current = false;
      }, 4000);
    } catch (error) {
      setTimeout(() => {
        disconnect();
        console.log("disconnect");
        setMessageHash(undefined);
        hasCalledRef.current = false;
      }, 4000);
    }
  };

  useEffect(() => {
    if (!data) {
      callFunction(getAddressesByUserId, user.uid);
    }

    if (
      userAccount.isConnected &&
      !messageHash &&
      !hasCalledRef.current &&
      common.walletRoute == "linkWallet"
    ) {
      handleLinkAddress();
      hasCalledRef.current = true;
    }
  }, [userAccount.isConnected, user]);

  const handleTelegramAuth = (user: TelegramAuthData) => {
    console.log("User authenticated:", user);
  };

  return (
    <div className='general_container'>
      <div className='linkAddress'>
        <div className='header'>
          <h2>Link Address</h2>
          <CButton onClick={handleOpenModal}>Link </CButton>
        </div>
        <div className='addresses'>
          {data?.map((wallet: { address: string }) => (
            <span key={wallet.address}>{wallet.address}</span>
          ))}
        </div>
      </div>
      <div className='linkAddress'>
        <div className='header'>
          <h2>Link TeleGram</h2>
          <CButton>
            {" "}
            <TelegramLogin
              botUsername={"communitysetupbot"}
              onAuthCallback={handleTelegramAuth}
            />{" "}
          </CButton>
        </div>
        {/* <div className='addresses'>
          {data?.map((wallet: { address: string }) => (
            <span key={wallet.address}>{wallet.address}</span>
          ))}
        </div> */}
      </div>
    </div>
  );
}
