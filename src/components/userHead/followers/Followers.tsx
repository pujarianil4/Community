"use client";
import EmptyData from "@/components/common/Empty";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { getFollowersByUserId } from "@/services/api/api";
import { getImageSource } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect } from "react";
import "./index.scss";

interface IFollowers {
  uid: string;
  entityType: "u" | "c";
}

export default function Followers({ uid, entityType }: IFollowers) {
  // const userNameSelector = (state: RootState) => state?.user;

  // const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);

  const { isLoading, data, refetch } = useAsync(getFollowersByUserId, {
    userId: uid,
    type: entityType,
  });

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
                  src={getImageSource(returnFollow(follow)?.img)}
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
      ) : (
        <EmptyData />
      )}
    </div>
  );
}
