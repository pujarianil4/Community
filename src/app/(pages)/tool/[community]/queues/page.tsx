import CTabs from "@/components/common/Tabs";
import TComment from "@/components/communityTools/queues/TComment";
import TPost from "@/components/communityTools/queues/TPost";
import CommunityToolWraper from "@/components/Wrapers/communityToolWraper";
import React from "react";

export default function Queue() {
  const tabs = [
    {
      key: "1",
      label: "Needs Approval",
      content: <TPost />,
    },
    {
      key: "2",
      label: "Edited",
      content: <TComment />,
    },
  ];
  return (
    <CommunityToolWraper hideRightPanel>
      <CTabs items={tabs} />
    </CommunityToolWraper>
  );
}
