"use client";
import Rules from "@/components/communityTools/rules/Rules";
import CommunityToolWraper from "@/components/Wrapers/communityToolWraper";
import React from "react";

export default function General() {
  return (
    <CommunityToolWraper hideRightPanel>
      <Rules />
    </CommunityToolWraper>
  );
}
