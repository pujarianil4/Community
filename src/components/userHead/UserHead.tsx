"use client";
import React, { useEffect, useState } from "react";
import useAsync from "@/hooks/useAsync";
import {
  fetchCommunityByCname,
  fetchUser,
  followApi,
  UnFollowAPI,
} from "@/services/api/api";
import { useParams } from "next/navigation";
import CButton from "../common/Button";
import "./userhead.scss";
import UandCHeadLoader from "../common/loaders/UandCHead";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import CTabs from "../common/Tabs";
import FeedList from "../feedPost/feedList";
import Followers from "./followers/Followers";
import Followings from "./Followings/Followings";

import { usePathname, useSearchParams } from "next/navigation";
export default function UserHead() {
  const { userId: id } = useParams<{ userId: string }>();

  const pathname = usePathname();
  const pathArray = pathname.split("/");
  const userId = id || pathArray[pathArray.length - 1];
  console.log("USERID", userId, pathname, id);

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
  } = useAsync(fetchUser, userId || id);
  const [isSelf, setIsSelf] = useState<boolean>(user.uid === data?.id);
  const [isFollowed, setIsFollowed] = useState<boolean>(data?.isFollowed);

  useEffect(() => {
    callBack(fetchUser, userId || id);
    console.log("USERID useEffect", userId, pathname, id);
  }, [userId]);

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

  const {
    isLoading: isLoadingFollow,
    data: followResponse,
    callFunction,
  } = useAsync();

  const handleFollow = async () => {
    try {
      if (!isFollowed) {
        const data1 = await callFunction(followApi, {
          uid: user.uid,
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
    } catch (error) {}
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };
  return (
    <>
      <div className='user-head'>
        {!data ? (
          <UandCHeadLoader />
        ) : (
          <div className='userhead_cotainer'>
            <div className='info'>
              <img
                src={
                  data?.img
                    ? data?.img
                    : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                }
                onError={handleError}
                alt='avatar'
              />
              <div className='head'>
                <div className='names'>
                  <h4>{data?.name}</h4>
                  <span className='username'>@{data?.username}</span>
                </div>
                {!isSelf && (
                  <CButton
                    loading={isLoadingFollow}
                    onClick={handleFollow}
                    className={`${isFollowed && "followed"}`}
                  >
                    {isFollowed ? "Unfollow" : "Follow"}
                  </CButton>
                )}
              </div>
            </div>
            <div className='content'>
              <div className='statics'>
                <div>
                  <h4>{data.pcount}</h4>
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
                <p>{data.desc}</p>
              </div>
            </div>
          </div>
        )}
        <CTabs
          items={[
            {
              key: "1",
              label: "Posts",
              content: <FeedList method='byUName' id={userId} />,
            },
            {
              key: "2",
              label: "Followers",
              content: <Followers uid={data?.id} entityType='u' />,
            },
            {
              key: "3",
              label: "Followings",
              content: <Followings uid={data?.id} />,
            },
          ]}
        />
      </div>
    </>
  );
}
