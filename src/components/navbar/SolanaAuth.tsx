import React, { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey, Transaction } from "@solana/web3.js";
import { SolanaWalletButton } from "@/config/solanaWallet/SolanaProvider";

const SolanaAuthComponent = () => {
  const { publicKey, signMessage, connect, disconnect, connected } =
    useWallet();
  const [signature, setSignature] = useState<string | null>(null);

  // Function to sign a message
  const signUserMessage = useCallback(async () => {
    if (!publicKey) throw new Error("Not connected");

    try {
      const message = new TextEncoder().encode("Hello, Solana!");
      const signedMessage = await signMessage?.(message);
      console.log(
        "signedMessage",
        Buffer.from(signedMessage || "").toString("hex")
      );
      setSignature(Buffer.from(signedMessage || "").toString("hex"));
      disconnect();
    } catch (error) {
      console.error("Error signing the message:", error);
    }
  }, [publicKey, signMessage]);

  // Effect to sign the message when the wallet connects
  React.useEffect(() => {
    if (connected) {
      signUserMessage();
    }
  }, [connected, signUserMessage]);

  return (
    <div>
      <SolanaWalletButton />
    </div>
  );
};

export default SolanaAuthComponent;
