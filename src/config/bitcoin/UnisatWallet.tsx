import React, { useCallback, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { linkAddress } from "@/services/api/authapi";
import { sigMsg } from "@/utils/constants";
import unisatLogo from "@/assets/walletIcon/unisat.svg";
import { useSelector } from "react-redux";
import NotificationMessage from "@/components/common/Notification";
import { handleLogIn, handleSignup } from "@/services/api/authapi";

export interface ISignupData {
  username: string;
  name: string;
}

interface UnisatWalletProps {
  isSignUp: boolean;
  signUpData: ISignupData | null;
  setUserAuthData: (user: any) => void;
}

const UnisatWallet: React.FC<UnisatWalletProps> = ({
  isSignUp,
  signUpData,
  setUserAuthData,
}) => {
  const [unisatInstalled, setUnisatInstalled] = useState(false);
  const [connected, setConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [publicKey, setPublicKey] = useState("");
  const [result, setResult] = useState({
    success: false,
    error: "",
    data: "",
  });

  const walletRoute = useSelector(
    (state: RootState) => state.common.walletRoute
  );

  const selfRef = useRef<{ accounts: string[] }>({
    accounts: [],
  });
  const self = selfRef.current;

  const handleAccountsChanged = (accounts: string[]) => {
    console.log("accounts changed", accounts);
    self.accounts = accounts;
    if (accounts.length > 0) {
      setAddress(accounts[0]);
    }
  };

  const signUserMessage = useCallback(
    async (signingMethod = "ecdsa") => {
      if (!address || !connected) return;

      const unisat = (window as any).unisat;
      const message = sigMsg;
      console.log("signature", message);
      setResult({
        success: false,
        error: "Requesting...",
        data: "",
      });

      try {
        // Sign message using selected method (ecdsa or bip322-simple)
        const signature = await unisat.signMessage(message, signingMethod);
        console.log("Signature:", signature);

        setResult({
          success: true,
          error: "",
          data: signature,
        });

        let response;
        if (walletRoute === "auth" && isSignUp) {
          response = await handleSignup(
            signUpData?.username,
            signUpData?.name,
            signature,
            message,
            "Cosmos",
            address
          );
          setUserAuthData({ user: response });
        } else if (walletRoute === "auth" && !isSignUp) {
          // Handle login case
          response = await handleLogIn({
            sig: signature,
            msg: message,
            typ: "Cosmos",
            pubKey: address,
          });
          setUserAuthData({ user: response });
        } else if (walletRoute === "linkWallet") {
          // Handle wallet linking case
          response = await linkAddress({
            sig: signature,
            msg: message,
            typ: "Cosmos",
            pubKey: address,
          });
          setUserAuthData(response);

          await disconnect();
          setConnected(false);
        }
      } catch (error: any) {
        await disconnect();
        setConnected(false);
        console.error("Error signing the message:", error);
        setResult({
          success: false,
          error: error.message,
          data: "",
        });
        NotificationMessage("error", error.message);
      }
    },
    [address, connected, setUserAuthData]
  );

  const disconnect = async () => {
    console.log("disconnect wallet");
    await unisat.disconnect();
  };

  useEffect(() => {
    if (connected && address) {
      signUserMessage("ecdsa");
    }
  }, [connected, address, signUserMessage]);

  const getBasicInfo = async () => {
    const unisat = (window as any).unisat;
    try {
      const accounts = await unisat.getAccounts();
      handleAccountsChanged(accounts);
      const publicKey = await unisat.getPublicKey();
      setPublicKey(publicKey);
    } catch (e) {
      console.log("getAccounts or getPublicKey error", e);
    }
  };

  useEffect(() => {
    async function checkUnisat() {
      let unisat = (window as any).unisat;
      for (let i = 1; i < 10 && !unisat; i += 1) {
        await new Promise((resolve) => setTimeout(resolve, 100 * i));
        unisat = (window as any).unisat;
      }

      if (unisat) {
        setUnisatInstalled(true);
        unisat
          .getAccounts()
          .then((accounts: string[]) => {
            handleAccountsChanged(accounts);
            if (accounts.length > 0) {
              setConnected(true);
              setAddress(accounts[0]);
              getBasicInfo();
            }
          })
          .catch((e: any) => {
            console.error(e.message);
          });
      }
      return () => {
        unisat.removeListener("accountsChanged", handleAccountsChanged);
      };
    }

    checkUnisat();
  }, [handleAccountsChanged]);

  if (!unisatInstalled) {
    return (
      <div className='solana_wallets'>
        <div
          className='wallet'
          onClick={() => {
            window.open("https://unisat.io", "_blank");
          }}
        >
          <Image
            src={unisatLogo}
            alt='Unisat Wallet Logo'
            width={30}
            height={30}
          />
          <span>Install Unisat Wallet</span>
        </div>
      </div>
    );
  }

  const unisat = (window as any).unisat;
  return (
    <div className='solana_wallets'>
      <div
        className='wallet'
        onClick={async () => {
          try {
            const result = await unisat.requestAccounts();
            handleAccountsChanged(result);
            setConnected(true);
            setAddress(result[0]);
            getBasicInfo();
          } catch (e) {
            console.error("error");
          }
        }}
      >
        <Image
          src={unisatLogo}
          alt='Unisat Wallet Logo'
          width={30}
          height={30}
        />
        <span>Unisat Wallet</span>
      </div>
      {/* {connected && (
        <div style={{ minWidth: 200 }}>
          <div
            onClick={async () => {
              await unisat.disconnect();
              setConnected(false);
              setAddress("");
            }}
          >
            Disconnect
          </div>
        </div>
      )} */}
    </div>
  );
};

export default UnisatWallet;
