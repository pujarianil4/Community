"use strict";

import "../styles/index.scss";
import "../styles/antd.scss";

import PageWraper from "@/components/Wrapers/PageWraper";
import FeedList from "@/components/feedPost/feedList";
import WalletsPage from "./walletsPage";

export default function Home() {
  return (
    <main>
      <PageWraper hideRightPanel>
        <WalletsPage />
        {/* <FeedList method='allPosts' id={null} sortby='time' order='DESC' /> */}
      </PageWraper>
    </main>
  );
}
