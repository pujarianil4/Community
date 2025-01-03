import { getSignMessage } from "@/config/ethers";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { linkAddress } from "@/services/api/authapi";
import { fetchUserById } from "@services/api/userApi";
import { sigMsg } from "@/utils/constants";
import { setClientSideCookie } from "@/utils/helpers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import NotificationMessage from "../Notification";

import { walletIcons } from "@/utils/constants/walletIcons";
import { handleLogIn, handleSignup } from "@/services/api/authapi";
import { saveTokens } from "@/services/api/api";

export interface ISignupData {
  username: string;
  name: string;
}
interface IEvmAuthComponent {
  isSignUp: boolean;
  signUpData: ISignupData | null;
  setUserAuthData: (user: any) => void;
}

export default function EvmAuthComponent({
  isSignUp,
  signUpData,
  setUserAuthData,
}: IEvmAuthComponent) {
  const { isConnected, address } = useAccount();
  const { connectors, connect, error } = useConnect();

  const { disconnect } = useDisconnect();
  const [{ dispatch, actions }] = useRedux();
  const walletRoute = useSelector(
    (state: RootState) => state.common.walletRoute
  );
  const { openConnectModal } = useConnectModal();
  const [signature, setSignature] = useState<string | null>(null);

  const signUserMessage = useCallback(async () => {
    console.log("signedMessage", "tiger", isConnected, walletRoute, isSignUp);
    if (true) {
      try {
        const signedMessage = await getSignMessage(sigMsg);
        console.log("signedMessage", signedMessage);
        setSignature(signedMessage || "");
        disconnect();
        let response;
        if (walletRoute == "auth" && isSignUp) {
          response = await handleSignup(
            signUpData?.username,
            signUpData?.name ? signUpData?.name : null,
            signedMessage,
            sigMsg,
            "EVM"
          );
          setUserAuthData({ user: true });
        } else if (walletRoute == "auth" && !isSignUp) {
          response = await handleLogIn({
            sig: signedMessage,
            msg: sigMsg,
            typ: "EVM",
          });
          console.log("login", response);
          setUserAuthData({ user: true });
          // const userdata = await fetchUserById(response?.uid);
          // console.log("USER", userdata);
          // saveTokens(response?.uid, response?.token);
          // const user = {
          //   username: userdata.username,
          //   name: userdata?.name || "",
          //   uid: response?.uid || 0,
          //   token: response?.token || "",
          //   img: userdata?.img?.pro,
          //   sid: response?.id || "",
          //   netWrth: userdata?.netWrth || 0,
          //   effectiveNetWrth: userdata?.effectiveNetWrth || 0,
          // };
          setClientSideCookie("sid", response?.ip || "");
          // dispatch(actions.setUserData(user));
          // dispatch(actions.setRefetchUser(true));
          //setUserAuthData(user);
        } else if (walletRoute == "linkWallet") {
          const response = await linkAddress({
            sig: signedMessage,
            msg: sigMsg,
            typ: "EVM",
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
    }
  }, [isConnected]);

  const handleWalletClick = useCallback(
    async (connector: any) => {
      try {
        connect(
          { connector },
          {
            onSuccess: async (data) => {
              console.log("datasuccess", data);
              await signUserMessage();
              return;
            },
          }
        );
        if (isConnected) {
          await signUserMessage();
        }
        // After successful connection, sign the message
      } catch (error) {
        console.error("Error connecting wallet or signing message:", error);
      }
    },
    [connect, signUserMessage, isConnected]
  );

  // React.useEffect(() => {
  //   if (isConnected) {
  //     signUserMessage();
  //   }
  // }, [isConnected, signUserMessage]);

  function filterDuplicates(walletArray: any) {
    const seenIds = new Set<string>();

    return walletArray.filter((wallet: any) => {
      const id = wallet.rkDetails?.id; // Check if `rkDetails` and `id` exist
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        return true;
      }
      return false; // Filter out duplicates
    });
  }

  const filteredConnectors = filterDuplicates(connectors);
  console.log("conectors", connectors, filteredConnectors);
  return (
    <div className='eth_wallets'>
      {filteredConnectors
        // .filter((cn: any, i: number) => i != 3)
        .map((connector: any, i: number) => {
          const rkDetails = connector.rkDetails || {};
          const connectorName = rkDetails.name || connector.name;
          const connectorIconUrl =
            walletIcons[rkDetails.id] ||
            walletIcons[connector.id] ||
            connector.icon;
          return (
            <div
              key={rkDetails?.id}
              className='wallet'
              onClick={() => handleWalletClick(connector)}
            >
              <Image
                src={connectorIconUrl}
                alt={`${connectorName} logo`}
                width={30}
                height={30}
              />
              <span>{connectorName}</span>
            </div>
          );
        })}
    </div>
  );
}
