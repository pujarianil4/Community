import CTabs from "@/components/common/Tabs";
import TComment from "@/components/communityTools/postandcomments/TComment";
import TPost from "@/components/communityTools/postandcomments/TPost";
import CommunityToolWraper from "@/components/Wrapers/communityToolWraper";
import React from "react";

export default function PostandComments() {
  const tabs = [
    {
      key: "1",
      label: "Post",
      content: <TPost />,
    },
    {
      key: "2",
      label: "Comments",
      content: <TComment />,
    },
  ];
  return (
    <CommunityToolWraper hideRightPanel>
      <CTabs items={tabs} />
    </CommunityToolWraper>
  );
}
