"use strict";

import "../styles/index.scss";
import "../styles/antd.scss";

import PageWraper from "@/components/Wrapers/PageWraper";
import UserHead from "@/components/userHead/UserHead";
import FeedPosts from "@/components/feedPosts";
import FeedList from "@/components/feedPost/feedList";

export default function Home() {
  return (
    <main>
      <PageWraper>
        <FeedList method='allPosts' id={null} />
      </PageWraper>
    </main>
  );
}
