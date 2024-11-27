"use client";

import { useEffect } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import { updateUser } from "@/services/api/userApi";
import NotificationMessage from "@/components/common/Notification";
export default function TwitterCallback() {
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const router = useRouter();
  useEffect(() => {
    if (code) {
      axios
        .post("/api/callback/twitter", { code })
        .then((response) => {
          console.log("x data", response.data.user);
          updateUser({
            x: {
              id: response.data.user.id,
              username: response.data.user.username,
            },
          })
            .then((res) => {
              NotificationMessage("success", "Twitter Profile linked.");
            })
            .catch((err) => {
              NotificationMessage("error", err?.message);
              throw err;
            });
          router.push("/settings");
        })
        .catch((error) => {
          NotificationMessage("Error", "Twitter Profile Not linked.");
          router.push("/settings");
          console.error("Error fetching user data:", error);
        })
        .finally(() => {});
    }
  }, [code]);

  return <div></div>;
}
