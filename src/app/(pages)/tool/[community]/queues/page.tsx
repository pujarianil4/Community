import CTabs from "@/components/common/Tabs";
import CommunityToolWraper from "@/components/Wrapers/communityToolWraper";
import React from "react";
import Queues from "@/components/communityTools/queues/queues";

export default function Queue() {
  const tabs = [
    {
      key: "1",
      label: "Needs Approval",
      content: <Queues />,
    },
    {
      key: "2",
      label: "Edited",
      content: <Queues />,
    },
    {
      key: "3",
      label: "Reported",
      content: <Queues />,
    },
  ];
  return (
    <CommunityToolWraper hideRightPanel>
      <CTabs items={tabs} />
    </CommunityToolWraper>
  );
}
