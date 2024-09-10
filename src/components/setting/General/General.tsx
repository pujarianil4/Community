"use client";
import "./index.scss";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { getSignMessage } from "@/config/ethers";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import {
  getAddressesByUserId,
  linkAddress,
  updateUser,
  getSession,
  getUserData,
} from "@/services/api/api";
import { sigMsg } from "@/utils/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import CButton from "@/components/common/Button";
import { TelegramAuthData } from "@/utils/types/types";
import NotificationMessage from "@/components/common/Notification";
import AuthModal from "@/components/common/auth/AuthModal";
import {
  AddIcon,
  DeleteIcon,
  DesktopIcon,
  DiscordIcon,
  DropdownLowIcon,
  EtherIcon,
  MobileIcon,
  SolanaIcon,
  TelegramIcon,
  TwitterIcon,
} from "@/assets/icons";

import { Collapse, Button } from "antd";
import {
  WalletOutlined,
  UserOutlined,
  LinkOutlined,
  DeleteFilled,
} from "@ant-design/icons";

//Auth Import
import Discord from "@/components/common/auth/DiscordAuth";
import TwitterConnect from "@/components/common/auth/TwitterAuth";
import TelegramConnect from "@/components/common/auth/TelegramAuth";

const { Panel } = Collapse;

export default function General() {
  const { openConnectModal } = useConnectModal();
  const CommonSelector = (state: RootState) => state?.common;
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [common, user]] = useRedux([
    CommonSelector,
    userNameSelector,
  ]);

  const { isLoading, data, callFunction } = useAsync(
    getAddressesByUserId,
    user.uid
  );
  const botID = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID;
  const { isLoading: sessionLoading, data: sessionData } = useAsync(getSession);
  const {
    isLoading: userDataLoading,
    data: userData,
    refetch,
  } = useAsync(getUserData);
  console.log("userdata", userData);
  const userAccount = useAccount();
  const { disconnect } = useDisconnect();
  const [messageHash, setMessageHash] = useState<`0x${string}` | undefined>(
    undefined
  );
  const hasCalledRef = useRef<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  //twitter

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
  const removeSession = () => {
    // updateUser({ tid: null })
    //   .then(() => {
    //     refetch();
    //     NotificationMessage("success", "Telegram Profile unlinked.");
    //   })
    //   .catch(() => {
    //     NotificationMessage("error", "Failed to unlink Telegram Profile.");
    //   });
  };

  return (
    <>
      <div className='general_container'>
        <div>
          <div>
            <Collapse accordion style={{ marginTop: "16px" }}>
              <Panel
                header='Social Connections'
                key='1'
                extra={<DropdownLowIcon fill='#EBB82A' width={13} height={7} />}
              >
                <TelegramConnect />
                <Discord />
                <TwitterConnect />
              </Panel>
            </Collapse>

            {/* Link Your Wallet Accordion */}
            <Collapse accordion style={{ marginTop: "16px" }}>
              <Panel
                header='Linked Address'
                key='1'
                extra={<DropdownLowIcon fill='#EBB82A' width={13} height={7} />}
              >
                <div>
                  <div className='link_address'>
                    <span className='telegram-user-details'>
                      Link New Address
                    </span>
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
                          <span>
                            <DeleteIcon />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </Collapse>

            {/* Session Accordion */}
            <Collapse accordion style={{ marginTop: "16px" }}>
              <Panel
                header='Active Session'
                key='1'
                extra={<DropdownLowIcon fill='#EBB82A' width={13} height={7} />}
              >
                {sessionData?.map((session: { ip: string; uid: string }) => (
                  <div key={session.uid} className='s_m_bx'>
                    <span>
                      <MobileIcon />
                    </span>
                    <div className='u_bx'>
                      <span className='u_txt'>{session.ip}</span>{" "}
                      <span onClick={removeSession}>
                        <DeleteIcon />
                      </span>
                    </div>
                  </div>
                ))}
              </Panel>
            </Collapse>
          </div>
        </div>
      </div>
      <AuthModal
        visible={isModalOpen}
        setVisible={setIsModalOpen}
        callBack={handleLinkAddress}
      />
    </>
  );
}
