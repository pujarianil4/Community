import React from "react";
import useAsync from "@/hooks/useAsync";
import { updateUser } from "@/services/api/api";
import NotificationMessage from "@/components/common/Notification";

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
  const removeSession = () => {
    updateUser({ did: null })
      .then(() => {
        refetch();
        NotificationMessage("success", "Sessin Removed Successfully");
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
        {data?.map((session: { ip: string; uid: string }) => (
          <div key={session.uid} className='s_m_bx'>
            <span>
              <MobileIcon />
            </span>
            <div className='u_bx'>
              <span className='u_txt'>{session.ip}</span>{" "}
              <span onClick={removeSession}>
                <DeleteIcon />
              </span>
            </div>
          </div>
        ))}
      </Panel>
    </Collapse>
  );
};

export default session;
