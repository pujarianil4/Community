import React from "react";
import useAsync from "@/hooks/useAsync";
import { getUserData } from "@/services/api/api";
import { TelegramIcon, AddIcon, DeleteIcon } from "@/assets/icons";
import { updateUser } from "@/services/api/api";
import NotificationMessage from "@/components/common/Notification";

interface TelegramLoginData {
  auth_date: number;
  first_name: string;
  hash: string;
  id: number;
  last_name?: string;
  username?: string;
}

interface Telegram {
  Login: {
    auth: (
      options: {
        bot_id: string | undefined;
        request_access?: boolean;
        lang?: string;
      },
      callback: (data: TelegramLoginData | false) => void
    ) => void;
  };
}

// Extend the global Window interface to include Telegram
declare global {
  interface Window {
    Telegram: Telegram;
  }
}

const TelegramAuth = () => {
  const botID = process.env.NEXT_PUBLIC_TELEGRAM_BOT_ID;
  const {
    isLoading: userDataLoading,
    data: userData,
    refetch,
  } = useAsync(getUserData);

  const handleTelegramAuth = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "https://telegram.org/js/telegram-widget.js?27";
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.Telegram) {
          window.Telegram.Login.auth(
            { bot_id: botID, request_access: true },
            (data) => {
              if (!data) {
                console.error("Authorization failed");
                reject("Authorization failed");
                return;
              }

              if (
                typeof data.id === "number" &&
                typeof data.username === "string"
              ) {
                updateUser({
                  telegram: {
                    id: String(data.id),
                    username: data.username,
                  },
                })
                  .then(() => {
                    refetch();
                    NotificationMessage("success", "Telegram Profile linked.");
                  })
                  .catch((err) => {
                    console.error("Failed to link Telegram Profile:", err);
                    NotificationMessage(
                      "error",
                      "Failed to link Telegram Profile."
                    );
                  });
              } else {
                console.error("Invalid Telegram data received:", data);
                NotificationMessage("error", "Invalid Telegram data.");
                reject("Invalid Telegram data");
                return;
              }

              console.log("Telegram data:", data);
              resolve(data);
            }
          );
        } else {
          reject("Telegram object not found");
        }
      };

      script.onerror = () => {
        reject("Failed to load Telegram script");
      };
    });
  };

  const handleRemove = () => {
    updateUser({ telegram: null })
      .then(() => {
        refetch();
        NotificationMessage("success", "Telegram Profile unlinked.");
      })
      .catch(() => {
        NotificationMessage("error", "Failed to unlink Telegram Profile.");
      });
  };

  return (
    <div className='social-connections'>
      <div className='s_m_bx'>
        <TelegramIcon />
        {userData?.telegram?.id ? (
          <div className='u_bx'>
            <span className='u_txt'>@{userData?.telegram?.id}</span>
            <span onClick={handleRemove}>
              <DeleteIcon />
            </span>
          </div>
        ) : (
          <div className='u_bx'>
            <span className='u_txt'>Telegram</span>
            <span onClick={handleTelegramAuth}>
              <AddIcon />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TelegramAuth;
