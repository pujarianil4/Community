import { getSignMessage } from "@/config/ethers";
import { fetchUserById, handleLogIn, handleSignup } from "@/services/api/api";
import { sigMsg } from "@/utils/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
export interface ISignupData {
  username: string;
  name: string;
}
interface IEvmAuthComponent {
  isSignUp: boolean;
  signUpData: ISignupData;
  setUserAuthData: (user: any) => void;
}

export default function EvmAuthComponent({
  isSignUp,
  signUpData,
  setUserAuthData,
}: IEvmAuthComponent) {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { connect, connectors } = useConnect();
  const { openConnectModal } = useConnectModal();
  const [signature, setSignature] = useState<string | null>(null);

  const signUserMessage = useCallback(async () => {
    if (!isConnected) throw new Error("Not connected");
    console.log("signedMessage", "tiger");
    try {
      const signedMessage = await getSignMessage(sigMsg);
      console.log("signedMessage", signedMessage);

      setSignature(signedMessage || "");

      disconnect();
      let response;
      if (isSignUp) {
        response = await handleSignup(
          signUpData.username,
          signUpData.name,
          signedMessage,
          sigMsg
        );
      } else {
        response = await handleLogIn({ sig: signedMessage, msg: sigMsg });
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
      console.error("Error signing the message:", error);
    }
  }, [isConnected]);

  React.useEffect(() => {
    if (isConnected) {
      signUserMessage();
    }
  }, [isConnected, signUserMessage]);

  return (
    <div className='eth_wallets'>
      <h2>Ethereum Wallets</h2>
      <div className='wallet' onClick={openConnectModal}>
        <Image
          src='https://www.rainbowkit.com/rainbow.svg'
          alt=''
          width={25}
          height={25}
        />
        <span>Rainbowkit</span>
      </div>
      {/* {connectors.map((connector) => {
        return (
          <div onClick={() => connect({ connector })}>
            {" "}
            <Image
              src='https://www.rainbowkit.com/rainbow.svg'
              alt=''
              width={25}
              height={25}
            />{" "}
          </div>
        );
      })} */}
    </div>
  );
}
