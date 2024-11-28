import React, { useCallback, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  SolanaWalletButton,
  SolanaWallets,
} from "@/config/solanaWallet/SolanaProvider";
import Image from "next/image";
import { sigMsg } from "@/utils/constants";
import { linkAddress } from "@/services/api/authapi";
import { fetchUserById } from "@services/api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { setClientSideCookie } from "@/utils/helpers";
import useRedux from "@/hooks/useRedux";
import NotificationMessage from "../Notification";
import { handleLogIn, handleSignup } from "@/services/api/authapi";

interface ISignupData {
  username: string;
  name: string;
}
interface ISolanaAuthComponent {
  isSignUp: boolean;
  signUpData: ISignupData | null;
  setUserAuthData: (user: any) => void;
}

const SolanaAuthComponent = ({
  isSignUp,
  signUpData,
  setUserAuthData,
}: ISolanaAuthComponent) => {
  const {
    publicKey,
    signMessage,
    connect,
    disconnect,
    connected,
    wallets,
    select,
  } = useWallet();
  const [signature, setSignature] = useState<string | null>(null);

  const [{ dispatch, actions }] = useRedux();
  const walletRoute = useSelector(
    (state: RootState) => state.common.walletRoute
  );

  // Function to sign a message
  const signUserMessage = useCallback(async () => {
    if (!publicKey) throw new Error("Not connected");
    console.log("publicKey", publicKey);
    try {
      const message = new TextEncoder().encode(sigMsg);
      const hashSign = await signMessage?.(message);
      const PUBLICKEY = publicKey.toBase58();
      const signedMessage = Buffer.from(hashSign || "").toString("hex");
      console.log("signedMessage", signedMessage, sigMsg, PUBLICKEY);

      setSignature(signedMessage);
      disconnect();
      localStorage.clear();
      let response;
      if (walletRoute == "auth" && isSignUp) {
        response = await handleSignup(
          signUpData?.username,
          signUpData?.name ? signUpData?.name : null,
          signedMessage,
          sigMsg,
          "Solana",
          PUBLICKEY
        );
        setUserAuthData({ user: true });
      } else if (walletRoute == "auth" && !isSignUp) {
        response = await handleLogIn({
          sig: signedMessage,
          msg: sigMsg,
          pubKey: PUBLICKEY,
          typ: "Solana",
        });
        setUserAuthData({ user: true });
        setClientSideCookie("sid", response?.ip || "");
      } else if (walletRoute == "linkWallet") {
        const response = await linkAddress({
          sig: signedMessage,
          msg: sigMsg,
          pubKey: PUBLICKEY,
          typ: "Solana",
        });
        setUserAuthData(response);
      }
    } catch (error: any) {
      disconnect();
      // localStorage.clear();

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
  }, [publicKey, signMessage]);

  const handleWalletClick = async (walletName: any) => {
    try {
      select(walletName);
      await connect();
    } catch (error) {
      console.error("Error connecting to wallet:", error);
    }
  };

  // Effect to sign the message when the wallet connects
  React.useEffect(() => {
    if (connected) {
      signUserMessage();
    }
  }, [connected, signUserMessage]);

  return (
    <div className='solana_wallets'>
      {/* <button>Solana Wallets</button> */}
      {wallets?.map((wallet, i) => (
        <div
          key={i}
          className='wallet'
          onClick={() => handleWalletClick(wallet.adapter.name)}
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
  );
};

export default SolanaAuthComponent;
