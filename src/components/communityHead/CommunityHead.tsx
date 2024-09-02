"use client";
import useAsync from "@/hooks/useAsync";
import {
  fetchCommunityByCname,
  followApi,
  UnFollowAPI,
} from "@/services/api/api";
import React, { useEffect, useState } from "react";
import CButton from "../common/Button";
import { useParams, usePathname } from "next/navigation";
import "./index.scss";
import UandCHeadLoader from "../common/loaders/UandCHead";
import CTabs from "../common/Tabs";
import FeedList from "../feedPost/feedList";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import Followers from "../userHead/followers/Followers";
import Followings from "../userHead/Followings/Followings";
import {
  getImageSource,
  getRandomImageLink,
  numberWithCommas,
} from "@/utils/helpers";
import {
  AddIcon,
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
} from "@/assets/icons";
import Image from "next/image";
import Link from "next/link";
import Proposals from "../proposals";

export default function CommunityHead() {
  const { communityId: id } = useParams<{ communityId: string }>();

  const pathname = usePathname();
  const pathArray = pathname.split("/");
  const communityId = id || pathArray[pathArray.length - 1];

  const { isLoading, data, refetch } = useAsync(
    fetchCommunityByCname,
    communityId
  );
  const userNameSelector = (state: RootState) => state?.user;
  const refetchRoute = (state: RootState) => state?.common.refetch;
  const [{ dispatch, actions }, [user, refetchData]] = useRedux([
    userNameSelector,
    refetchRoute,
  ]);
  const [isFollowed, setIsFollowed] = useState<boolean>(data?.isFollowed);
  const {
    isLoading: isLoadingFollow,
    data: followResponse,
    callFunction,
  } = useAsync();

  useEffect(() => {
    refetch();
  }, [communityId]);

  useEffect(() => {
    setIsFollowed(data?.isFollowed);

    if (refetchData?.user == true) {
      refetch();
      dispatch(actions.resetRefetch());
    }
  }, [refetchData]);
  //const data = await fetchCommunityByCname("nifty50");

  const handleFollow = async () => {
    try {
      if (!isFollowed) {
        const data1 = await callFunction(followApi, {
          uid: user.uid,
          typ: "c",
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

  const handleCreatePost = () => {
    // TODO: Show create post with current community
    console.log("CREATE_POST");
  };

  useEffect(() => {
    setIsFollowed(data?.isFollowed);
    console.log("User", data);
  }, [data]);
  return (
    <>
      {!data ? (
        <UandCHeadLoader />
      ) : (
        <div className='user_container'>
          {/* <div className='userhead_cotainer'>
            <div className='info'>
              <img
                src={data?.logo ? data?.logo : getImageSource(data?.logo)}
                alt='avatar'
              />
              <div className='head'>
                <div className='names'>
                  <h4>{data?.name}</h4>
                  <span className='username'>@{data?.username}</span>
                </div>

                <CButton
                  loading={isLoadingFollow}
                  onClick={handleFollow}
                  className={`${isFollowed && "followed"}`}
                >
                  {isFollowed ? "Unfollow" : "Follow"}
                </CButton>
              </div>
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
          </div> */}
          <div className='userhead_cotainer'>
            <div className='cover_photo'>
              {/* <Image
                loading='lazy'
                className='imgbg'
                src='https://picsum.photos/700/220?random=1'
                alt='coverbg'
                width={768}
                height={220}
              /> */}
              <Image
                src='https://picsum.photos/700/220?random=1'
                alt='cover_photo'
                width={768}
                height={220}
                className='cover_img'
              />
            </div>
            <div className='details'>
              <div className='detailed_data'>
                <div className='box user'>
                  <div className='avatar'>
                    <Image
                      src={getImageSource(data?.logo, "c")}
                      alt='community'
                      fill
                    />
                  </div>
                  <div className='names'>
                    <h4>{data?.name}</h4>
                    <span className='username'>@{data?.username}</span>
                  </div>
                </div>
                <div className='stats box'>
                  <p>Members</p>
                  <h4>{numberWithCommas(data?.followers) || 0}</h4>
                </div>
                {/* <div className='stats box'>
                  <p>Following</p>
                  <h4>111</h4>
                </div> */}
                <div className='stats box'>
                  <p>Posts</p>
                  <h4>{numberWithCommas(data?.pCount) || "0"}</h4>
                </div>
              </div>
              <div className='activity'>
                <p className='about'>{data?.metadata}</p>
                <CButton
                  loading={isLoadingFollow}
                  onClick={handleFollow}
                  className='follow_btn'
                >
                  {isFollowed ? "Joined" : "Join"}
                </CButton>
              </div>
              {/* TODO: add disabled class as per social link availablity */}
              <div className='socials'>
                <div className='disabled'>
                  <DiscordIcon />
                </div>
                <div className='disabled'>
                  <TelegramIcon />
                </div>
                <div className='disabled'>
                  <TwitterIcon />
                </div>
              </div>
            </div>
          </div>
          <div className='more_btns'>
            {/* <Link href={`p`} as={`/p`}>
              <CButton className='btn'>Proposal</CButton>
            </Link> */}
            <CButton onClick={handleCreatePost} className='btn'>
              <AddIcon /> Create Post
            </CButton>
          </div>
          <CTabs
            items={[
              {
                key: "1",
                label: "Posts",
                content: <FeedList method='byCName' id={communityId} />,
              },
              {
                key: "2",
                label: "Members",
                content: <Followers uid={data.id} entityType='c' />,
              },
              // {
              //   key: "3",
              //   label: "Voters",
              //   content: <Followings uid={data.id} />,
              // },
              {
                key: "4",
                label: "Proposals",
                content: <Proposals />,
              },
            ]}
          />
        </div>
      )}
    </>
  );
}
