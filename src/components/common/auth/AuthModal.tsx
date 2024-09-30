import { Modal } from "antd";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import CosmosAuthComponent from "./CosmosAuth";
import EvmAuthComponent from "./EvmAuth";
import SolanaAuthComponent from "./SolanaAuth";

const TronAuthComponent = dynamic(() => import("./TronAuth"), {
  ssr: false,
});

interface IAuthModal {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  callBack?: (data: any) => void;
}

export default function AuthModal({
  visible,
  setVisible,
  callBack,
}: IAuthModal) {
  const handleCancel = () => {
    setVisible(false);
  };

  useEffect(() => {
    console.log("visible", visible);
  }, [visible]);

  const handleCallBack = (data: any) => {
    console.log("visible call", visible, data);
    callBack && callBack(data);
  };

  return (
    <Modal open={visible} onCancel={handleCancel} footer={<></>}>
      <div className='wallet_modal'>
        <EvmAuthComponent
          isSignUp={false}
          signUpData={null}
          setUserAuthData={handleCallBack}
        />
        <SolanaAuthComponent
          isSignUp={false}
          signUpData={null}
          setUserAuthData={handleCallBack}
        />
        <TronAuthComponent
          isSignUp={false}
          signUpData={null}
          setUserAuthData={handleCallBack}
        />
        <CosmosAuthComponent
          isSignUp={false}
          signUpData={null}
          setUserAuthData={handleCallBack}
        />
      </div>
    </Modal>
  );
}
