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
import { useChain, useWallet } from "@cosmos-kit/react";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { wallets } from "@cosmos-kit/keplr";

import NotificationMessage from "../Notification";
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
  } = chainContext;
  const [{ dispatch, actions }] = useRedux();
  const walletRoute = useSelector(
    (state: RootState) => state.common.walletRoute
  );
  const [signature, setSignature] = useState<string | null>(null);

  const signUserMessage = useCallback(async () => {
    if (address && isWalletConnected) {
      try {
        const { signature: signedMessage } = await signArbitrary(
          address,
          sigMsg
        );
        console.log(
          "signedMessage",
          wallet,

          status,
          username,
          address,
          message,
          signedMessage
        );
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
      } catch (error: any) {
        disconnect();
        console.error("Error signing the message:", error);
        const msg = error.response.data.message;
        const code = error.response.data.statusCode;
        console.log(
          "error",
          msg,
          code,
          msg == "User not Registered!",
          code == 404
        );

        if (msg == "User not Registered!" && code == 404) {
          setUserAuthData({ notRegistered: true });
        }
        // NotificationMessage("error", msg);
      }
    }
  }, [isWalletConnected]);

  // const handleConnect = async () => {
  //   try {
  //     await wallets[0].connect();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const handleWalletSelect = (wallet: any) => {
  //   wallet
  //     .connect() // Connect using wallet name
  //     .then((res) => {
  //       console.log(`Connected to ${wallet}`, res);
  //     })
  //     .catch((err) => {
  //       console.error(`Failed to connect to ${wallet.name}:`, err);
  //     });
  // };

  React.useEffect(() => {
    console.log("wallets", wallets[0]);

    if (isWalletConnected) {
      signUserMessage();
    }
  }, [isWalletConnected, signUserMessage]);

  return (
    <div className='eth_wallets'>
      <button onClick={connect}>{wallets[0].walletInfo.prettyName}</button>
      {/* <ul>
        {wallets.map((wallet: any) => (
          <li key={wallet.name}>
            <button onClick={() => handleWalletSelect(wallet)}>
              {wallet.logo && (
                <img src={wallet.logo} alt={wallet.name} width='30' />
              )}
              {wallet.walletInfo.prettyName}
            </button>
          </li>
        ))}
      </ul> */}
    </div>
  );
}
