"use client";

import * as React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { wagmiConfig } from "@/config/wagmi";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import { Provider } from "react-redux";
import { store } from "@/contexts/store";
import { SolanaProvider } from "@/config/solanaWallet/SolanaProvider";
import { CosmosProvider } from "@/config/cosmos/CosmosProvider";
const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider modalSize='compact'>
          <SolanaProvider>
            <CosmosProvider>
              <AntdRegistry>
                <Provider store={store}>{children}</Provider>
              </AntdRegistry>
            </CosmosProvider>
          </SolanaProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
