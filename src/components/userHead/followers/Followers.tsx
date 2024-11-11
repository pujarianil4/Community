"use client";
import EmptyData from "@/components/common/Empty";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { getFollowersByUserId } from "@/services/api/userApi";
import { getImageSource } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import "./index.scss";
import FollowListLoader from "@/components/common/loaders/followList";
import VirtualList from "@/components/common/virtualList";
import NotificationMessage from "@/components/common/Notification";

interface IFollowers {
  uid: string;
  entityType: "u" | "c";
}

export default function Followers({ uid, entityType }: IFollowers) {
  const [page, setPage] = useState(1);
  const [followers, setFollowers] = useState<any[]>([]);
  const limit = 10;
  const payload = {
    userId: uid,
    type: entityType,
    page,
    limit,
  };

  const { error, isLoading, data, refetch } = useAsync(
    getFollowersByUserId,
    payload
  );

  useEffect(() => {
    if (data && data.length > 0) {
      setFollowers((prevData) => (page === 1 ? data : [...prevData, ...data]));
    }
  }, [data]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  const refetchRoute = (state: RootState) => state?.common.refetch.user;
  const [{ dispatch, actions }, [refetchData]] = useRedux([refetchRoute]);

  useEffect(() => {
    if (refetchData === true) {
      refetch();
      dispatch(actions.resetRefetch());
    }
  }, [refetchData]);

  useEffect(() => {
    if (error) NotificationMessage("error", error?.message);
  }, [error]);

  // if (!isLoading && data?.length === 0 && page === 1) {
  //   return <EmptyData />;
  // }

  const renderFollowerItem = (index: number, follow: any) => {
    const followerData = follow.user;
    return (
      <Link
        key={index}
        href={`/u/${followerData?.username}`}
        as={`/u/${followerData?.username}`}
      >
        <div className='user'>
          <Image
            width={40}
            height={40}
            src={getImageSource(followerData?.img?.pro, "u")}
            alt='avatar'
          />
          <span className='name'>{followerData?.name}</span>
          <span className='username'>@{followerData?.username}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className='followers_containers'>
      {page < 2 && isLoading ? (
        <div className='communities'>
          {Array(12)
            .fill(0)
            .map((_, i) => (
              <FollowListLoader key={i} />
            ))}
        </div>
      ) : (
        <>
          <VirtualList
            listData={followers}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            limit={limit}
            itemWidth={200}
            renderComponent={renderFollowerItem}
            footerHeight={50}
          />
          {isLoading && page > 1 && <FollowListLoader />}
          {!isLoading && data?.length === 0 && page === 1 && <EmptyData />}
        </>
      )}
    </div>
  );
}
