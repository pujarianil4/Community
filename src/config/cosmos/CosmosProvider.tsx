import * as React from "react";

import { ChainProvider } from "@cosmos-kit/react";
import { chains, assets } from "chain-registry";
import { wallets } from "@cosmos-kit/keplr";

// Import this in your top-level route/layout
import "@interchain-ui/react/styles";

export function CosmosProvider({ children }: any) {
  console.log("cosmos chains", wallets);

  return (
    <ChainProvider
      chains={chains} // supported chains
      assetLists={assets} // supported asset lists
      wallets={wallets} // supported wallets
      // walletConnectOptions={...} // required if `wallets` contains mobile wallets
    >
      {children}
    </ChainProvider>
  );
}
