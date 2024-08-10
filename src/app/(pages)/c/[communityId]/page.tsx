import CTabs from "@/components/common/Tabs";
import CommunityHead from "@/components/communityHead/CommunityHead";
import FeedList from "@/components/feedPost/feedList";
import PageWraper from "@/components/Wrapers/PageWraper";
import React from "react";

export default function CommuityPage() {
  return (
    <PageWraper hideRightPanel>
      <CommunityHead />
    </PageWraper>
  );
}
