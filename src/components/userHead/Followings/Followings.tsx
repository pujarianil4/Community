"use client";
import EmptyData from "@/components/common/Empty";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { getFollowinsByUserId } from "@/services/api/userApi";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import "./index.scss";
import { getImageSource } from "@/utils/helpers";
import FollowListLoader from "@/components/common/loaders/followList";

interface IFollowings {
  uid: string;
  entityType: "u" | "c";
}

export default function Followings({ uid, entityType }: IFollowings) {
  // const userNameSelector = (state: RootState) => state?.user;

  // const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);

  const { isLoading, data, refetch } = useAsync(getFollowinsByUserId, {
    userId: uid,
    type: entityType,
  });

  const refetchRoute = (state: RootState) => state?.common.refetch.user;
  const [{ dispatch, actions }, [refetchData]] = useRedux([refetchRoute]);

  useEffect(() => {
    console.log("refetchData?.user", data);

    if (refetchData == true) {
      refetch();
      dispatch(actions.resetRefetch());
    }
  }, [refetchData]);

  const returnFollow = (data: any) => {
    if (data.followedUser == null) {
      console.log("returnFollow", { ...data.followedCommunity }.logo);
      return { ...data.followedCommunity };
    } else {
      return { ...data.followedUser };
    }
  };

  return (
    <div className='followings_containers'>
      {data?.length > 0 ? (
        data?.map((follow: any, i: number) => {
          return (
            <Link
              key={i}
              href={`/${entityType}/${returnFollow(follow)?.username}`}
              as={`/${entityType}/${returnFollow(follow)?.username}`}
            >
              <div className='user'>
                <Image
                  width={40}
                  height={40}
                  src={
                    entityType === "c"
                      ? getImageSource(returnFollow(follow)?.logo, "c")
                      : getImageSource(returnFollow(follow)?.img?.pro, "u")
                  }
                  alt='avatar'
                />
                <span className='name'>{returnFollow(follow).name}</span>
                <span className='username'>
                  @{returnFollow(follow).username}
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
