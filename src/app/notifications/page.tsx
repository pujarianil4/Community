import PageWraper from "@/components/Wrapers/PageWraper";
import React from "react";
import NotificationList from "./notificationList";

export default function Communities() {
  return (
    <PageWraper hideRightPanel>
      <NotificationList />
    </PageWraper>
  );
}
