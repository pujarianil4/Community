import PageWraper from "@/components/Wrapers/PageWraper";
import UserHead from "@/components/userHead/UserHead";
import React from "react";
import CTabs from "@/components/common/Tabs";
import FeedList from "@/components/feedPost/feedList";
import Followers from "@/components/userHead/followers/Followers";

export default function UserPage() {
  return (
    <PageWraper>
      <UserHead />
    </PageWraper>
  );
}
