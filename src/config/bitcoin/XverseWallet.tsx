import React, { useState, useEffect } from "react";
import Image from "next/image";
import xverseLogo from "@/assets/walletIcon/xverse.svg"; // Fallback icon
import NotificationMessage from "@/components/common/Notification";
import { sigMsg } from "@/utils/constants";
import { RootState } from "@/contexts/store";
import { linkAddress } from "@/services/api/authapi";
import { useSelector } from "react-redux";
import { handleLogIn, handleSignup } from "@/services/api/authapi";
import Wallet, {
  AddressPurpose,
  BitcoinNetworkType,
  getProviders,
  getAddress,
  signMessage,
} from "sats-connect";
import { useLocalStorage } from "./useLocalstorage";
import { setClientSideCookie } from "@/utils/helpers";
export interface ISignupData {
  username: string;
  name: string;
}

interface XverseWalletProps {
  isSignUp: boolean;
  signUpData: ISignupData | null;
  setUserAuthData: (user: any) => void;
}

const XverseWallet: React.FC<XverseWalletProps> = ({
  isSignUp,
  signUpData,
  setUserAuthData,
}) => {
  const walletRoute = useSelector(
    (state: RootState) => state.common.walletRoute
  );

  const [address, setAddress] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [isXverseInstalled, setIsXverseInstalled] = useState<boolean>(false);
  const [network] = useLocalStorage<BitcoinNetworkType>(
    "network",
    BitcoinNetworkType.Mainnet
  );

  const [providerDetails, setProviderDetails] = useState<any>(null);

  // Check if Xverse Wallet is installed
  useEffect(() => {
    const providers = getProviders();
    const xverseProvider = providers.find(
      (provider) => provider.name === "Xverse Wallet"
    );

    if (xverseProvider) {
      setIsXverseInstalled(true);
      setProviderDetails(xverseProvider);
    } else {
      setIsXverseInstalled(false);
    }
  }, []);

  // Connect to Xverse Wallet
  const onConnect = async () => {
    if (!isXverseInstalled) {
      return NotificationMessage("error", "Xverse Wallet is not installed.");
    }

    try {
      await getAddress({
        payload: {
          purposes: [AddressPurpose.Payment],
          message: "Community",
          network: { type: network },
        },
        onFinish: (response: any) => {
          console.log("response", response);
          const paymentAddressItem = response.addresses.find(
            (addr: any) => addr.purpose === AddressPurpose.Payment
          );
          if (paymentAddressItem) {
            setConnected(true);
            setAddress(paymentAddressItem.address);
            setPublicKey(paymentAddressItem.publicKey);
          }
        },
        onCancel: () =>
          NotificationMessage("error", "User canceled the transaction"),
      });
    } catch (error) {
      NotificationMessage("error", "Error connecting to wallet");
      console.error("Error connecting to wallet:", error);
    }
  };

  // Sign message after connecting
  const onSignMessage = async () => {
    if (!address) {
      return NotificationMessage("error", "No account connected.");
    }

    try {
      const messageToSign = sigMsg;
      await signMessage({
        payload: {
          address,
          message: messageToSign,
          network: { type: network },
        },
        onFinish: async (response: any) => {
          const signature = response;
          console.log("SIGNATURE", publicKey, messageToSign, signature);
          // Handle wallet route logic
          if (walletRoute === "auth") {
            if (isSignUp && signUpData) {
              const signUpResponse = await handleSignup(
                signUpData.username,
                signUpData?.name ? signUpData?.name : null,
                signature,
                messageToSign,
                "Cosmos",
                address
              );
              setUserAuthData({ user: signUpResponse });
            } else {
              const loginResponse = await handleLogIn({
                sig: signature,
                msg: messageToSign,
                typ: "Cosmos",
                pubKey: address,
              });
              setUserAuthData({ user: loginResponse });
              setClientSideCookie("sid", response?.ip);
            }
          } else if (walletRoute === "linkWallet") {
            const linkResponse = await linkAddress({
              sig: signature,
              msg: messageToSign,
              typ: "Cosmos",
              pubKey: address,
            });
            setUserAuthData(linkResponse);
            setConnected(false);
            await onDisconnect();
          }
        },
        onCancel: () =>
          NotificationMessage("error", "Signing request canceled"),
      });
    } catch (error) {
      await onDisconnect();
      NotificationMessage("error", "Error signing message");
      console.error("Error signing message:", error);
    }
  };

  // Disconnect wallet
  const onDisconnect = async () => {
    try {
      await Wallet.disconnect();
      setConnected(false);
      setAddress(null);
      console.log("Disconnected from wallet.");
    } catch (error) {
      console.error("Error disconnecting from wallet:", error);
    }
  };

  // Trigger sign message when connected
  useEffect(() => {
    if (connected) {
      onSignMessage();
    }
  }, [connected]);

  if (!isXverseInstalled) {
    return (
      <div className='solana_wallets'>
        <div className='wallet'>
          <Image
            src={xverseLogo}
            alt='Xverse Wallet Logo'
            width={30}
            height={30}
          />
          <a
            href='https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg'
            target='_blank'
            rel='noopener noreferrer'
            className='btn'
          >
            Install Xverse Wallet
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className='solana_wallets'>
      <div className='wallet' onClick={onConnect}>
        <Image
          src={providerDetails?.icon || xverseLogo}
          alt='Xverse Wallet Logo'
          width={30}
          height={30}
        />
        <span>Xverse Wallet</span>
      </div>
    </div>
  );
};

export default XverseWallet;
