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
interface IFollowers {
  uid: string;
  entityType: "u" | "c";
}

export default function Followers({ uid, entityType }: IFollowers) {
  const [page, setPage] = useState(1);
  const [communities, setCommunities] = useState<any[]>([]);
  const limit = 10;
  const payload = {
    userId: uid,
    type: entityType,
    page,
    limit,
  };

  const { isLoading, data, refetch } = useAsync(getFollowersByUserId, payload);
  console.log("follow data", data);
  const refetchRoute = (state: RootState) => state?.common.refetch.user;
  const [{ dispatch, actions }, [refetchData]] = useRedux([refetchRoute]);

  useEffect(() => {
    console.log("refetchData?.user", refetchData);

    if (refetchData == true) {
      refetch();
      dispatch(actions.resetRefetch());
    }
  }, [refetchData]);

  const returnFollow = (data: any) => {
    return data.user;
  };

  return (
    <div className='followers_containers'>
      {data?.length > 0 ? (
        data?.map((follow: any, i: number) => {
          return (
            <Link
              key={i}
              href={`/u/${returnFollow(follow)?.username}`}
              as={`/u/${returnFollow(follow)?.username}`}
            >
              <div className='user'>
                <Image
                  width={40}
                  height={40}
                  src={getImageSource(returnFollow(follow)?.img?.pro, "u")}
                  alt='avatar'
                />
                <span className='name'>{returnFollow(follow)?.name}</span>
                <span className='username'>
                  @{returnFollow(follow)?.username}
                </span>
              </div>
            </Link>
          );
        })
      ) : isLoading ? (
        <FollowListLoader />
      ) : (
        <EmptyData />
      )}
    </div>
  );
}
