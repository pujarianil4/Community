import Settings from "@/components/settings/Settings";
import PageWraper from "@/components/Wrapers/PageWraper";
import React from "react";

export default function SeetingsPage() {
  return (
    <PageWraper hideRightPanel>
      <Settings />
    </PageWraper>
  );
}
