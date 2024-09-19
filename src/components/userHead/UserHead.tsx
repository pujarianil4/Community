"use client";
import React from "react";
import useAsync from "@/hooks/useAsync";
import { fetchUser } from "@/services/api/api";
import { useParams } from "next/navigation";
import "./userhead.scss";
import UandCHeadLoader from "../common/loaders/UandCHead";
import CTabs from "../common/Tabs";
import FeedList from "../feedPost/feedList";
import Followers from "./followers/Followers";
import Followings from "./Followings/Followings";
import MarkdownRenderer from "../common/MarkDownRender";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { DiscordIcon, TelegramIcon, TwitterIcon } from "@/assets/icons";
import { getImageSource, numberWithCommas } from "@/utils/helpers";
import UserFollowButton from "../FollowBtn/userFollowbtn";
export default function UserHead() {
  const { userId: id } = useParams<{ userId: string }>();
  const pathname = usePathname();
  const pathArray = pathname.split("/");
  const userId = id || pathArray[pathArray.length - 1];

  const { data } = useAsync(fetchUser, userId || id);

  // const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
  //   e.currentTarget.src =
  //     "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  // };
  return (
    <>
      <div className='user-head'>
        {!data ? (
          <UandCHeadLoader />
        ) : (
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
                <div className='about'>
                  <MarkdownRenderer
                    markdownContent={data?.desc}
                    limit={3}
                    showViewMore={true}
                  />
                </div>
                <UserFollowButton userData={data} />
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
              content: (
                <div style={{ height: "1000px" }}>
                  <FeedList method='byUName' id={userId} />
                </div>
              ),
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
