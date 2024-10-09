import React from "react";
import useAsync from "@/hooks/useAsync";
import NotificationMessage from "@/components/common/Notification";
import { getClientSideCookie } from "@/utils/helpers";
import { DeleteIcon, DesktopIcon, MobileIcon } from "@/assets/icons";

import { getSession, removeSession } from "@/services/api/api";

const session = () => {
  const { isLoading, refetch, data } = useAsync(getSession);
  const cookiesData: any = getClientSideCookie("authToken");

  const handleRemoveSession = (id: string) => {
    removeSession(id)
      .then(() => {
        refetch();
        NotificationMessage("success", "Session Removed Successfully");
      })
      .catch(() => {
        refetch();
        NotificationMessage("error", "Failed to unlink Session.");
      });
  };

  return (
    <>
      {data?.map((session: { ip: string; id: string }) => (
        <div key={session.id} className='s_m_bx'>
          <DesktopIcon />
          <div className='u_bx'>
            <span className='u_txt'>{session.ip}</span>{" "}
            {session.id !== cookiesData?.sid && (
              <span onClick={() => handleRemoveSession(session.id)}>
                <DeleteIcon />
              </span>
            )}
          </div>
        </div>
      ))}
    </>
  );
};

export default session;
