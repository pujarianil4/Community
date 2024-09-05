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
  getSession,
  getUserData,
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
import { handleDiscordLogin } from "../socialLinks/discordLogin";
import fetchDiscordData from "@/services/api/fetchDiscord";

const { Panel } = Collapse;

//tg types
interface TelegramLoginData {
  auth_date: number;
  first_name: string;
  hash: string;
  id: number;
  last_name?: string;
  username?: string;
}

interface Telegram {
  Login: {
    auth: (
      options: {
        bot_id: string | undefined;
        request_access?: boolean;
        lang?: string;
      },
      callback: (data: TelegramLoginData | false) => void
    ) => void;
  };
}

// Extend the global Window interface to include Telegram
declare global {
  interface Window {
    Telegram: Telegram;
  }
}

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

  //handle Tg Data
  const handleAuth = () => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?27";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.Telegram) {
        window.Telegram.Login.auth(
          { bot_id: botID, request_access: true },
          (data) => {
            if (!data) {
              console.error("Authorization failed");
              return;
            }
            console.log("Telegram data:", data);
            updateUser({ tid: String(data.id) })
              .then((res) => {
                refetch();
                NotificationMessage("success", "Telegram Profile linked.");
              })
              .catch((err) => {
                throw err;
              });
          }
        );
      }
    };
  };

  //remove Telegram
  const removeTelegram = () => {
    console.log("Removing Telegram profile link...");
    updateUser({ tid: null })
      .then((res) => {
        refetch();
        NotificationMessage("success", "Telegram Profile unlinked.");
      })
      .catch((err) => {
        console.error("Failed to unlink Telegram Profile:", err);
        NotificationMessage("error", "Failed to unlink Telegram Profile.");
      });
  };

  //remove Discord
  const removeDiscord = () => {
    console.log("Removing Discord profile link...");

    updateUser({ did: null })
      .then((res) => {
        refetch();
        console.log("user resopnse ", res);
        NotificationMessage("success", "Discord Profile unlinked.");
      })
      .catch((err) => {
        console.error("Failed to unlink Discord Profile:", err);
        NotificationMessage("error", "Failed to unlink Discord Profile.");
      });
  };

  return (
    <>
      <div className='general_container'>
        <div>
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
                        {userData?.tid ? `@${userData.tid}` : "Telegram"}
                      </span>
                    </div>
                    <div>
                      <span>
                        {userData?.tid ? (
                          <span onClick={removeTelegram}>
                            <DeleteIcon />
                          </span>
                        ) : (
                          <span onClick={handleAuth}>
                            {" "}
                            <AddIcon
                              fill='#ffffff'
                              width={14}
                              height={14}
                            />{" "}
                          </span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                <div className='addresses'>
                  <div>
                    <div>
                      <DiscordIcon width={23} height={28} />
                      <span>
                        {userData?.did ? `@${userData.did}` : "Discord"}
                      </span>
                    </div>
                    <div>
                      <span>
                        {userData?.did ? (
                          <span onClick={removeDiscord}>
                            <DeleteIcon />
                          </span>
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
                      <span className=''>
                        {userData?.tid ? `@${user.username}` : "X"}
                      </span>
                    </div>
                    <div>
                      <span>
                        {userData?.tid ? (
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
                  <div key={session.uid} className='addresses'>
                    <div>
                      <div>
                        <MobileIcon />
                        <span className=''>{session.ip}</span>
                      </div>
                      <div>
                        <span>
                          <DeleteIcon />
                        </span>
                      </div>
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
