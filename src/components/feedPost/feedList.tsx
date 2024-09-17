"use client";
import React, { useEffect, useState } from "react";
import { Virtuoso } from "react-virtuoso";
import useAsync from "@/hooks/useAsync";
import { getPosts, getPostsBycName, getPostsByuName } from "@/services/api/api";
import { useParams } from "next/navigation";
import FeedPost from "./feedPost";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import EmptyData from "../common/Empty";
import "./index.scss";
import FeedPostLoader from "../common/loaders/Feedpost";
import CFilter from "../common/Filter";
import { IPost } from "@/utils/types/types";

const getFunctionByMethod = {
  allPosts: getPosts,
  byCName: getPostsBycName,
  byUName: getPostsByuName,
};

interface IFeedList {
  method: keyof typeof getFunctionByMethod;
  id: string | null;
  sortby?: string;
  order?: string;
  className?: string;
}
interface List {
  value: string;
  title: string;
}

export default function FeedList({
  method,
  id,
  sortby,
  order,
  className = "virtuoso",
}: IFeedList) {
  // const { userId, communityId } = useParams<{
  //   userId: string;
  //   communityId: string;
  // }>();

  const [page, setPage] = useState(1);
  const [posts, setPosts] = useState<IPost[]>([]);
  const limit = 10; // UPDATE limit later
  const { isLoading, data, refetch, callFunction } = useAsync(
    getFunctionByMethod[method],
    {
      nameId: id,
      sortby,
      order,
      page,
      limit: limit,
    }
  );

  const refetchRoute = (state: RootState) => state?.common.refetch.user;
  const [{ dispatch, actions }, [refetchData]] = useRedux([refetchRoute]);
  const loadingArray = Array(5).fill(() => 0);
  const handleFilter = (filter: List) => {
    callFunction(getFunctionByMethod[method], {
      name: id,
      sortby: filter.value,
      order: "DESC",
      page,
      limit: limit,
    });
  };

  useEffect(() => {
    // if (method === "allPosts") {
    //   handleFilter({ value: "time", title: "latest" });
    // }

    if (refetchData) {
      refetch();
      dispatch(actions.resetRefetch());
    }
  }, [refetchData]);

  useEffect(() => {
    if (data && data?.length > 0) {
      setPosts((prevPosts) => [...prevPosts, ...data]);
    }
  }, [data]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  if (page < 2 && isLoading) {
    return loadingArray.map((_: any, i: number) => <FeedPostLoader key={i} />);
  }
  return (
    <>
      {method == "allPosts" && (
        <>
          <CFilter
            list={[
              { value: "ccount", title: "trending" },
              { value: "time", title: "latest" },
            ]}
            callBack={handleFilter}
            defaultListIndex={0}
          />
        </>
      )}

      {/* <div className='feedlist'>
        {!isLoading && posts ? (
          posts.length > 0 ? (
            posts?.map((post: any) => <FeedPost key={post.id} post={post} />)
          ) : (
            <EmptyData />
          )
        ) : (
          loadingArray.map((_: any, i: number) => <FeedPostLoader key={i} />)
        )}
      </div> */}
      <div>
        <Virtuoso
          // style={{ position: "sticky" }}
          data={posts}
          // totalCount={200} // add this if we know total count of posts and remove below condition
          endReached={() => {
            if (
              !isLoading &&
              posts.length % limit === 0 &&
              posts.length / limit === page
            ) {
              setPage((prevPage) => prevPage + 1);
            }
          }}
          itemContent={(index, post) => <FeedPost key={index} post={post} />}
          className={className}
        />
        {isLoading && page > 0 && <FeedPostLoader />}
        {!isLoading && posts.length === 0 && <EmptyData />}
      </div>
    </>
  );
}
