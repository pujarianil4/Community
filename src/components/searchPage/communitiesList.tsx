/* eslint-disable react-hooks/exhaustive-deps */
// "use client";
// import React, { useState } from "react";
// // import "./index.scss";
// import useAsync from "@/hooks/useAsync";
// import {
//   fetchCommunities,
//   fetchSearchByCommunityData,
// } from "@/services/api/api";
// import CardList from "@/components/cardList";
// import { ICommunity } from "@/utils/types/types";
// import { useSearchParams } from "next/navigation";

// interface IProps {
//   communitiesData?: ICommunity[];
// }
// export default function Communities({ communitiesData }: IProps) {
//   const searchParams = useSearchParams();
//   const searchQuery = searchParams.get("q");
//   const [page, setPage] = useState(1);
//   const limit = 10;

//   const payload = {
//     search: searchQuery,
//     page,
//     limit,
//   };
//   const { isLoading, data, refetch } = useAsync(
//     fetchSearchByCommunityData,
//     payload
//   );
//   // const { isLoading, data, refetch } = useAsync(fetchCommunities, "followers");

//   return (
//     <CardList
//       cardListData={data?.communities as ICommunity[]}
//       type='c'
//       isLoading={isLoading}
//     />
//   );
// }

"use client";
import React, { useEffect, useState } from "react";
import useAsync from "@/hooks/useAsync";
import { fetchSearchByCommunityData } from "@/services/api/searchApi";
import { ICommunity } from "@/utils/types/types";
import { useSearchParams } from "next/navigation";
import VirtualList from "@/components/common/virtualList";
import NotificationMessage from "../common/Notification";
import EmptyData from "../common/Empty";
import CardListLoader from "../cardList/cardListLoader";
import Card from "../cardList/card";

export default function Communities() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [page, setPage] = useState(1);
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const limit = 10;

  const payload = {
    search: searchQuery,
    page,
    limit,
  };

  const { error, isLoading, data, refetch } = useAsync(
    fetchSearchByCommunityData,
    payload
  );

  useEffect(() => {
    if (searchQuery) {
      setCommunities([]);
      refetch();
      setPage(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (data?.communities && data?.communities?.length > 0) {
      if (page === 1) {
        setCommunities(data?.communities);
      } else {
        setCommunities((prevData) => [...prevData, ...data?.communities]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  useEffect(() => {
    if (error) NotificationMessage("error", error?.message);
  }, [error]);

  if (data?.communities?.length === 0 && !isLoading) {
    return <EmptyData />;
  }

  return (
    <main>
      {page < 2 && isLoading ? (
        <>
          <div className='communities'>
            {Array(12)
              .fill(() => 0)
              .map((_: any, i: number) => (
                <CardListLoader key={i} />
              ))}
          </div>
        </>
      ) : (
        <>
          <VirtualList
            listData={communities}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            limit={limit}
            renderComponent={(index: number, community: ICommunity) => (
              <Card key={index} cardData={community as ICommunity} type='c' />
            )}
            footerHeight={50}
          />
          {isLoading && page > 1 && <CardListLoader />}
        </>
      )}
    </main>
  );
}
