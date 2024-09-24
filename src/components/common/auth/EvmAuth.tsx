import { getSignMessage } from "@/config/ethers";
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
import { useConnectModal } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import NotificationMessage from "../Notification";

import { DropdownLowIcon } from "@/assets/icons";
import { Collapse } from "antd";
const { Panel } = Collapse;
import { walletIcons } from "@/utils/constants/walletIcons";

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
    console.log("signedMessage", "tiger", isConnected);
    if (isConnected) {
      try {
        const signedMessage = await getSignMessage(sigMsg);
        console.log("signedMessage", signedMessage);
        setSignature(signedMessage || "");
        let response;
        if (walletRoute == "auth" && isSignUp) {
          response = await handleSignup(
            signUpData?.username,
            signUpData?.name,
            signedMessage,
            sigMsg
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
          response = await handleLogIn({ sig: signedMessage, msg: sigMsg });
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
  }, [isConnected]);

  React.useEffect(() => {
    if (isConnected) {
      signUserMessage();
    }
  }, [isConnected, signUserMessage]);

  interface WalletItem {
    rkDetails?: { id: string }; // Define as per your actual structure
    [key: string]: any; // Add more specific types if needed
  }

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
    <>
      <Collapse accordion style={{ marginTop: "10px" }}>
        <Panel
          header='Ethereum Wallets'
          key='1'
          extra={<DropdownLowIcon fill='#ffffff' width={13} height={7} />}
        >
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
                    key={connector.id}
                    className='wallet'
                    onClick={() => connect({ connector })}
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
        </Panel>
      </Collapse>
    </>
  );
}
