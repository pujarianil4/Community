"use client";
import React from "react";
import useAsync from "@/hooks/useAsync";
import { fetchDelegatesByUname } from "@/services/api/userApi";
import EmptyData from "@/components/common/Empty";
import {
  formatNumber,
  getImageSource,
  numberWithCommas,
} from "@/utils/helpers";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import "../index.scss";
import Image from "next/image";

export default function Deligator() {
  const userNameSelector = (state: RootState) => state?.user.profile;
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
        <>
          {Array(3)
            .fill(() => 0)
            .map((_, index) => (
              <div key={index} className='skeleton delegate_item_loader'></div>
            ))}
        </>
      ) : data?.length > 0 ? (
        <section
          className={`delegation_list ${
            data?.length > 4 ? "right_padding" : ""
          }`}
        >
          {data?.map((item: any) => (
            <div className='delegate_item' key={item.id}>
              <div>
                <Image
                  src={getImageSource(item?.delegator?.img?.pro, "u")}
                  alt={item?.delegator?.username}
                  loading='lazy'
                  width={32}
                  height={32}
                />
                <p>{item?.delegator?.username}</p>
              </div>
              {/* <p></p> */}
              <p>{`value: ${formatNumber(item?.value)} ${item?.tkn}`}</p>
            </div>
          ))}
        </section>
      ) : (
        <EmptyData />
      )}
    </main>
  );
}
