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
  const payload = {
    search: searchQuery,
    page,
    limit,
    sortBy: "ccount",
    order: "DESC",
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

  if (
    // Array.isArray(postsData?.posts)
    //   ? postsData?.posts?.length === 0
    //   : postsData?.posts?.data?.length === 0 && !isLoading
    postsData?.posts?.length === 0 &&
    !isLoading
  ) {
    return <EmptyData />;
  }
  return (
    <main className='search_post_container'>
      {/* Update Filters as per data */}
      <section className='filters'>
        <CFilter
          list={[
            { value: "ccount", title: "Relevance" },
            { value: "cta", title: "Top" },
            { value: "ccount", title: "Trending" },
            { value: "cta", title: "Latest" },
          ]}
          callBack={handleFilter}
          defaultListIndex={0}
        />
        <CFilter
          list={[
            { value: "ccount", title: "All time" },
            { value: "cta", title: "Past year" },
            { value: "cta", title: "Past month" },
            { value: "cta", title: "Past week" },
            { value: "cta", title: "Today" },
            { value: "cta", title: "Past hour" },
          ]}
          callBack={handleFilter}
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
            footerHeight={150}
          />
          {isLoading && page > 1 && <PostLoader />}
        </section>
      )}
    </main>
  );
}
