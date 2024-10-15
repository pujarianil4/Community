"use client";
import React from "react";
import useAsync from "@/hooks/useAsync";
import { fetchDelegatesByUname } from "@/services/api/userApi";
import EmptyData from "@/components/common/Empty";
import { numberWithCommas } from "@/utils/helpers";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";

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

  return (
    <main className='delegator_container'>
      <p className='d_head'>Deligator</p>
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
    </main>
  );
}
