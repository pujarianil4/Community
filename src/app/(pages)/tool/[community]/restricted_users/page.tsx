import CTabs from "@/components/common/Tabs";
import Muted from "@/components/communityTools/restrictUsers/Muted";
import Banned from "@/components/communityTools/restrictUsers/Banned";
import CommunityToolWraper from "@/components/Wrapers/communityToolWraper";
import React from "react";

export default function PostandComments() {
  const tabs = [
    {
      key: "1",
      label: "Banned",
      content: <Banned />,
    },
    {
      key: "2",
      label: "Muted",
      content: <Muted />,
    },
  ];
  return (
    <CommunityToolWraper hideRightPanel>
      <h2>Restricted Users</h2>
      <CTabs items={tabs} />
    </CommunityToolWraper>
  );
}
