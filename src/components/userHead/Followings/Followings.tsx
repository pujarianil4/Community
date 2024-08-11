"use client";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { getFollowinsByUserId } from "@/services/api/api";
import Image from "next/image";
import React from "react";
import "./index.scss";

interface IFollowings {
  uid: string;
}

export default function Followings({ uid }: IFollowings) {
  // const userNameSelector = (state: RootState) => state?.user;

  // const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);

  const { isLoading, data } = useAsync(getFollowinsByUserId, uid);

  return (
    <div className='followings_containers'>
      {Array.from({ length: 10 }, () => () => 0).map((_, i) => {
        return (
          <div key={i} className='user'>
            <Image
              width={40}
              height={40}
              src={"https://picsum.photos/300/300"}
              alt='avatar'
            />
            <span className='name'>Anil Pujari</span>
            <span className='username'>@anilpujari</span>
          </div>
        );
      })}
    </div>
  );
}
