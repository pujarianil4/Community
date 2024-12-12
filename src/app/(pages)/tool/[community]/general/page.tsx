"use client";
import { CreateCommunity } from "@/components/sidebar/CreateCommunityModal";
import CommunityToolWraper from "@/components/Wrapers/communityToolWraper";
import React from "react";

export default function General() {
  return (
    <CommunityToolWraper hideRightPanel>
      <CreateCommunity onClose={() => {}} refetchCommunities={() => {}} />
    </CommunityToolWraper>
  );
}
