import React, { useCallback, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  SolanaWalletButton,
  SolanaWallets,
} from "@/config/solanaWallet/SolanaProvider";
import Image from "next/image";
import { sigMsg } from "@/utils/constants";
import { fetchUserById, handleLogIn, handleSignup } from "@/services/api/api";
interface ISignupData {
  username: string;
  name: string;
}
interface ISolanaAuthComponent {
  isSignUp: boolean;
  signUpData: ISignupData;
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
  const buttonRef = useRef(null);

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
      let response;
      if (isSignUp) {
        response = await handleSignup(
          signUpData.username,
          signUpData.name,
          signedMessage,
          sigMsg,
          PUBLICKEY
        );
      } else {
        response = await handleLogIn({
          sig: signedMessage,
          msg: sigMsg,
          pubKey: PUBLICKEY,
        });
      }
      const userdata = await fetchUserById(response?.uid);
      const user = {
        username: userdata.username,
        name: userdata?.name || "",
        uid: response?.uid || 0,
        token: response?.token || "",
        img: userdata?.img,
      };
      console.log("auth", user);
      setUserAuthData(user);
    } catch (error) {
      disconnect();
      setUserAuthData({ error: true });
      console.error("Error signing the message:", error);
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
      <h2>Solana Wallets</h2>
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
