"use client";
import React, { useState, useEffect } from "react";
import CButton from "@/components/common/Button";
import { followApi, UnFollowAPI } from "@/services/api/userApi";
import { fetchUser } from "@/services/api/userApi";
import useRedux from "@/hooks/useRedux";
import useAsync from "@/hooks/useAsync";
import "./index.scss";
import { RootState } from "@/contexts/store";
import { useRouter } from "next/navigation";
import { IUser } from "@/utils/types/types";

interface IProps {
  userData: IUser;
  onSuccess?: (isFollowed: boolean) => void;
}

export default function UserFollowButton({ userData, onSuccess }: IProps) {
  const router = useRouter();
  const userNameSelector = (state: RootState) => state?.user;
  const refetchRoute = (state: RootState) => state?.common.refetch;
  const [{ dispatch, actions }, [user, refetchData]] = useRedux([
    userNameSelector,
    refetchRoute,
  ]);
  // const {
  //   isLoading,
  //   data,
  //   error,
  //   callFunction: callBack,
  // } = useAsync(fetchUser, userId);
  const {
    isLoading: isLoadingFollow,
    data: followResponse,
    callFunction,
  } = useAsync();
  const [isSelf, setIsSelf] = useState<boolean>(
    user?.profile?.id === userData?.id
  );

  const [isFollowed, setIsFollowed] = useState<boolean>(
    userData?.isFollowed as boolean
  );
  const [isUnfollowLoading, setIsUnFollowLoading] = useState<boolean>(false);

  const handleFollowToggle = async () => {
    try {
      if (!isFollowed) {
        await callFunction(followApi, {
          typ: "u",
          fwid: userData.id,
        });
        dispatch(actions.setRefetchUser(true));
        setIsFollowed(true);
        onSuccess && onSuccess(true);
      } else {
        setIsUnFollowLoading(true);
        await UnFollowAPI({
          type: "u",
          fwid: userData?.id?.toString() as string,
        });
        dispatch(actions.setRefetchUser(true));
        setIsFollowed(false);
        onSuccess && onSuccess(false);
        setIsUnFollowLoading(false);
      }
    } catch (error) {
      console.error("Error handling follow:", error);
    }
  };

  const handleEdit = () => {
    router.push(`/settings?type=profile`);
  };

  // useEffect(() => {
  //   setIsFollowed(userData?.isFollowed);

  //   if (refetchData?.user == true) {
  //     callBack(fetchUser, userId);
  //     dispatch(actions.resetRefetch());
  //   }

  //   if (user.uid === data?.id) {
  //     setIsSelf(true);
  //   } else {
  //     setIsSelf(false);
  //   }
  // }, [user, data, refetchData]);

  return (
    <div onClick={(event) => event.stopPropagation()}>
      {isSelf ? (
        <CButton onClick={handleEdit} className='follow_btn'>
          Edit
        </CButton>
      ) : (
        <CButton
          className='follow_btn'
          loading={isLoadingFollow || isUnfollowLoading}
          onClick={handleFollowToggle}
        >
          {isFollowed ? "Followed" : "Follow"}
        </CButton>
      )}
    </div>
  );
}
