/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import "./index.scss";
import CFilter from "@/components/common/Filter";
import useAsync from "@/hooks/useAsync";
import {
  fetchCommunitySearchByPostData,
  fetchSearchByPostData,
  fetchUserSearchByPostData,
} from "@/services/api/searchApi";
import SearchPostItem from "./post";
import { IPost } from "@/utils/types/types";
import PostLoader from "./postLoader";
import EmptyData from "@/components/common/Empty";
import { usePathname, useSearchParams } from "next/navigation";
import NotificationMessage from "@/components/common/Notification";
import VirtualList from "@/components/common/virtualList";

interface List {
  value: string;
  title: string;
}

export default function Posts() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const limit = 10;

  const fetchDataByType = (type: string) => {
    switch (type) {
      case "u":
        return fetchUserSearchByPostData;
      case "c":
        return fetchCommunitySearchByPostData;
      default:
        return fetchSearchByPostData;
    }
  };
  // PERIOD - hourly, daily, monthly, yearly;
  const payload = {
    search: searchQuery,
    page,
    limit,
    sortBy: "ccount",
    order: "DESC",
    period: "",
  };
  const getPayload = () => {
    if (pathname.split("/")[1] == "c") {
      return { ...payload, cname: pathname.split("/")[2] };
    } else if (pathname.split("/")[1] == "u") {
      return { ...payload, uname: pathname.split("/")[2] };
    } else {
      return payload;
    }
  };
  const {
    error,
    isLoading,
    data: postsData,
    callFunction,
    refetch,
  } = useAsync(fetchDataByType(pathname.split("/")[1]), getPayload());

  const handleFilter = (filter: List) => {
    setPosts([]);
    callFunction(fetchDataByType(pathname.split("/")[1]), {
      ...payload,
      sortBy: filter?.value,
    });
    setPage(1);
  };

  const handleTimeFilter = (filter: List) => {
    setPosts([]);
    callFunction(fetchDataByType(pathname.split("/")[1]), {
      ...payload,
      period: filter?.value,
    });
    setPage(1);
  };

  useEffect(() => {
    if (searchQuery) {
      setPosts([]);
      callFunction(fetchDataByType(pathname.split("/")[1]), getPayload());
      setPage(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    const data = Array.isArray(postsData?.posts)
      ? postsData?.posts
      : postsData?.posts?.data;
    if (data && data?.length > 0) {
      if (page === 1) {
        setPosts(data);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }
    }
  }, [postsData]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  useEffect(() => {
    if (error) NotificationMessage("error", error?.message); // error?.response?.data?.message
  }, [error]);

  return (
    <main className='search_post_container'>
      {/* Update Filters as per data */}
      <section className='filters'>
        <CFilter
          list={[
            { value: "ccount", title: "trending" },
            { value: "time", title: "latest" },
            { value: "up", title: "vote" },
          ]}
          callBack={handleFilter}
          defaultListIndex={0}
        />
        <CFilter
          list={[
            { value: "", title: "All time" },
            { value: "yearly", title: "Past year" },
            { value: "monthly", title: "Past month" },
            // { value: "cta", title: "Past week" },
            { value: "daily", title: "Today" },
            { value: "hourly", title: "Past hour" },
          ]}
          callBack={handleTimeFilter}
          defaultListIndex={0}
        />
      </section>
      {page < 2 && isLoading ? (
        <>
          {Array(5)
            .fill(() => 0)
            .map((_: any, i: number) => (
              <PostLoader key={i} />
            ))}
        </>
      ) : postsData?.posts?.length === 0 && !isLoading ? (
        <div style={{ margin: "20% auto" }}>
          <EmptyData />
        </div>
      ) : (
        <section>
          {/* {postsData?.posts?.map((post: IPost) => (
            <SearchPostItem key={post?.id} post={post} />
          ))} */}
          <VirtualList
            listData={posts}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            limit={limit}
            // totalCount={postsData?.pagination?.totalItems}
            renderComponent={(index: number, post: IPost) => (
              <SearchPostItem key={index} post={post} />
            )}
            footerHeight={200}
          />
          {isLoading && page > 1 && <PostLoader />}
        </section>
      )}
    </main>
  );
}
