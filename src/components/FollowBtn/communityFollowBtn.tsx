"use client";
import React, { useState, useEffect } from "react";
import CButton from "@/components/common/Button";
import { followApi, UnFollowAPI } from "@/services/api/userApi";
import useRedux from "@/hooks/useRedux";
import useAsync from "@/hooks/useAsync";
import "./index.scss";
import { ICommunity } from "@/utils/types/types";
import NotificationMessage from "../common/Notification";
import { RootState } from "@/contexts/store";
interface IProps {
  communityData: ICommunity;
  onSuccess?: (isFollowed: boolean) => void;
}

export default function CommunityFollowButton({
  communityData,
  onSuccess,
}: IProps) {
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);

  const { isLoading: isLoadingFollow, callFunction } = useAsync();

  // State for isFollowed
  const [isFollowed, setIsFollowed] = useState<boolean | boolean>(false);
  useEffect(() => {
    if (communityData?.isFollowed !== undefined && user?.profile?.id) {
      setIsFollowed(communityData?.isFollowed);
    }
  }, [communityData, user?.profile?.id]);

  const [isUnfollowLoading, setIsUnFollowLoading] = useState<boolean>(false);

  const handleFollowToggle = async () => {
    try {
      if (isFollowed === null) return;
      if (!isFollowed) {
        await callFunction(followApi, { typ: "c", fwid: communityData?.id });
        dispatch(actions.setRefetchCommunity(true));
        dispatch(actions.setRefetchUser(true));
        setIsFollowed(true);
        onSuccess && onSuccess(true);
      } else {
        setIsUnFollowLoading(true);
        await UnFollowAPI({
          type: "c",
          fwid: communityData?.id?.toString() as string,
        });
        dispatch(actions.setRefetchCommunity(true));
        dispatch(actions.setRefetchUser(true));
        setIsFollowed(false);
        setIsUnFollowLoading(false);
        onSuccess && onSuccess(false);
      }
    } catch (error: any) {
      NotificationMessage("error", error?.message);
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
        disabled={isFollowed === null}
      >
        {isFollowed ? "Joined" : "Join"}
      </CButton>
    </div>
  );
}
