"use client";
import "./index.scss";
import { getSignMessage } from "@/config/ethers";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import {
  getAddressesByUserId,
  linkAddress,
  updateUser,
} from "@/services/api/api";
import { sigMsg } from "@/utils/constants";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import React, { useEffect, useRef, useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import TelegramLogin from "@/components/common/auth/telegramAuth";
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

//discord
import { handleDiscordLogin } from "@/components/navbar/discordLogin";
import fetchDiscordData from "@/services/api/fetchDiscord";

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

  const handleTelegramAuth = async (user: TelegramAuthData) => {
    try {
      console.log("User authenticated:", user);
      updateUser({ tid: String(user.id) })
        .then((res) => {
          NotificationMessage("success", "Telegram Profile linked.");
        })
        .catch((err) => {
          throw err;
        });
    } catch (error) {
      console.error("Error authenticating user:", error);
    }
  };

  // Discord Data Load
  useEffect(() => {
    const fetchData = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get("code");

      if (code) {
        try {
          console.log("call navbar");
          const discordData = await fetchDiscordData(code);
          console.log("discord Data", discordData);
        } catch (error) {
          console.error("Failed to fetch Discord user data:", error);
        }
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div className='general_container'>
        <div>
          <h2>Link your Account</h2>
          <div>
            {/* Social Connections Accordion */}
            <Collapse accordion>
              <Panel
                header='Social Connections'
                key='1'
                extra={<DropdownLowIcon fill='#EBB82A' width={13} height={7} />}
              >
                <div className='addresses'>
                  <div>
                    <div>
                      <TelegramIcon width={23} height={28} />
                      <span className='telegram-user-details'>
                        {user ? `@${user.username}` : "Telegram"}
                      </span>
                    </div>
                    <div>
                      <span>
                        {user ? (
                          <DeleteIcon />
                        ) : (
                          // <AddIcon fill='#ffffff' width={14} height={14} />
                          <TelegramLogin
                            botUsername={"communitysetupbot"}
                            onAuthCallback={handleTelegramAuth}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='addresses'>
                  <div>
                    <div>
                      <DiscordIcon width={23} height={28} />
                      <span className='telegram-user-details'>
                        {user ? `@${user.username}` : "Discord"}
                      </span>
                    </div>
                    <div>
                      <span>
                        {user ? (
                          <DeleteIcon />
                        ) : (
                          <span onClick={handleDiscordLogin}>
                            <AddIcon fill='#ffffff' width={14} height={14} />
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='addresses'>
                  <div>
                    <div>
                      <TwitterIcon width={23} height={28} />
                      <span className='telegram-user-details'>
                        {!user ? `@${user.username}` : "X"}
                      </span>
                    </div>
                    <div>
                      <span>
                        {!user ? (
                          <DeleteIcon />
                        ) : (
                          <span>
                            <AddIcon fill='#ffffff' width={14} height={14} />
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </Panel>
            </Collapse>

            {/* Link Your Wallet Accordion */}
            <Collapse accordion style={{ marginTop: "16px" }}>
              <Panel
                header='Link Address'
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
                    <div className='addresses'>
                      <div>
                        <div>
                          <EtherIcon />
                          <span
                            key={wallet.address}
                            className='telegram-user-details'
                          >
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
                <div className='addresses'>
                  <div>
                    <div>
                      <DesktopIcon />
                      <span className='telegram-user-details'>
                        192.168.123.132
                      </span>
                    </div>
                    <div>
                      <span>
                        <DeleteIcon />
                      </span>
                    </div>
                  </div>
                </div>
                <div className='addresses'>
                  <div>
                    <div>
                      <MobileIcon />
                      <span className='telegram-user-details'>
                        192.168.123.132
                      </span>
                    </div>
                    <div>
                      <span>
                        <DeleteIcon />
                      </span>
                    </div>
                  </div>
                </div>
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
