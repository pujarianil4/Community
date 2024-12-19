"use client";
import React from "react";
import CommunityToolWraper from "@/components/Wrapers/communityToolWraper";
import CommuniytGuide from "@/components/communityTools/guide";

export default function General() {
  return (
    <CommunityToolWraper hideRightPanel>
      <CommuniytGuide />
    </CommunityToolWraper>
  );
}
