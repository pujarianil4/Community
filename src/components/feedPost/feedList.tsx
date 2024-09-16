"use client";
import React, { useEffect, useState } from "react";
import useAsync from "@/hooks/useAsync";
import { getPosts, getPostsBycName, getPostsByuName } from "@/services/api/api";
import { useParams } from "next/navigation";
import FeedPost from "./feedPost";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { useSelector } from "react-redux";
import EmptyData from "../common/Empty";
import { FaAngleDown } from "react-icons/fa6";
import "./index.scss";
import FeedPostLoader from "../common/loaders/Feedpost";
import { Popover } from "antd";
import { AddIcon } from "@/assets/icons";
import CFilter from "../common/Filter";

const getFunctionByMethod = {
  allPosts: getPosts,
  byCName: getPostsBycName,
  byUName: getPostsByuName,
};

interface IFeedList {
  method: keyof typeof getFunctionByMethod;
  id: string | null;
}
interface List {
  value: string;
  title: string;
}

export default function FeedList({ method, id }: IFeedList) {
  // const { userId, communityId } = useParams<{
  //   userId: string;
  //   communityId: string;
  // }>();

  const {
    isLoading,
    data: posts,
    refetch,
    callFunction,
  } = useAsync(getFunctionByMethod[method], id);
  const refetchRoute = (state: RootState) => state?.common.refetch.user;
  const [{ dispatch, actions }, [refetchData]] = useRedux([refetchRoute]);
  const loadingArray = Array(5).fill(() => 0);

  const handleFilter = (filter: List) => {
    callFunction(getFunctionByMethod[method], filter.value);
  };

  useEffect(() => {
    if (method == "allPosts") {
      handleFilter({ value: "time", title: "latest" });
    }

    if (refetchData == true) {
      refetch();
      dispatch(actions.resetRefetch());
    }
  }, [refetchData]);

  return (
    <>
      {method == "allPosts" && (
        <>
          <CFilter
            list={[
              { value: "ccount", title: "trending" },
              { value: "time", title: "latest" },
              { value: "up", title: "vote" },
            ]}
            callBack={handleFilter}
            defaultListIndex={0}
          />
        </>
      )}

      <div className='feedlist'>
        {!isLoading && posts ? (
          posts.length > 0 ? (
            posts?.map((post: any) => <FeedPost key={post.id} post={post} />)
          ) : (
            <EmptyData />
          )
        ) : (
          loadingArray.map((_: any, i: number) => <FeedPostLoader key={i} />)
        )}
      </div>
    </>
  );
}
