import PageWraper from "@/components/Wrapers/PageWraper";
import UserHead from "@/components/userHead/UserHead";
import React from "react";
import CTabs from "@/components/common/Tabs";
import FeedList from "@/components/feedPost/feedList";

export default function UserPage() {
  return (
    <PageWraper hideRightPanel>
      <UserHead />
      <CTabs
        items={[
          { key: "1", label: "Posts", content: <FeedList /> },
          { key: "2", label: "Proposals", content: "This is tab2" },
          { key: "3", label: "Voters", content: "This is tab3" },
        ]}
      />
    </PageWraper>
  );
}
