"use client";
import React from "react";
import useAsync from "@/hooks/useAsync";
import { fetchCommunityByCname, fetchUser } from "@/services/api/api";
import { useParams } from "next/navigation";
import CButton from "../common/Button";
import "./index.scss";
import UandCHeadLoader from "../common/loaders/UandCHead";
export default function UserHead() {
  const { userId } = useParams<{ userId: string }>();

  console.log("userId", userId);

  const { isLoading, data } = useAsync(fetchUser, userId);

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };
  return (
    <>
      {isLoading || !data ? (
        <UandCHeadLoader />
      ) : (
        <div className='userhead_cotainer'>
          <div className='info'>
            <div>
              <img
                src={
                  data?.img
                    ? data?.img
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                onError={handleError}
                alt='avatar'
              />
              <h4>{data?.name}</h4>
              <span>@{data?.username}</span>
            </div>
            <CButton>Follow</CButton>
          </div>
          <div className='content'>
            <div className='statics'>
              <div>
                <h4>10</h4>
                <span>Posts</span>
              </div>
              <div>
                <h4>10</h4>
                <span>Followers</span>
              </div>
              <div>
                <h4>10</h4>
                <span>Followings</span>
              </div>
            </div>
            <div className='overview'>
              <p>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Aspernatur recusandae voluptates aut perferendis omnis esse
                sequi nemo rem aliquid eos provident enim exercitationem amet
                commodi accusamus magnam, molestias atque quae?
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
