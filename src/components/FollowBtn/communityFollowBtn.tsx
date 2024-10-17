"use client";
import React, { useState } from "react";
import CButton from "@/components/common/Button";
import { followApi, UnFollowAPI } from "@/services/api/userApi";
import useRedux from "@/hooks/useRedux";
import useAsync from "@/hooks/useAsync";
import "./index.scss";
import { ICommunity } from "@/utils/types/types";

interface IProps {
  communityData: ICommunity;
  onSuccess?: (isFollowed: boolean) => void;
}

export default function CommunityFollowButton({
  communityData,
  onSuccess,
}: IProps) {
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
        dispatch(actions.setRefetchCommunity(true));
        setIsFollowed(true);
        onSuccess && onSuccess(true);
      } else {
        setIsUnFollowLoading(true);
        await UnFollowAPI({
          type: "c",
          fwid: communityData?.id?.toString() as string,
        });
        dispatch(actions.setRefetchCommunity(true));
        setIsFollowed(false);
        setIsUnFollowLoading(false);
        onSuccess && onSuccess(false);
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
