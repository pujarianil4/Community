// "use client";

import React from "react";
import PageWraper from "@/components/Wrapers/PageWraper";
// import { useParams } from "next/navigation";

interface Iprops {
  params: any;
}

export default async function PostPage({ params }: Iprops) {
  const { postId } = params;

  console.log("POST_ID", postId);
  return (
    <PageWraper hideRightPanel>
      <p>Hello</p>
    </PageWraper>
  );
}
