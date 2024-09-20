"use client";
import React, { useState } from "react";
import CButton from "@/components/common/Button";
import { followApi, UnFollowAPI } from "@/services/api/api";
import useRedux from "@/hooks/useRedux";
import useAsync from "@/hooks/useAsync";
import "./index.scss";
import { ICommunity } from "@/utils/types/types";

interface IProps {
  communityData: ICommunity;
}

export default function CommunityFollowButton({ communityData }: IProps) {
  const { isLoading: isLoadingFollow, callFunction } = useAsync();
  const [{ dispatch, actions }] = useRedux();
  const [isFollowed, setIsFollowed] = useState<boolean>(
    communityData?.isFollowed as boolean
  );
  const [isUnfollowLoading, setIsUnFollowLoading] = useState<boolean>(false);

  const handleFollowToggle = async () => {
    try {
      if (!isFollowed) {
        await callFunction(followApi, { typ: "c", fwid: communityData?.id });
        dispatch(actions.setRefetchUser(true));
        setIsFollowed(true);
      } else {
        setIsUnFollowLoading(true);
        await UnFollowAPI({
          type: "c",
          fwid: communityData?.id?.toString() as string,
        });
        dispatch(actions.setRefetchUser(true));
        setIsFollowed(false);
        setIsUnFollowLoading(false);
      }
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };
  // useEffect(() => {
  //   setIsFollowed(data?.isFollowed);
  // }, [data]);

  return (
    <div onClick={(event) => event.stopPropagation()}>
      <CButton
        className='follow_btn'
        loading={isLoadingFollow || isUnfollowLoading}
        onClick={handleFollowToggle}
      >
        {isFollowed ? "Joined" : "Join"}
      </CButton>
    </div>
  );
}
