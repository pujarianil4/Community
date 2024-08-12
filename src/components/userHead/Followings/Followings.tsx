"use client";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { getFollowinsByUserId } from "@/services/api/api";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import "./index.scss";

interface IFollowings {
  uid: string;
}

export default function Followings({ uid }: IFollowings) {
  // const userNameSelector = (state: RootState) => state?.user;

  // const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);

  const { isLoading, data, refetch } = useAsync(getFollowinsByUserId, uid);

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
    if (data.followedUser == null) {
      return { ...data.followedCommunity, type: "c" };
    } else {
      return { ...data.followedUser, type: "u" };
    }
  };

  return (
    <div className='followings_containers'>
      {data?.map((follow: any, i: number) => {
        return (
          <Link
            key={i}
            href={`/${returnFollow(follow).type}/${
              returnFollow(follow)?.username
            }`}
            as={`/${returnFollow(follow).type}/${
              returnFollow(follow)?.username
            }`}
          >
            <div className='user'>
              <Image
                width={40}
                height={40}
                src={"https://picsum.photos/300/300"}
                alt='avatar'
              />
              <span className='name'>{returnFollow(follow).name}</span>
              <span className='username'>@{returnFollow(follow).username}</span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
