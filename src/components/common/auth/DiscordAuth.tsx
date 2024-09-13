import React from "react";
import useAsync from "@/hooks/useAsync";
import { getUserData } from "@/services/api/api";
import { DiscordIcon, AddIcon, DeleteIcon } from "@/assets/icons";
import { updateUser } from "@/services/api/api";
import NotificationMessage from "@/components/common/Notification";

async function handleDiscordLogin() {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_ID ?? "default_client_id";
  const redirectUri = encodeURIComponent(
    process.env.NEXT_PUBLIC_REDIRECT_URL ??
      "http://localhost:3000/api/callback/discord"
  );
  const oauthUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=identify`;

  window.location.href = oauthUrl;
}

const discordAuth = () => {
  const {
    isLoading: userDataLoading,
    data: userData,
    refetch,
  } = useAsync(getUserData);
  console.log("userdata", userData);

  const handleRemove = () => {
    updateUser({ did: null })
      .then(() => {
        refetch();
        NotificationMessage("success", "Discord Profile unlinked.");
      })
      .catch(() => {
        refetch();
        NotificationMessage("error", "Failed to unlink Discord Profile.");
      });
  };

  return (
    <div className='social-connections'>
      <div className='s_m_bx'>
        <DiscordIcon />
        {userData?.did ? (
          <div className='u_bx'>
            <span className='u_txt'>@{userData?.did}</span>
            <span onClick={handleRemove}>
              <DeleteIcon />
            </span>
          </div>
        ) : (
          <div className='u_bx'>
            <span className='u_txt'>Discord</span>
            <span onClick={handleDiscordLogin}>
              <AddIcon />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default discordAuth;
