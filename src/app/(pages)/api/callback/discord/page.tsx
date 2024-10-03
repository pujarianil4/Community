"use client";
import React, { useEffect } from "react";
import fetchDiscordData from "@/services/api/fetchDiscord";
import { useRouter, useSearchParams } from "next/navigation";
import { updateUser } from "@/services/api/api";
import NotificationMessage from "@/components/common/Notification";
const discord = () => {
  const router = useRouter();
  const urlParams = useSearchParams();
  const code = urlParams.get("code");
  // Discord Data Load
  useEffect(() => {
    if (code) {
      fetchDiscordData(code)
        .then((user) => {
          updateUser({ discord: { id: user.id, username: user.username } })
            .then((res) => {
              NotificationMessage("success", "Discord Profile linked.");
            })
            .catch((err) => {
              NotificationMessage("error", err?.response?.data?.message);
              throw err;
            });

          console.log("User data:", user);
          router.push("/settings");
        })
        .catch((error) => {
          NotificationMessage("error", "Error fetching Discord data ");
          router.push("/settings");
          console.error("Error fetching Discord data:", error);
        });
    }
  }, [code, router]);

  return <div>discord</div>;
};

export default discord;
