"use client";

import React, { useCallback, useMemo, useState } from "react";
import {
  TronLinkAdapter,
  OkxWalletAdapter,
  BitKeepAdapter,
} from "@tronweb3/tronwallet-adapters";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { linkAddress } from "@/services/api/authapi";
import { fetchUserById } from "@services/api/userApi";
import { sigMsg } from "@/utils/constants";
import { setClientSideCookie } from "@/utils/helpers";

import Image from "next/image";

import { useSelector } from "react-redux";

import NotificationMessage from "../Notification";

import { handleLogIn, handleSignup } from "@/services/api/authapi";

type WalletAdapter = TronLinkAdapter | OkxWalletAdapter | BitKeepAdapter;

interface Wallet {
  name: string;
  adapter: WalletAdapter;
}

export interface ISignupData {
  username: string;
  name: string;
}
interface ITronAuthComponent {
  isSignUp: boolean;
  signUpData: ISignupData | null;
  setUserAuthData: (user: any) => void;
}

const wallets: Wallet[] = [
  { name: "TronLink", adapter: new TronLinkAdapter() },
  { name: "OKX Wallet", adapter: new OkxWalletAdapter() },
  { name: "Bitkeep Wallet", adapter: new BitKeepAdapter() },
];

const TronAuthComponent = ({
  isSignUp,
  signUpData,
  setUserAuthData,
}: ITronAuthComponent) => {
  const [isMounted, setIsMounted] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const [{ dispatch, actions }] = useRedux();
  const walletRoute = useSelector(
    (state: RootState) => state.common.walletRoute
  );
  const [signature, setSignature] = useState<string | null>(null);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [selectedAdapter, setSelectedAdapter] = useState<WalletAdapter>(
    wallets[0].adapter
  );

  React.useEffect(() => {
    setIsMounted(true); // Detects if the component is mounted in the browser
  }, []);
  const connectWallet = async (adapter: WalletAdapter) => {
    try {
      await adapter.connect();
      setSelectedAdapter(adapter);
      const address = adapter.address;
      console.log(address);
      setAddress(address || "");
      setIsWalletConnected(true);
    } catch (error) {
      console.error("Connection or signing error:", error);
    } finally {
      // adapter.disconnect();
    }
  };
  const signUserMessage = useCallback(async () => {
    if (isWalletConnected) {
      try {
        const signedMessage = await selectedAdapter.signMessage(sigMsg);
        console.log("signedMessage", sigMsg, signedMessage);

        setSignature(signedMessage || "");
        await selectedAdapter.disconnect();
        localStorage.clear();
        let response;
        if (walletRoute == "auth" && isSignUp) {
          response = await handleSignup(
            signUpData?.username,
            signUpData?.name ? signUpData?.name : null,
            signedMessage,
            sigMsg,
            "Tron",
            address
          );
          setUserAuthData({ user: true });
        } else if (walletRoute == "auth" && !isSignUp) {
          response = await handleLogIn({
            sig: signedMessage,
            msg: sigMsg,
            typ: "Tron",
            pubKey: address,
          });
          setUserAuthData({ user: true });
          setClientSideCookie("sid", response?.ip || "");
        } else if (walletRoute == "linkWallet") {
          const response = await linkAddress({
            sig: signedMessage,
            msg: sigMsg,
            typ: "Tron",
            pubKey: address,
          });
          setUserAuthData(response);
        }
        setIsWalletConnected(false);
      } catch (error: any) {
        await selectedAdapter.disconnect();
        localStorage.clear();
        console.error("Error signing the message:", error);
        const msg = error.message;
        const code = error.statusCode;

        if (msg == "User not Registered!" && code == 404) {
          setUserAuthData({ notRegistered: true });
        } else {
          setUserAuthData({ error: msg });
        }
        NotificationMessage("error", msg);
      }
    }
  }, [isWalletConnected]);

  React.useEffect(() => {
    if (isWalletConnected) {
      signUserMessage();
    }
  }, [isWalletConnected, signUserMessage]);

  if (!isMounted) {
    return null; // Prevents rendering on the server
  }

  return (
    <>
      {window?.navigator && (
        <div className='solana_wallets'>
          {/* <button>Solana Wallets</button> */}
          {wallets?.map((wallet, i) => (
            <div
              key={i}
              className='wallet'
              onClick={() => connectWallet(wallet.adapter)}
            >
              <Image
                alt={wallet.adapter.name}
                src={wallet.adapter.icon}
                width={30}
                height={30}
              />
              <span>{wallet.adapter.name}</span>
            </div>
          ))}

          {/* <SolanaWalletButton /> */}
        </div>
      )}
    </>
  );
};

export default TronAuthComponent;
