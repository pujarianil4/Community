"use client";

import React from "react";
import { CreateCommunity } from "@/components/sidebar/CreateCommunityModal";
import CommunityToolWraper from "@/components/Wrapers/communityToolWraper";
import { GeneralProfile } from "@/components/communityTools/general/General";
export default function General() {
  return (
    <CommunityToolWraper hideRightPanel>
      <GeneralProfile onClose={() => {}} refetchCommunities={() => {}} />
    </CommunityToolWraper>
  );
}
