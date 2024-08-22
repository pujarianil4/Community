"use client";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl } from "@solana/web3.js";
import dynamic from "next/dynamic";
import { WalletError } from "@solana/wallet-adapter-base";
import {
  AnchorWallet,
  useConnection,
  useWallet,
  ConnectionProvider,
  WalletProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  UnsafeBurnerWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { ReactNode, useCallback, useMemo } from "react";

require("@solana/wallet-adapter-react-ui/styles.css");

export const SolanaWalletButton = dynamic(
  async () =>
    (await import("@solana/wallet-adapter-react-ui")).WalletMultiButton,
  { ssr: false }
);

export const SolanaWallets = [
  new PhantomWalletAdapter(),
  new SolflareWalletAdapter(),
];
export function SolanaProvider({ children }: { children: ReactNode }) {
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const onError = useCallback((error: WalletError) => {
    console.error(error);
  }, []);

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider
        wallets={SolanaWallets}
        onError={onError}
        autoConnect={true}
      >
        <WalletModalProvider>{children}</WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}

// export function useAnchorProvider() {
//   const { connection } = useConnection();
//   const wallet = useWallet();

//   return new AnchorProvider(connection, wallet as AnchorWallet, {
//     commitment: "confirmed",
//   });
// }
