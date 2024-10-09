import { Modal } from "antd";
import dynamic from "next/dynamic";
import React, { useEffect, useState } from "react";
import CosmosAuthComponent from "./CosmosAuth";
import EvmAuthComponent from "./EvmAuth";
import SolanaAuthComponent from "./SolanaAuth";
import { Collapse } from "antd";
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

  const evmAuthItems = [
    {
      key: "1",
      label: "Ethereum Wallets",
      children: (
        <>
          <EvmAuthComponent
            isSignUp={false}
            signUpData={null}
            setUserAuthData={handleCallBack}
          />
        </>
      ),
    },
  ];

  const solanaAuthItems = [
    {
      key: "2",
      label: "Solana Wallets",
      children: (
        <>
          <SolanaAuthComponent
            isSignUp={false}
            signUpData={null}
            setUserAuthData={handleCallBack}
          />
        </>
      ),
    },
  ];
  const tronAuthItems = [
    {
      key: "3",
      label: "Tron Wallets",
      children: (
        <>
          <TronAuthComponent
            isSignUp={false}
            signUpData={null}
            setUserAuthData={handleCallBack}
          />
        </>
      ),
    },
  ];
  const cosmosAuthItems = [
    {
      key: "4",
      label: "Cosmos Wallets",
      children: (
        <>
          <CosmosAuthComponent
            isSignUp={false}
            signUpData={null}
            setUserAuthData={handleCallBack}
          />
        </>
      ),
    },
  ];

  return (
    <Modal open={visible} onCancel={handleCancel} footer={<></>}>
      <div className='wallet_modal'>
        <Collapse
          items={evmAuthItems}
          accordion
          expandIconPosition='end'
          className='accordion_bx'
        />

        <Collapse
          items={solanaAuthItems}
          accordion
          expandIconPosition='end'
          className='accordion_bx'
        />
        <Collapse
          items={tronAuthItems}
          accordion
          expandIconPosition='end'
          className='accordion_bx'
        />
        <Collapse
          items={cosmosAuthItems}
          accordion
          expandIconPosition='end'
          className='accordion_bx'
        />
      </div>
    </Modal>
  );
}
