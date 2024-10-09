import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import {
  fetchUserById,
  handleLogIn,
  handleSignup,
  linkAddress,
} from "@/services/api/api";
import { sigMsg } from "@/utils/constants";
import { setClientSideCookie } from "@/utils/helpers";
import { useChain, useChainWallet, useWallet } from "@cosmos-kit/react";
import Image from "next/image";
import React, { useCallback, useRef, useState } from "react";
import { useSelector } from "react-redux";

import NotificationMessage from "../Notification";

import { cosmosWallets } from "@/config/cosmos/cosmos";

export interface ISignupData {
  username: string;
  name: string;
}
interface ICosmosAuthComponent {
  isSignUp: boolean;
  signUpData: ISignupData | null;
  setUserAuthData: (user: any) => void;
}

export default function CosmosAuthComponent({
  isSignUp,
  signUpData,
  setUserAuthData,
}: ICosmosAuthComponent) {
  const chainContext = useChain("cosmoshub");
  const context1 = useChainWallet("cosmoshub", "keplr-extension", false);

  const {
    status,
    username,
    address,
    message,
    connect,
    disconnect,
    chainWallet,
    wallet,
    signArbitrary,
    isWalletConnected,
  } = context1;
  const ref = useRef<any>(null);
  console.log("cosmosWallets", cosmosWallets);

  const [{ dispatch, actions }] = useRedux();
  const walletRoute = useSelector(
    (state: RootState) => state.common.walletRoute
  );
  const [signature, setSignature] = useState<string | null>(null);

  const [isConnected, setIsConnected] = useState(false);

  const signUserMessage = useCallback(async () => {
    if (address && isWalletConnected) {
      try {
        const { signature: signedMessage } = await signArbitrary(
          address,
          sigMsg
        );
        console.log("CosmosSignature", sigMsg, signedMessage);

        setSignature(signedMessage || "");
        let response;
        if (walletRoute == "auth" && isSignUp) {
          response = await handleSignup(
            signUpData?.username,
            signUpData?.name,
            signedMessage,
            sigMsg,
            address
          );
          const userdata = await fetchUserById(response?.uid);
          const user = {
            username: userdata.username,
            name: userdata?.name || "",
            uid: response?.uid || 0,
            token: response?.token || "",
            img: userdata?.img?.pro,
            sid: response?.id || "",
          };
          setClientSideCookie("authToken", JSON.stringify(user));
          dispatch(actions.setUserData(user));
          dispatch(actions.setRefetchUser(true));
          setUserAuthData(user);
        } else if (walletRoute == "auth" && !isSignUp) {
          response = await handleLogIn({
            sig: signedMessage,
            msg: sigMsg,
            pubKey: address,
          });
          const userdata = await fetchUserById(response?.uid);
          const user = {
            username: userdata.username,
            name: userdata?.name || "",
            uid: response?.uid || 0,
            token: response?.token || "",
            img: userdata?.img?.pro,
            sid: response?.id || "",
          };
          setClientSideCookie("authToken", JSON.stringify(user));
          dispatch(actions.setUserData(user));
          dispatch(actions.setRefetchUser(true));
          setUserAuthData(user);
        } else if (walletRoute == "linkWallet") {
          const response = await linkAddress({
            sig: signedMessage,
            msg: sigMsg,
            pubKey: address,
          });
          setUserAuthData(response);
        }

        disconnect();
        setIsConnected(false);
      } catch (error: any) {
        disconnect();
        console.error("Error signing the message:", error);
        const msg = error.response.data.message;
        const code = error.response.data.statusCode;

        if (msg == "User not Registered!" && code == 404) {
          setUserAuthData({ notRegistered: true });
        } else {
          setUserAuthData({ error: msg });
        }
        // NotificationMessage("error", msg);
      }
    }
  }, [isWalletConnected, isConnected]);

  const handleConnect = async () => {
    try {
      if (isWalletConnected) {
        await signUserMessage();
      } else {
        // console.log("isWalletConnected", isWalletConnected, ref.current);
        // await disconnect();
        // console.log("isWalletConnected1", isWalletConnected, ref.current);
        await connect();

        setIsConnected(true);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  React.useEffect(() => {
    if (isConnected) {
      signUserMessage();
    }
  }, [isConnected, signUserMessage]);

  return (
    <div>
      {/* <div className='solana_wallets'>
            <div key={address} className='wallet' onClick={handleConnect}>
              <Image
                alt={wallet.prettyName}
                src={wallet.logo || ""}
                width={30}
                height={30}
              />
              <span>{wallet.prettyName}</span>
            </div>


          </div> */}
      {cosmosWallets.map((wallet: any) => {
        return (
          <div className='solana_wallets'>
            <div key={address} className='wallet' onClick={handleConnect}>
              <Image
                alt={wallet.walletInfo.prettyName}
                src={wallet.walletInfo.logo}
                width={30}
                height={30}
              />
              <span>{wallet.walletInfo.prettyName}</span>
            </div>
          </div>
        );
      })}

      {}
    </div>
  );
}
