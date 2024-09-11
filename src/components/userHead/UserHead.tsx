"use client";
import React, { useEffect, useState } from "react";
import useAsync from "@/hooks/useAsync";
import {
  fetchCommunityByCname,
  fetchUser,
  followApi,
  UnFollowAPI,
} from "@/services/api/api";
import { useParams, useRouter } from "next/navigation";
import CButton from "../common/Button";
import "./userhead.scss";
import UandCHeadLoader from "../common/loaders/UandCHead";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import CTabs from "../common/Tabs";
import FeedList from "../feedPost/feedList";
import Followers from "./followers/Followers";
import Followings from "./Followings/Followings";
import MarkdownRenderer from "../common/MarkDownRender";
import { usePathname, useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  AddIcon,
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
} from "@/assets/icons";
import { getImageSource, numberWithCommas } from "@/utils/helpers";
export default function UserHead() {
  const { userId: id } = useParams<{ userId: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const pathArray = pathname.split("/");
  const userId = id || pathArray[pathArray.length - 1];

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

  const [isExpanded, setIsExpanded] = useState(false);
  const viewDesc = () => {
    setIsExpanded((prev) => !prev);
  };
  useEffect(() => {
    callBack(fetchUser, userId || id);
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

  const handleEdit = () => {
    router.push(`/settings`);
  };

  const handleFollow = async () => {
    try {
      if (!isFollowed) {
        const data1 = await callFunction(followApi, {
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
          // <div className='userhead_cotainer'>
          //   <div className='info'>
          //     <img
          //       src={
          //         data?.img
          //           ? data?.img
          //           : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
          //       }
          //       onError={handleError}
          //       alt='avatar'
          //     />
          //     <div className='head'>
          //       <div className='names'>
          //         <h4>{data?.name}</h4>
          //         <span className='username'>@{data?.username}</span>
          //       </div>
          //       {!isSelf && (
          //         <CButton
          //           loading={isLoadingFollow}
          //           onClick={handleFollow}
          //           className={`${isFollowed && "followed"}`}
          //         >
          //           {isFollowed ? "Unfollow" : "Follow"}
          //         </CButton>
          //       )}
          //     </div>
          //   </div>
          //   <div className='content'>
          //     <div className='statics'>
          //       <div>
          //         <h4>{data.pcount}</h4>
          //         <span>Posts</span>
          //       </div>
          //       <div>
          //         <h4>10</h4>
          //         <span>Followers</span>
          //       </div>
          //       <div>
          //         <h4>10</h4>
          //         <span>Followings</span>
          //       </div>
          //     </div>
          //     <div className='overview'>
          //       <p>{data.desc}</p>
          //     </div>
          //   </div>
          // </div>
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
                src={getImageSource(data?.img?.cvr, "cvr")}
                alt='cover_photo'
                loading='lazy'
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
                      src={getImageSource(data?.img?.pro, "u")}
                      alt='user'
                      width={72}
                      height={72}
                    />
                  </div>
                  <div className='names'>
                    <h4>{data?.name}</h4>
                    <span className='username'>@{data?.username}</span>
                  </div>
                </div>
                <div className='stats box'>
                  <p>Followers</p>
                  <h4>{numberWithCommas(data?.fwrs) || "0"}</h4>
                </div>
                <div className='stats box'>
                  <p>Following</p>
                  <h4>{numberWithCommas(data?.fwng) || "0"}</h4>
                </div>
                <div className='stats box'>
                  <p>Posts</p>
                  <h4>{numberWithCommas(data?.pcount) || "0"}</h4>
                </div>
              </div>
              <div className='activity'>
                <div className='about' onClick={viewDesc}>
                  <MarkdownRenderer
                    markdownContent={data?.metadata}
                    limit={!isExpanded ? 3 : undefined}
                  />
                </div>
                {isSelf ? (
                  <CButton onClick={handleEdit} className='follow_btn'>
                    Edit
                  </CButton>
                ) : (
                  <CButton
                    loading={isLoadingFollow}
                    onClick={handleFollow}
                    className='follow_btn'
                  >
                    {isFollowed ? "Unfollow" : "Follow"}
                  </CButton>
                )}
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
              content: <Followings uid={data?.id} entityType='u' />,
            },
            {
              key: "4",
              label: "Community",
              content: <Followings uid={data?.id} entityType='c' />,
            },
          ]}
        />
      </div>
    </>
  );
}
