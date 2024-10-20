"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/config/wagmi";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { SolanaProvider } from "@/config/solanaWallet/SolanaProvider";
import { CosmosProvider } from "@/config/cosmos/cosmos";
import StoreProvider from "@/contexts/storeprovider";
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize='compact'>
          <SolanaProvider>
            <CosmosProvider>
              <StoreProvider>
                <AntdRegistry>{children}</AntdRegistry>
              </StoreProvider>
            </CosmosProvider>
          </SolanaProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
