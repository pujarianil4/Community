"use client";
import React, { useEffect, useState } from "react";
import useAsync from "@/hooks/useAsync";
import { fetchCommunities } from "@/services/api/communityApi";
import CardList from "@/components/cardList";
import Card from "@/components/cardList/card";
import { ICommunity } from "@/utils/types/types";
import VirtualList from "@/components/common/virtualList";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import CardListLoader from "@/components/cardList/cardListLoader";
import EmptyData from "@/components/common/Empty";
import CFilter from "@/components/common/Filter";

interface List {
  value: string;
  title: string;
}

export default function CommunitiesList() {
  const [page, setPage] = useState(1);
  const [communities, setCommunities] = useState<ICommunity[]>([]);
  const limit = 10;
  const payload = {
    sortby: "pCount",
    order: "DESC",
    page,
    limit,
  };

  const { isLoading, data, refetch, callFunction } = useAsync(
    fetchCommunities,
    payload
  );

  const handleFilter = (filter: List) => {
    const isSortByFilter = ["followers", "pCount", "sts", "cta"].includes(
      filter?.value
    );
    const updatedPayload = isSortByFilter
      ? { ...payload, sortby: filter.value }
      : { ...payload, period: filter.value };
    setPage(1);
    setCommunities([]);
    callFunction(fetchCommunities, updatedPayload);
  };

  useEffect(() => {
    if (data && data?.length > 0) {
      if (page === 1) {
        setCommunities(data);
      } else {
        setCommunities((prevData) => [...prevData, ...data]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  return (
    <main>
      <section className='filters'>
        <CFilter
          list={[
            { value: "followers", title: "Relevance" },
            { value: "pCount", title: "Top" },
            { value: "sts", title: "Trending" },
            { value: "cta", title: "Latest" },
          ]}
          callBack={(filter) => handleFilter?.(filter)}
          defaultListIndex={0}
        />
        <CFilter
          list={[
            { value: "", title: "All time" },
            { value: "yearly", title: "Past year" },
            { value: "monthly", title: "Past month" },
            // { value: "time", title: "Past week" },
            { value: "daily", title: "Today" },
            { value: "hourly", title: "Past hour" },
          ]}
          callBack={(filter) => handleFilter?.(filter)}
          defaultListIndex={0}
        />
      </section>

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
            isGrid={true}
            itemWidth={200}
            renderComponent={(index: number, community: ICommunity) => (
              <Card key={index} cardData={community as ICommunity} type='c' />
            )}
            footerHeight={50}
          />
          {isLoading && page > 1 && <CardListLoader />}
          {data?.length === 0 && !isLoading && <EmptyData />}
        </>
      )}
    </main>
  );
}
