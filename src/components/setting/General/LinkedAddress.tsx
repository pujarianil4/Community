"use client";
import "./index.scss";
import { getSignMessage } from "@/config/ethers";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { getAddressesByUserId, removeAddress } from "@/services/api/userApi";
import { sigMsg } from "@/utils/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import NotificationMessage from "@/components/common/Notification";
import AuthModal from "@/components/common/auth/AuthModal";
import {
  AddIcon,
  DeleteIcon,
  DropdownLowIcon,
  EtherIcon,
} from "@/assets/icons";

import { Collapse } from "antd";

const { Panel } = Collapse;

const linkAddress = () => {
  const { openConnectModal } = useConnectModal();
  const CommonSelector = (state: RootState) => state?.common;
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [common, user]] = useRedux([
    CommonSelector,
    userNameSelector,
  ]);

  const { isLoading, data, refetch, callFunction } = useAsync(
    getAddressesByUserId,
    user.uid
  );

  const userAccount = useAccount();
  const { disconnect } = useDisconnect();
  const [messageHash, setMessageHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const hasCalledRef = useRef<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => {
    dispatch(actions.setWalletRoute("linkWallet"));
    setIsModalOpen(true);
    // openConnectModal && openConnectModal();
    // callFunction(getAddressesByUserId, user.uid);
  };

  const handleLinkAddress = async () => {
    try {
      // const sign = await getSignMessage(sigMsg);
      // setMessageHash(sign);
      // const response = await linkAddress({
      //   sig: sign,
      //   msg: sigMsg,
      // });
      callFunction(getAddressesByUserId, user.uid);
      setIsModalOpen(false);
      dispatch(actions.setWalletRoute("auth"));
      // setTimeout(() => {
      //   dispatch(actions.setWalletRoute("auth"));
      // }, 4000);
    } catch (error) {
      // setTimeout(() => {
      //   disconnect();
      //   console.log("disconnect");
      //   setMessageHash(undefined);
      //   hasCalledRef.current = false;
      // }, 4000);
    }
  };

  useEffect(() => {
    if (!data) {
      callFunction(getAddressesByUserId, user.uid);
    }
  }, [userAccount.isConnected, user]);

  const remove = async (address: string) => {
    removeAddress(address)
      .then(() => {
        refetch();
        NotificationMessage("success", "Address Removed Successfully");
      })
      .catch(() => {
        refetch();
        NotificationMessage("error", "Failed to unlink Address.");
      });
  };

  return (
    <div>
      <Collapse accordion style={{ marginTop: "16px" }}>
        <Panel
          header='Linked Address'
          key='1'
          extra={<DropdownLowIcon fill='#EBB82A' width={13} height={7} />}
        >
          <div>
            <div className='link_address'>
              <span className='telegram-user-details'>Link New Address</span>
              <span onClick={handleOpenModal}>
                <AddIcon fill='#ffffff' width={14} height={14} />
              </span>
            </div>
            {data?.map((wallet: { address: string; typ: string }) => (
              <div key={wallet.address} className='addresses'>
                <div>
                  <div>
                    <EtherIcon />
                    <span className='telegram-user-details'>
                      {wallet.address} ({wallet.typ})
                    </span>
                  </div>
                  <div>
                    <span onClick={() => remove(wallet.address)}>
                      <DeleteIcon />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Panel>
      </Collapse>
      <AuthModal
        visible={isModalOpen}
        setVisible={setIsModalOpen}
        callBack={handleLinkAddress}
      />
    </div>
  );
};

export default linkAddress;
