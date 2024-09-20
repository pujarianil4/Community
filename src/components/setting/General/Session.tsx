import React from "react";
import useAsync from "@/hooks/useAsync";
import NotificationMessage from "@/components/common/Notification";
import { getClientSideCookie } from "@/utils/helpers";
import {
  DeleteIcon,
  DesktopIcon,
  DropdownLowIcon,
  MobileIcon,
} from "@/assets/icons";

import { Collapse } from "antd";
const { Panel } = Collapse;
import { getSession, removeSession } from "@/services/api/api";

const session = () => {
  const { isLoading, refetch, data } = useAsync(getSession);
  console.log("session", data);
  const cookiesData: any = getClientSideCookie("authToken");
  console.log("cookiesData", cookiesData);

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
    <Collapse accordion style={{ marginTop: "16px" }}>
      <Panel
        header='Active Session'
        key='1'
        extra={<DropdownLowIcon fill='#EBB82A' width={13} height={7} />}
      >
        {data?.map((session: { ip: string; id: string }) => (
          <div key={session.id} className='s_m_bx'>
            <DesktopIcon />
            <div className='u_bx'>
              <span className='u_txt'>{session.ip}</span>{" "}
              {session.id !== cookiesData.sid && (
                <span onClick={() => handleRemoveSession(session.id)}>
                  <DeleteIcon />
                </span>
              )}
            </div>
          </div>
        ))}
      </Panel>
    </Collapse>
  );
};

export default session;
