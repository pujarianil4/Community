"use strict";

import "../styles/index.scss";
import "../styles/antd.scss";

import PageWraper from "@/components/Wrapers/PageWraper";
import CreatePost from "@/components/createPost/CreatePost";
import UserHead from "@/components/userHead/UserHead";
import FeedPost from "@/components/feedPost/feedPost";

export default function Home() {
  return (
    <main>
      <PageWraper hideRightPanel={true}>
        <CreatePost />
        <FeedPost />
        <UserHead />
      </PageWraper>
    </main>
  );
}
