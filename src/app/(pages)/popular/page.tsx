import PageWraper from "@/components/Wrapers/PageWraper";
import React from "react";
import PopularList from "./PopularList";

export default function Communities() {
  return (
    <PageWraper>
      <PopularList method='allPosts' id={null} sortby='up' order='DESC' />
    </PageWraper>
  );
}
