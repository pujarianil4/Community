"use client";
import { getSignMessage } from "@/config/ethers";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { getAddressesByUserId, linkAddress } from "@/services/api/api";
import { sigMsg } from "@/utils/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

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

  return (
    <div>
      <button onClick={handleOpenModal}>Link Address</button>
    </div>
  );
}
