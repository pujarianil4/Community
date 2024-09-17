"use client";
import useAsync from "@/hooks/useAsync";
import { fetchCommunityByCname } from "@/services/api/api";
import React, { useEffect } from "react";
import CButton from "../common/Button";
import { useParams, usePathname } from "next/navigation";
import "./index.scss";
import UandCHeadLoader from "../common/loaders/UandCHead";
import CTabs from "../common/Tabs";
import FeedList from "../feedPost/feedList";
import Followers from "../userHead/followers/Followers";
import {
  getImageSource,
  numberWithCommas,
  setToLocalStorage,
} from "@/utils/helpers";
import {
  AddIcon,
  DiscordIcon,
  TelegramIcon,
  TwitterIcon,
} from "@/assets/icons";
import Image from "next/image";
import Proposals from "../proposals";
import MarkdownRenderer from "../common/MarkDownRender";
import { ICommunity } from "@/utils/types/types";
import CommunityFollowButton from "../FollowBtn/communityFollowBtn";
export default function CommunityHead() {
  const { communityId: id } = useParams<{ communityId: string }>();

  const pathname = usePathname();
  const pathArray = pathname.split("/");
  const communityId = id || pathArray[pathArray.length - 1];

  const { data } = useAsync(fetchCommunityByCname, communityId);

  const addItemToRecentCommunity = (
    data: ICommunity[],
    newItem: ICommunity
  ) => {
    const existingIndex = data?.findIndex((item) => item.id === newItem.id);

    if (existingIndex !== -1) {
      data[existingIndex] = newItem;
    } else {
      data.push(newItem);
    }

    if (data.length > 5) {
      data.shift();
    }

    return data;
  };

  useEffect(() => {
    if (data) {
      const value = localStorage?.getItem("recentCommunity");
      const prevCommunities: any = value ? JSON.parse(value) : [];
      const recentCommunities = addItemToRecentCommunity(prevCommunities, data);
      setToLocalStorage("recentCommunity", recentCommunities);
    }
  }, [data]);

  const handleCreatePost = () => {
    // TODO: Show create post with current community
    console.log("CREATE_POST");
  };

  return (
    <>
      {!data ? (
        <UandCHeadLoader />
      ) : (
        <div className='user_container'>
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
                src={
                  data?.img?.cvr
                    ? data.img.cvr
                    : getImageSource(data?.logo, "cvr")
                }
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
                      src={
                        data?.img?.pro
                          ? data.img.pro
                          : getImageSource(data?.logo, "c")
                      }
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
                <MarkdownRenderer markdownContent={data?.metadata} limit={3} />
                <CommunityFollowButton communityData={data} />
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
                content: (
                  <div style={{ height: "1000px" }}>
                    <FeedList method='byCName' id={communityId} />
                  </div>
                ),
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
