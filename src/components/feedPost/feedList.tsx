"use client";
import React, { useEffect } from "react";
import useAsync from "@/hooks/useAsync";
import { getPosts, getPostsBycName, getPostsByuName } from "@/services/api/api";
import { useParams } from "next/navigation";
import FeedPost from "./feedPost";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { useSelector } from "react-redux";
import EmptyData from "../common/Empty";
import "./index.scss";
import FeedPostLoader from "../common/loaders/Feedpost";

const getFunctionByMethod = {
  allPosts: getPosts,
  byCName: getPostsBycName,
  byUName: getPostsByuName,
};

interface IFeedList {
  method: keyof typeof getFunctionByMethod;
}

export default function FeedList({ method }: IFeedList) {
  const { userId, communityId } = useParams<{
    userId: string;
    communityId: string;
  }>();

  const {
    isLoading,
    data: posts,
    refetch,
  } = useAsync(getFunctionByMethod[method], userId || communityId);

  const refetchRoute = (state: RootState) => state?.common.refetch.user;
  const [{ dispatch, actions }, [refetchData]] = useRedux([refetchRoute]);
  const loadingArray = Array(5).fill(() => 0);
  useEffect(() => {
    console.log("refetchData?.user", refetchData);

    if (refetchData == true) {
      refetch();
      dispatch(actions.resetRefetch());
    }
  }, [refetchData]);

  return (
    <>
      <div className='feedlist'>
        {posts ? (
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
