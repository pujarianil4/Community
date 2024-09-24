import React, { useCallback, useMemo, useState } from "react";
import {
  TronLinkAdapter,
  OkxWalletAdapter,
  BitKeepAdapter,
} from "@tronweb3/tronwallet-adapters";
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

import { useSelector } from "react-redux";

import NotificationMessage from "../Notification";

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
        console.log("signedMessage", signedMessage);

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
        setIsWalletConnected(false);
        await selectedAdapter.disconnect();
      } catch (error: any) {
        await selectedAdapter.disconnect();
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
    console.log("trigger", isWalletConnected);
    if (isWalletConnected) {
      console.log("trigger1", isWalletConnected);

      signUserMessage();
    }
  }, [isWalletConnected, signUserMessage]);

  return (
    <div>
      {true && (
        <div className='modal'>
          <h2>Select a Wallet</h2>
          {wallets.map((wallet) => (
            <button
              key={wallet.name}
              onClick={() => {
                connectWallet(wallet.adapter);
              }}
            >
              {wallet.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default TronAuthComponent;
