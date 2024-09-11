import PageWraper from "@/components/Wrapers/PageWraper";
import React from "react";
import CommunitiesList from "./CommunitiesList";

export default function Communities() {
  return (
    <PageWraper hideRightPanel>
      <CommunitiesList />
    </PageWraper>
  );
}
