"use client";
import "./index.scss";

import React from "react";

import { DropdownLowIcon } from "@/assets/icons";

import { Collapse } from "antd";

//Auth Import
import Discord from "@/components/common/auth/DiscordAuth";
import TwitterConnect from "@/components/common/auth/TwitterAuth";
import TelegramConnect from "@/components/common/auth/AuthTelegram";

// Import Session Data
import Session from "./Session";
//
import LinkAddress from "./LinkedAddress";
import Deligate from "./Deligate";
import Deligator from "./Deligator";

const { Panel } = Collapse;

export default function General() {
  return (
    <>
      <div className='general_container'>
        <Collapse defaultActiveKey={["1"]} style={{ marginTop: "16px" }}>
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

        <LinkAddress />
        {/* Session Accordion */}
        <Session />
        {/* Governance */}
        {/* <Governance /> */}
        <Deligate />
        <Deligator />
      </div>
    </>
  );
}
