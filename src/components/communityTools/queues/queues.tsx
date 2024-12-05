"use client";
import React, { useEffect } from "react";
import "./queues.scss";
import CInput from "@components/common/Input";
import CFilter from "@components/common/Filter";
import CDatePicker from "@/components/common/DatePicker";
import useAsync from "@/hooks/useAsync";
import { getPosts } from "@/services/api/postApi";
import TPostCard from "./cards/TPostCard";
import { IPost } from "@/utils/types/types";
export default function Queues() {
  const { error, isLoading, data, refetch, callFunction } = useAsync(
    getPosts,
    {}
  );

  console.log("Data1", error, isLoading, data);
  useEffect(() => {
    console.log("Data", data);
  }, [data]);

  return (
    <div className='tpost_container'>
      <div className='searchings'>
        {/* <CInput placeholder='Search for Post' /> */}

        {/* <CDatePicker /> */}
        <div className='filters'>
          <CFilter
            list={[
              {
                value: "post",
                title: "Posts",
              },
              {
                value: "comments",
                title: "Comments",
              },
            ]}
            callBack={() => {}}
            defaultListIndex={0}
          />
          <CFilter
            list={[
              {
                value: "New",
                title: "Newest first",
              },
              {
                value: "New",
                title: "Oldest first",
              },
            ]}
            callBack={() => {}}
            defaultListIndex={0}
          />
        </div>
      </div>
      <div className='posts'>
        {data?.map((post: IPost) => (
          <TPostCard post={post} />
        ))}
      </div>
    </div>
  );
}
