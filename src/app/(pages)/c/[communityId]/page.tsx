import CTabs from "@/components/common/Tabs";
import CommunityHead from "@/components/communityHead/CommunityHead";
import FeedList from "@/components/feedPost/feedList";
import PageWraper from "@/components/Wrapers/PageWraper";
import React from "react";

export default function CommuityPage() {
  return (
    <PageWraper hideRightPanel>
      <CommunityHead />
      <CTabs
        items={[
          { key: "1", label: "Posts", content: <FeedList method='allPosts' /> },
          { key: "2", label: "Proposals", content: "This is tab2" },
          { key: "3", label: "Voters", content: "This is tab3" },
        ]}
      />
    </PageWraper>
  );
}
