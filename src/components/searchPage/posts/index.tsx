"use client";
import React from "react";
import "./index.scss";
import CFilter from "@/components/common/Filter";
import useAsync from "@/hooks/useAsync";
import { getPosts } from "@/services/api/api";
import SearchPostItem from "./post";
import { IPost } from "@/utils/types/types";

interface List {
  value: string;
  title: string;
}

export default function Posts() {
  //TODO: change getPosts method to get searchPosts
  const { isLoading, data: posts, refetch, callFunction } = useAsync(getPosts);

  const handleFilter = (filter: List) => {
    callFunction(getPosts, { sortby: filter.value });
  };
  return (
    <main className='search_post_container'>
      {/* Update Filters as per data */}
      <section className='filters'>
        <CFilter
          list={[
            { value: "ccount", title: "Relevance" },
            { value: "time", title: "Top" },
            { value: "ccount", title: "Trending" },
            { value: "time", title: "Latest" },
          ]}
          callBack={handleFilter}
          defaultListIndex={0}
        />
        <CFilter
          list={[
            { value: "ccount", title: "All time" },
            { value: "time", title: "Past year" },
            { value: "time", title: "Past month" },
            { value: "time", title: "Past week" },
            { value: "time", title: "Today" },
            { value: "time", title: "Past hour" },
          ]}
          callBack={handleFilter}
          defaultListIndex={0}
        />
      </section>
      <section>
        {posts?.map((post: IPost) => (
          <SearchPostItem key={post?.id} post={post} />
        ))}
      </section>
    </main>
  );
}
