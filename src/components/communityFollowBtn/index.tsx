"use client";
import React, { useState, useEffect } from "react";
import CButton from "@/components/common/Button";
import {
  fetchCommunityByCname,
  followApi,
  UnFollowAPI,
} from "@/services/api/api";
import useRedux from "@/hooks/useRedux";
import useAsync from "@/hooks/useAsync";
import "./index.scss";

interface IProps {
  communityId: string;
}

export default function CommunityFollowButton({ communityId }: IProps) {
  const { isLoading: isLoadingFollow, callFunction } = useAsync();
  const { isLoading, data } = useAsync(fetchCommunityByCname, communityId);
  const [{ dispatch, actions }] = useRedux();

  const [isFollowed, setIsFollowed] = useState<boolean>(data?.isFollowed);

  const handleFollowToggle = async () => {
    try {
      if (!isFollowed) {
        await callFunction(followApi, { typ: "c", fwid: data?.id });
        dispatch(actions.setRefetchUser(true));
        setIsFollowed(true);
      } else {
        await UnFollowAPI(data?.id);
        dispatch(actions.setRefetchUser(true));
        setIsFollowed(false);
      }
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };
  useEffect(() => {
    setIsFollowed(data?.isFollowed);
  }, [data]);

  return (
    <CButton
      className='follow_btn'
      loading={isLoadingFollow || isLoading}
      onClick={handleFollowToggle}
    >
      {isFollowed ? "Joined" : "Join"}
    </CButton>
  );
}
