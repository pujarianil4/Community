import React from "react";
import { AddIcon, DeleteIcon } from "@/assets/icons";
import { updateUser } from "@/services/api/api";
import NotificationMessage from "@/components/common/Notification";
import "./index.scss";
interface SocialAccountProps {
  platform: string; // Name of the social platform (e.g., "Telegram")
  icon: JSX.Element; // The icon for the social platform
  username?: string; // The username (if linked)
  fetchUserData: () => void; // Function to refetch user data after linking/unlinking
  authMethod?: () => Promise<any>; // Authentication method for linking the account (optional)
  userField: string; // Field name in the user profile to update (e.g., "tid")
}

const SocialAccount: React.FC<SocialAccountProps> = ({
  platform,
  icon,
  username,
  fetchUserData,
  authMethod,
  userField,
}) => {
  // Handle linking the social account (authentication)
  const handleAdd = () => {
    if (authMethod) {
      authMethod().then((data: { id: string }) => {
        if (data) {
          updateUser({ [userField]: String(data.id) })
            .then(() => {
              fetchUserData(); // Refetch user data to get updated info
              NotificationMessage("success", `${platform} Profile linked.`);
            })
            .catch((err) => {
              console.error(`Failed to link ${platform} Profile:`, err);
              NotificationMessage(
                "error",
                `Failed to link ${platform} Profile.`
              );
            });
        }
      });
    }
  };

  const handleRemove = () => {
    updateUser({ [userField]: null })
      .then(() => {
        fetchUserData();
        NotificationMessage("success", `${platform} Profile unlinked.`);
      })
      .catch((err) => {
        console.error(`Failed to unlink ${platform} Profile:`, err);
        NotificationMessage("error", `Failed to unlink ${platform} Profile.`);
      });
  };

  return (
    <div className='s_m_bx'>
      <span>{icon}</span>
      {username ? (
        <div className='u_bx'>
          <span className='u_txt'>@{username}</span> {/* Display the user ID */}
          <span onClick={handleRemove}>
            <DeleteIcon />
          </span>
        </div>
      ) : (
        <div className='u_bx'>
          <span className='u_txt'>{platform}</span>{" "}
          <span onClick={handleAdd}>
            <AddIcon />
          </span>
        </div>
      )}
    </div>
  );
};

export default SocialAccount;
