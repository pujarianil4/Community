"use client";
import React, { useState, useEffect } from "react";
import CButton from "@/components/common/Button";
import { fetchUser, followApi, UnFollowAPI } from "@/services/api/api";
import useRedux from "@/hooks/useRedux";
import useAsync from "@/hooks/useAsync";
import "./index.scss";
import { RootState } from "@/contexts/store";
import { useRouter } from "next/navigation";

interface IProps {
  userId: string;
}

export default function UserFollowButton({ userId }: IProps) {
  const router = useRouter();
  const userNameSelector = (state: RootState) => state?.user;
  const refetchRoute = (state: RootState) => state?.common.refetch;
  const [{ dispatch, actions }, [user, refetchData]] = useRedux([
    userNameSelector,
    refetchRoute,
  ]);
  const {
    isLoading,
    data,
    error,
    callFunction: callBack,
  } = useAsync(fetchUser, userId);
  const {
    isLoading: isLoadingFollow,
    data: followResponse,
    callFunction,
  } = useAsync();
  const [isSelf, setIsSelf] = useState<boolean>(user.uid === data?.id);
  const [isFollowed, setIsFollowed] = useState<boolean>(data?.isFollowed);

  const handleFollowToggle = async () => {
    try {
      if (!isFollowed) {
        await callFunction(followApi, {
          typ: "u",
          fwid: data.id,
        });
        dispatch(actions.setRefetchUser(true));
        setIsFollowed(true);
      } else {
        await UnFollowAPI(data.id);
        dispatch(actions.setRefetchUser(true));
        setIsFollowed(false);
      }
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/settings`);
  };

  useEffect(() => {
    setIsFollowed(data?.isFollowed);

    if (refetchData?.user == true) {
      callBack(fetchUser, userId);
      dispatch(actions.resetRefetch());
    }

    if (user.uid === data?.id) {
      setIsSelf(true);
    } else {
      setIsSelf(false);
    }
  }, [user, data, refetchData]);

  return (
    <div onClick={(event) => event.stopPropagation()}>
      {isSelf ? (
        <CButton onClick={handleEdit} className='follow_btn'>
          Edit
        </CButton>
      ) : (
        <CButton
          className='follow_btn'
          loading={isLoadingFollow || isLoading}
          onClick={handleFollowToggle}
        >
          {isFollowed ? "Joined" : "Join"}
        </CButton>
      )}
    </div>
  );
}
