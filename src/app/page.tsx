"use strict";

import "../styles/index.scss";
import "../styles/antd.scss";

import PageWraper from "@/components/Wrapers/PageWraper";
import FeedListData from "./feedListData";

export default function Home() {
  return (
    <main>
      <PageWraper hideScroll>
        <FeedListData />
      </PageWraper>
    </main>
  );
}
