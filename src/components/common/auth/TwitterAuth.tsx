import React from "react";
import useAsync from "@/hooks/useAsync";
import { getUserData } from "@/services/api/api";
import { updateUser } from "@/services/api/api";
import NotificationMessage from "@/components/common/Notification";
import { AddIcon, TwitterIcon, DeleteIcon } from "@/assets/icons";
import { getCurrentDomain } from "@/utils/helpers";
async function handleTwitterLogin() {
  const currentDomain = getCurrentDomain();
  const rootUrl = "https://twitter.com/i/oauth2/authorize";
  const clientId = process.env.NEXT_PUBLIC_TWITTER_ID as string;
  const redirectUri = `${currentDomain}/api/twitter`;
  const state = "state";
  const codeChallenge = process.env.NEXT_PUBLIC_X_CODEVERIFIER as string;

  const options = {
    response_type: "code",
    client_id: clientId,
    redirect_uri: redirectUri,
    state: state,
    code_challenge: codeChallenge,
    code_challenge_method: "plain",
    scope: ["tweet.read", "users.read", "offline.access"].join(" "),
  };

  const qs = new URLSearchParams(options).toString();
  const authUrl = `${rootUrl}?${qs}`;
  window.location.href = authUrl;
}

const twitterAuth = () => {
  const {
    isLoading: userDataLoading,
    data: userData,
    refetch,
  } = useAsync(getUserData);
  console.log("userdata", userData);

  const handleRemove = () => {
    updateUser({ xid: null })
      .then(() => {
        refetch();
        NotificationMessage("success", "X (Twitter) Profile unlinked.");
      })
      .catch(() => {
        NotificationMessage("error", "Failed to unlink X (Twitter) Profile.");
      });
  };

  return (
    <div className='social-connections'>
      <div className='s_m_bx'>
        <TwitterIcon />
        {userData?.xid ? (
          <div className='u_bx'>
            <span className='u_txt'>@{userData?.xid}</span>
            <span onClick={handleRemove}>
              <DeleteIcon />
            </span>
          </div>
        ) : (
          <div className='u_bx'>
            <span className='u_txt'>X</span>
            <span onClick={handleTwitterLogin}>
              <AddIcon />
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default twitterAuth;
