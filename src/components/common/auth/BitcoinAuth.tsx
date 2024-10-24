import React, { useRef } from "react";
import UnisatWallet from "@/config/bitcoin/UnisatWallet";
import XverseWallet from "@/config/bitcoin/XverseWallet";
export interface ISignupData {
  username: string;
  name: string;
}
interface IBitcoinAuthComponent {
  isSignUp: boolean;
  signUpData: ISignupData | null;
  setUserAuthData: (user: any) => void;
}

const BitcoinAuthComponent: React.FC<IBitcoinAuthComponent> = ({
  isSignUp,
  signUpData,
  setUserAuthData,
}) => {
  return (
    <div className='solana_wallets'>
      <UnisatWallet
        isSignUp={isSignUp}
        signUpData={signUpData}
        setUserAuthData={setUserAuthData}
      />
      <XverseWallet
        isSignUp={isSignUp}
        signUpData={signUpData}
        setUserAuthData={setUserAuthData}
      />
    </div>
  );
};

export default BitcoinAuthComponent;
