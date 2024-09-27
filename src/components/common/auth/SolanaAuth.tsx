import React, { useCallback, useRef, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import {
  SolanaWalletButton,
  SolanaWallets,
} from "@/config/solanaWallet/SolanaProvider";
import Image from "next/image";
import { sigMsg } from "@/utils/constants";
import {
  fetchUserById,
  handleLogIn,
  handleSignup,
  linkAddress,
} from "@/services/api/api";
import { useSelector } from "react-redux";
import { RootState } from "@/contexts/store";
import { setClientSideCookie } from "@/utils/helpers";
import useRedux from "@/hooks/useRedux";

import { DropdownLowIcon } from "@/assets/icons";
import { Collapse } from "antd";
const { Panel } = Collapse;

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
          signUpData?.name,
          signedMessage,
          sigMsg,
          PUBLICKEY
        );
        const userdata = await fetchUserById(response?.uid);
        const user = {
          username: userdata.username,
          name: userdata?.name || "",
          uid: response?.uid || 0,
          token: response?.token || "",
          img: userdata?.img.pro,
          sid: response?.id || "",
          netWrth: userdata?.netWrth || 0,
          effectiveNetWrth: userdata?.effectiveNetWrth || 0,
        };

        setClientSideCookie("authToken", JSON.stringify(user));
        dispatch(actions.setUserData(user));
        dispatch(actions.setRefetchUser(true));
        setUserAuthData(user);
      } else if (walletRoute == "auth" && !isSignUp) {
        response = await handleLogIn({
          sig: signedMessage,
          msg: sigMsg,
          pubKey: PUBLICKEY,
        });
        const userdata = await fetchUserById(response?.uid);
        const user = {
          username: userdata.username,
          name: userdata?.name || "",
          uid: response?.uid || 0,
          token: response?.token || "",
          img: userdata?.img.pro,
          sid: response?.id || "",
          netWrth: userdata?.netWrth || 0,
          effectiveNetWrth: userdata?.effectiveNetWrth || 0,
        };
        setClientSideCookie("authToken", JSON.stringify(user));
        dispatch(actions.setUserData(user));
        dispatch(actions.setRefetchUser(true));
        setUserAuthData(user);
      } else if (walletRoute == "linkWallet") {
        const response = await linkAddress({
          sig: signedMessage,
          msg: sigMsg,
          pubKey: PUBLICKEY,
        });
        setUserAuthData(response);
      }
    } catch (error: any) {
      disconnect();
      localStorage.clear();

      console.error("Error signing the message:", error);
      const msg = error.response.data.message;
      const code = error.response.data.statusCode;

      if (msg == "User not Registered!" && code == 404) {
        setUserAuthData({ notRegistered: true });
      } else {
        setUserAuthData({ error: msg });
      }
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
    <>
      <Collapse accordion style={{ marginTop: "10px" }}>
        <Panel
          header='Solana Wallet'
          key='1'
          extra={<DropdownLowIcon fill='#ffffff' width={13} height={7} />}
        >
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
        </Panel>
      </Collapse>
    </>
  );
};

export default SolanaAuthComponent;
