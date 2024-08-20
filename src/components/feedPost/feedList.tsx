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

const getFunctionByMethod = {
  allPosts: getPosts,
  byCName: getPostsBycName,
  byUName: getPostsByuName,
};

interface IFeedList {
  method: keyof typeof getFunctionByMethod;
  id: string | null;
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
  const [filterBy, setFilterBy] = useState("time");
  const [isOpen, setIsOpen] = useState(false);

  const lable: any = {
    time: "New",
    ccount: "Hot",
  };

  const handleFilter = (filter: string) => {
    callFunction(getFunctionByMethod[method], filter);
    setFilterBy(filter);
    handlePopover(false);
  };

  useEffect(() => {
    if (method == "allPosts") {
      handleFilter(filterBy);
    }

    if (refetchData == true) {
      refetch();
      dispatch(actions.resetRefetch());
    }
  }, [refetchData]);

  const list = (
    <div className='filter_list'>
      <p onClick={() => handleFilter("ccount")}>Hot</p>
      <p onClick={() => handleFilter("time")}>New</p>
    </div>
  );

  const handlePopover = (bool: boolean) => {
    setIsOpen(bool);
  };

  return (
    <>
      {method == "allPosts" && (
        <div className='filter'>
          <Popover
            placement='bottomRight'
            content={list}
            trigger='click'
            open={isOpen}
          >
            <div onClick={() => handlePopover(true)}>
              <span>{lable[filterBy]}</span>
              <FaAngleDown />
            </div>
          </Popover>
        </div>
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
