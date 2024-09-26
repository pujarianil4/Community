import * as React from "react";

import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets } from "@cosmos-kit/keplr";

// Import this in your top-level route/layout
import "@interchain-ui/react/styles";

export const cosmosWallets = [wallets[0]];

export function CosmosProvider({ children }: any) {
  return (
    <ChainProvider
      chains={chains} // supported chains
      assetLists={assets} // supported asset lists
      wallets={cosmosWallets} // supported wallets
      // walletConnectOptions={} // required if `wallets` contains mobile wallets
    >
      {children}
    </ChainProvider>
  );
}
