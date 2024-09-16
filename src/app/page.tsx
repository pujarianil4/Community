"use strict";

import "../styles/index.scss";
import "../styles/antd.scss";

import PageWraper from "@/components/Wrapers/PageWraper";
import FeedList from "@/components/feedPost/feedList";

export default function Home() {
  return (
    <main>
      <PageWraper>
        <FeedList method='allPosts' id={null} sortby='time' order='DESC' />
      </PageWraper>
    </main>
  );
}
