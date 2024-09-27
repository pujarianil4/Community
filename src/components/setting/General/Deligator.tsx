"use client";
import React from "react";
import { Collapse } from "antd";
import { DropdownLowIcon } from "@/assets/icons";
import useAsync from "@/hooks/useAsync";
import { fetchDelegatesByUname } from "@/services/api/api";
import EmptyData from "@/components/common/Empty";
import { numberWithCommas } from "@/utils/helpers";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";

const { Panel } = Collapse;

export default function Deligator() {
  const userNameSelector = (state: RootState) => state?.user;
  const [{}, [user]] = useRedux([userNameSelector]);
  const payload = {
    username: user?.username,
    type: "dgte",
    page: 1,
    limit: 10,
  };
  const { isLoading, data } = useAsync(fetchDelegatesByUname, payload);

  // if (data?.length === 0) {
  //   return <EmptyData />;
  // }
  return (
    <Collapse accordion style={{ marginTop: "16px" }}>
      <Panel
        header='Deligator'
        key='1'
        extra={<DropdownLowIcon fill='#EBB82A' width={13} height={7} />}
      >
        {/* {data?.map((session: { ip: string; id: string }) => (
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
    ))} */}
        <>
          {isLoading ? (
            <p>Loading...</p>
          ) : data?.length > 0 ? (
            <>
              {data?.map((item: any) => (
                <div className='deligat_item' key={item.id}>
                  {/* Required User Details like img */}
                  <p>user: {item?.delegator?.username}</p>
                  <p>networth: {numberWithCommas(item?.delegator?.netWrth)}</p>
                  <p>
                    effective networth:
                    {numberWithCommas(item?.delegator?.effectiveNetWrth)}
                  </p>
                </div>
              ))}
            </>
          ) : (
            <EmptyData />
          )}
        </>
      </Panel>
    </Collapse>
  );
}
