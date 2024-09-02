import React from "react";
import {
  DeleteIcon,
  AddIcon,
  TelegramIcon,
  DiscordIcon,
  TwitterIcon,
} from "@/assets/icons";
import TelegramLogin from "@/components/common/auth/telegramAuth";
interface SocialConnectionProps {
  platform: string;
  user?: { username: string } | null;
  handleLogin: () => void;
  icon: React.ComponentType<{ width: number; height: number }>;
  botUsername?: string;
}

const SocialConnection: React.FC<SocialConnectionProps> = ({
  platform,
  user,
  handleLogin,
  icon: IconComponent,
  botUsername,
}) => {
  return (
    <div className='addresses'>
      <div>
        <div>
          <IconComponent width={23} height={28} />
          <span className='telegram-user-details'>
            {user ? `@${user.username}` : platform}
          </span>
        </div>
        <div>
          <span>
            {user ? (
              <DeleteIcon />
            ) : platform === "Telegram" ? (
              <TelegramLogin
                botUsername={botUsername || ""}
                onAuthCallback={handleLogin}
              />
            ) : (
              <span onClick={handleLogin}>
                <AddIcon fill='#ffffff' width={14} height={14} />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SocialConnection;
