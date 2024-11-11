"use client";
import React, { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";

import useAsync from "@/hooks/useAsync";
import { getPostsByuName } from "@/services/api/postApi";

import FeedPost from "@/components/feedPost/feedPost";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import EmptyData from "@/components/common/Empty";

import FeedPostLoader from "@/components/common/loaders/Feedpost";
import { IPost } from "@/utils/types/types";
import VirtualList from "@/components/common/virtualList";
import NotificationMessage from "@/components/common/Notification";

interface List {
  value: string;
  title: string;
}

export default function FeedList() {
  // const { userId, communityId } = useParams<{
  //   userId: string;
  //   communityId: string;
  // }>();

  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const limit = 10; // UPDATE limit later

  const refetchRoute = (state: RootState) => state?.common.refetch.user;
  const refetchPost = (state: RootState) => state.common.refetch.post;
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [shouldRefetchUser, shouldRefetchPost, user]] =
    useRedux([refetchRoute, refetchPost, userNameSelector]);
  const loadingArray = Array(5).fill(() => 0);

  const payload = {
    nameId: user?.profile?.username,
    sortby: "time",
    page,
    limit,
    sts: "draft",
  };
  const { error, isLoading, data, refetch } = useAsync(
    getPostsByuName,
    payload
  );

  // useEffect(() => {
  //   if (shouldRefetchUser || shouldRefetchPost) {
  //     callFunction(getFunctionByMethod[method], {
  //       nameId: id,
  //       sortby,
  //       order: "DESC",
  //       page: 1,
  //       limit: limit,
  //     });
  //     setPosts([]);
  //     setPage(1);
  //     dispatch(actions.resetRefetch());
  //   }
  // }, [shouldRefetchUser, shouldRefetchPost]);

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

  useEffect(() => {
    if (error) NotificationMessage("error", error?.message);
  }, [error]);

  if (page < 2 && isLoading) {
    return loadingArray.map((_: any, i: number) => <FeedPostLoader key={i} />);
  }

  return (
    <>
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
