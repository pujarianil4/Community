"use client";

import Setting from "@/components/setting/Settings";
import PageWraper from "@/components/Wrapers/PageWraper";
import React from "react";

function Settings() {
  return (
    <PageWraper hideRightPanel>
      <Setting />
    </PageWraper>
  );
}

export default Settings;
