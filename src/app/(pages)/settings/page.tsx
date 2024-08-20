"use client";
import PrivateRoute from "@/components/Wrapers/PrivateRoute";
import Settings from "@/components/settings/Settings";
import PageWraper from "@/components/Wrapers/PageWraper";
import React from "react";

function SettingsPage() {
  return (
    <PageWraper hideRightPanel>
      <Settings />
    </PageWraper>
  );
}

export default SettingsPage;
