"use client";
import "./index.scss";
import React from "react";
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

export default function General() {
  const socialItems = [
    {
      key: "1",
      label: "Social Connections",
      children: (
        <>
          <TelegramConnect />
          <Discord />
          <TwitterConnect />
        </>
      ),
    },
  ];

  const LinkedAddress = [
    {
      key: "2",
      label: "Linked Address",
      children: (
        <>
          <LinkAddress />
        </>
      ),
    },
  ];

  const SessionItems = [
    {
      key: "3",
      label: "Active Session",
      children: (
        <>
          <Session />
        </>
      ),
    },
  ];

  const DeligateItems = [
    {
      key: "4",
      label: "Deligate",
      children: (
        <>
          <Deligate />
        </>
      ),
    },
  ];
  return (
    <>
      <div className='general_container'>
        <Collapse
          items={socialItems}
          defaultActiveKey={["1"]}
          accordion
          expandIconPosition='end'
          className='accordion_cls'
        />

        {/* Link Your Wallet Accordion */}
        <Collapse
          items={LinkedAddress}
          accordion
          expandIconPosition='end'
          className='accordion_cls'
        />

        {/* Session Accordion */}

        <Collapse
          items={SessionItems}
          accordion
          expandIconPosition='end'
          className='accordion_cls'
        />
        {/* Governance */}
        {/* <Governance /> */}
        <Collapse
          items={DeligateItems}
          accordion
          expandIconPosition='end'
          className='accordion_cls'
        />
        {/* <Deligator /> */}
      </div>
    </>
  );
}
