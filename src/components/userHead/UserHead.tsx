"use client";
import React, { useEffect, useState } from "react";
import useAsync from "@/hooks/useAsync";
import {
  fetchCommunityByCname,
  fetchUser,
  followApi,
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
export default function UserHead() {
  const { userId } = useParams<{ userId: string }>();
  const [isFollowed, setIsFollowed] = useState<boolean>(false);
  const userNameSelector = (state: RootState) => state?.user;
  const [{}, [user]] = useRedux([userNameSelector]);
  const { isLoading, data } = useAsync(fetchUser, userId);
  const [isSelf, setIsSelf] = useState<boolean>(user.uid === data?.id);

  useEffect(() => {
    console.log("userId", user, data);
    if (user.uid === data?.id) {
      setIsSelf(true);
    } else {
      setIsSelf(false);
    }
  }, [user, data]);

  const {
    isLoading: isLoadingFollow,
    data: followResponse,
    callFunction,
  } = useAsync();

  const handleFollow = async () => {
    try {
      const data1 = await callFunction(followApi, {
        uid: user.uid,
        typ: "u",
        fwid: data.id,
      });
      console.log("data1", data1);

      setIsFollowed(!isFollowed);
    } catch (error) {}
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src =
      "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  };
  return (
    <>
      {isLoading || !data ? (
        <UandCHeadLoader />
      ) : (
        <div className='user-head'>
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
                    {isFollowed ? "Following" : "Follow"}
                  </CButton>
                )}
              </div>
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
          <CTabs
            items={[
              {
                key: "1",
                label: "Posts",
                content: <FeedList method='byUName' />,
              },
              {
                key: "2",
                label: "Followers",
                content: <Followers uid={data.id} />,
              },
              { key: "3", label: "Followings", content: "This is tab3" },
            ]}
          />
        </div>
      )}
    </>
  );
}
