"use client";
import React, { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";

import useAsync from "@/hooks/useAsync";
import {
  getPosts,
  getPostsBycName,
  getPostsByuName,
} from "@/services/api/postApi";
import { useParams } from "next/navigation";

import FeedPost from "./feedPost";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import EmptyData from "../common/Empty";
import "./index.scss";

import FeedPostLoader from "../common/loaders/Feedpost";
import CFilter from "../common/Filter";
import { IPost } from "@/utils/types/types";
import VirtualList from "../common/virtualList";
import { throwError } from "@/utils/helpers";
import { profile } from "console";

const getFunctionByMethod = {
  allPosts: getPosts,
  byCName: getPostsBycName,
  byUName: getPostsByuName,
};

interface IFeedList {
  method: keyof typeof getFunctionByMethod;
  id?: string | null;
  sortby?: string;
  order?: string;
}
interface List {
  value: string;
  title: string;
}

export default function FeedList({
  method,
  id,
  sortby = "time",
  order = "DESC",
}: IFeedList) {
  // const { userId, communityId } = useParams<{
  //   userId: string;
  //   communityId: string;
  // }>();

  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const limit = 10; // UPDATE limit later
  const [selectedFilter, setSelectedFilter] = useState<List>({
    value: sortby,
    title: "trending",
  });
  const [selectedSts, setSelectedSts] = useState<List>({
    value: "",
    title: "All",
  });

  const refetchRoute = (state: RootState) => state?.common.refetch.user;
  const refetchPost = (state: RootState) => state.common.refetch.post;
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [shouldRefetchUser, shouldRefetchPost, user]] =
    useRedux([refetchRoute, refetchPost, userNameSelector]);
  const { error, isLoading, data, refetch, callFunction } = useAsync(
    getFunctionByMethod[method],
    {
      nameId: id,
      sortby: selectedFilter.value,
      order,
      page,
      limit: limit,
    }
  );

  if (error) {
    throwError(error, "Failed to load posts. Please try again later.");
  }

  const loadingArray = Array(5).fill(() => 0);

  const handleFilter = (filter: List) => {
    setSelectedFilter(filter);
    callFunction(getFunctionByMethod[method], {
      nameId: id,
      sortby: filter.value,
      order: "DESC",
      page: 1,
      limit: limit,
    });
    setPosts([]);
    setPage(1);
  };

  const handleFilterStatus = (filter: List) => {
    setSelectedSts(filter);
    callFunction(getFunctionByMethod[method], {
      nameId: id,
      sortby,
      order: "DESC",
      page: 1,
      limit: limit,
      sts: filter.value,
    });
    setPosts([]);
    setPage(1);
  };

  useEffect(() => {
    if (typeof user?.profile?.id === "number") {
      callFunction(getFunctionByMethod[method], {
        nameId: id,
        sortby,
        order: "DESC",
        page: 1,
        limit: limit,
      });
      setPosts([]);
      setPage(1);
    }
  }, [user.profile.id]);

  useEffect(() => {
    if (shouldRefetchUser || shouldRefetchPost) {
      callFunction(getFunctionByMethod[method], {
        nameId: id,
        sortby,
        order: "DESC",
        page: 1,
        limit: limit,
      });
      setPosts([]);
      setPage(1);
      dispatch(actions.resetRefetch());
    }
  }, [shouldRefetchUser, shouldRefetchPost]);

  useEffect(() => {
    if (data && data?.length > 0) {
      if (page === 1) {
        setPosts(data);
      } else {
        setPosts((prevPosts) => [...prevPosts, ...data]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  // useEffect(() => {
  //   // refetchPost;

  //   shouldRefetchPost;
  // }, [user.profile.id]);

  if (page < 2 && isLoading) {
    return loadingArray.map((_: any, i: number) => <FeedPostLoader key={i} />);
  }

  return (
    <>
      {method == "allPosts" && (
        <CFilter
          list={[
            { value: "ccount", title: "trending" },
            { value: "cta", title: "latest" },
            { value: "up", title: "vote" },
          ]}
          callBack={handleFilter}
          defaultListIndex={0}
          selectedFilter={selectedFilter.title}
        />
      )}
      {method != "allPosts" && (
        <CFilter
          list={[
            { value: "", title: "All" },
            { value: "published", title: "Published" },
            { value: "archived", title: "Archived" },
            ...(user.username == id
              ? [{ value: "draft", title: "Drafts" }]
              : []),
          ]}
          callBack={handleFilterStatus}
          defaultListIndex={0}
          selectedFilter={selectedSts.title}
        />
      )}

      {!isLoading && posts?.length === 0 ? (
        <EmptyData />
      ) : (
        <>
          <VirtualList
            listData={posts}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            limit={limit}
            renderComponent={(index: number, post: IPost) => (
              <FeedPost key={index} post={post} />
            )}
          />

          {isLoading && page > 1 && <FeedPostLoader />}
        </>
      )}
    </>
  );
}
