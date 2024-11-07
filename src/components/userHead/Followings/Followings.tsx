"use client";
import EmptyData from "@/components/common/Empty";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { getFollowinsByUserId } from "@/services/api/userApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./index.scss";
import { getImageSource } from "@/utils/helpers";
import FollowListLoader from "@/components/common/loaders/followList";
import VirtualList from "@/components/common/virtualList";
import NotificationMessage from "@/components/common/Notification";

interface IFollowings {
  uid: string;
  entityType: "u" | "c";
}

export default function Followings({ uid, entityType }: IFollowings) {
  const [page, setPage] = useState(1);
  const [followings, setFollowings] = useState<any[]>([]);
  const limit = 10;
  const payload = {
    userId: uid,
    type: entityType,
    page,
    limit,
  };
  const { error, isLoading, data, refetch } = useAsync(
    getFollowinsByUserId,
    payload
  );
  const refetchRoute = (state: RootState) => state?.common.refetch.user;
  const [{ dispatch, actions }, [refetchData]] = useRedux([refetchRoute]);

  useEffect(() => {
    if (refetchData == true) {
      refetch();
      dispatch(actions.resetRefetch());
    }
  }, [refetchData]);

  useEffect(() => {
    if (data && data.length > 0) {
      setFollowings((prevData) => (page === 1 ? data : [...prevData, ...data]));
    }
  }, [data]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  useEffect(() => {
    if (error) NotificationMessage("error", error?.message);
  }, [error]);

  // if (!isLoading && data?.length === 0 && page === 1) {
  //   return <EmptyData />;
  // }

  const returnFollow = (data: any) => {
    if (data.followedUser == null) {
      return { ...data.followedCommunity };
    } else {
      return { ...data.followedUser };
    }
  };

  const renderFollowingItem = (index: number, follow: any) => {
    const followData = returnFollow(follow);
    return (
      <Link
        key={index}
        href={`/${entityType}/${followData?.username}`}
        as={`/${entityType}/${followData?.username}`}
      >
        <div className='user'>
          <Image
            width={40}
            height={40}
            src={
              entityType === "c"
                ? getImageSource(followData?.logo, "c")
                : getImageSource(followData?.img?.pro, "u")
            }
            alt='avatar'
          />
          <span className='name'>{followData?.name}</span>
          <span className='username'>@{followData?.username}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className='followings_containers'>
      {page < 2 && isLoading ? (
        <div className='communities'>
          {Array(10)
            .fill(0)
            .map((_, i) => (
              <FollowListLoader key={i} />
            ))}
        </div>
      ) : (
        <>
          <VirtualList
            listData={followings}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            limit={limit}
            itemWidth={200}
            renderComponent={renderFollowingItem}
            footerHeight={50}
          />
          {isLoading && page > 1 && <FollowListLoader />}
          {!isLoading && data?.length === 0 && page === 1 && <EmptyData />}
        </>
      )}
    </div>
  );
}
