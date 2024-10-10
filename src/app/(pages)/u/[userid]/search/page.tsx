import React from "react";
import PageWraper from "@/components/Wrapers/PageWraper";
import SearchPageComponent from "@/components/searchPage";
interface IProps {
  params: any;
}
export default function CommunitySearchPage({ params }: IProps) {
  return (
    <PageWraper>
      <SearchPageComponent isComment={false} params={params} />
    </PageWraper>
  );
}
