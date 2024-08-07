"use client";
import useAsync from "@/hooks/useAsync";
import { fetchCommunityByCname } from "@/services/api/api";
import React from "react";
import CButton from "../common/Button";
import { useParams } from "next/navigation";
import "./index.scss";
import UandCHeadLoader from "../common/loaders/UandCHead";

export default function CommunityHead() {
  const { communityId } = useParams<{ communityId: string }>();
  const { isLoading, data } = useAsync(fetchCommunityByCname, communityId);
  //const data = await fetchCommunityByCname("nifty50");

  return (
    <>
      {isLoading || !data ? (
        <UandCHeadLoader />
      ) : (
        <div className='userhead_cotainer'>
          <div className='info'>
            <div>
              <img
                src='https://cdn-icons-png.flaticon.com/512/149/149071.png'
                alt=''
              />
              <h4>{data?.name}</h4>
              <span>@{data?.username}</span>
            </div>
            <CButton>Follow</CButton>
          </div>
          <div className='content'>
            <div className='statics'>
              <div>
                <h4>{data?.pCount}</h4>
                <span>Posts</span>
              </div>
              <div>
                <h4>{data?.followers}</h4>
                <span>Followers</span>
              </div>
              <div>
                <h4>0</h4>
                <span>Followings</span>
              </div>
            </div>
            <div className='overview'>
              <p>{data?.metadata}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
