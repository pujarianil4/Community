"use strict";

import "../styles/index.scss";
import "../styles/antd.scss";

import PageWraper from "@/components/Wrapers/PageWraper";
import UserHead from "@/components/userHead/UserHead";
import FeedPosts from "@/components/feedPosts";

export default function Home() {
  return (
    <main>
      <PageWraper hideRightPanel={true}>
        <FeedPosts />
        <UserHead />
      </PageWraper>
    </main>
  );
}
