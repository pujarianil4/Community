import { getSignMessage } from "@/config/ethers";
import { sigMsg } from "@/utils/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useCallback, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";

export default function EvmAuthComponent() {
  const { isConnected } = useAccount();
  const { disconnect } = useDisconnect();
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
    <div>
      <button onClick={openConnectModal}>RainbowKit</button>
    </div>
  );
}
