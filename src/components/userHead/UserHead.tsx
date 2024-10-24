"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import useAsync from "@/hooks/useAsync";
import { fetchUser } from "@/services/api/userApi";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import "./userhead.scss";
// import UandCHeadLoader from "../common/loaders/UandCHead";
import UandCHeadLoader from "../common/loaders/Uhead";
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
import FollowListLoader from "../common/loaders/followList";
import SavedPost from "./SavedPost";
import { Tooltip } from "antd";
import Link from "next/link";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";

export default function UserHead() {
  const { userId: id } = useParams<{ userId: string }>();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathArray = pathname.split("/");
  const userId = id || pathArray[pathArray.length - 1];

  const { isLoading, data, refetch } = useAsync(fetchUser, userId || id);

  const [membersCount, setMembersCount] = useState<number>(0);

  useEffect(() => {
    if (data) {
      setMembersCount(data.fwrs);
    }
  }, [data]);

  const handleMemberCountUpdate = (isFollowed: boolean) => {
    setMembersCount((prevCount) =>
      isFollowed ? prevCount + 1 : Math.max(0, prevCount - 1)
    );
  };

  const tabsList = useMemo(() => {
    const baseTabs = [
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
    ];

    return baseTabs;
  }, []);

  const labelToKeyMap = Object.fromEntries(
    tabsList.map((tab) => [tab.label.toLocaleLowerCase(), tab.key])
  );
  const initialLabel = searchParams.get("type")?.toLocaleLowerCase() || "posts";
  const [activeType, setActiveType] = useState(
    labelToKeyMap[initialLabel] || "1"
  );

  useEffect(() => {
    const currentLabel = searchParams.get("type")?.toLocaleLowerCase();
    if (currentLabel && labelToKeyMap[currentLabel]) {
      setActiveType(labelToKeyMap[currentLabel]);
    } else {
      // Handle default behavior when type parameter is missing or invalid
      router.replace(`${pathname}?type=posts`);
    }
  }, [searchParams, pathname, router, labelToKeyMap]);

  const handleTabChange = useCallback(
    (key: string) => {
      const selectedLabel = tabsList
        .find((tab) => tab.key === key)
        ?.label.toLocaleLowerCase();
      setActiveType(key);
      if (selectedLabel) {
        router.push(`${pathname}?type=${encodeURIComponent(selectedLabel)}`);
      }
    },
    [pathname, router, searchParams, tabsList]
  );

  const discordConnected = data?.discord?.id;
  const telegramConnected = data?.telegram?.id;
  const twitterConnected = data?.x?.id;

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
                  <h4>{numberWithCommas(membersCount) || 0}</h4>
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

                <div className='social_bx'>
                  <UserFollowButton
                    userData={data}
                    onSuccess={handleMemberCountUpdate}
                  />
                  <div className='socials'>
                    <Tooltip
                      title={
                        discordConnected
                          ? `Connected: ${data.discord.username}`
                          : "Not connected"
                      }
                    >
                      <div
                        className={discordConnected ? "enabled" : "disabled"}
                      >
                        {discordConnected ? (
                          <Link
                            href={`https://discord.com/users/${data.discord.id}`}
                            target='_blank'
                          >
                            <DiscordIcon />
                          </Link>
                        ) : (
                          <DiscordIcon />
                        )}
                      </div>
                    </Tooltip>
                    <Tooltip
                      title={
                        telegramConnected
                          ? `Connected: ${data.telegram.username}`
                          : "Not connected"
                      }
                    >
                      <div
                        className={telegramConnected ? "enabled" : "disabled"}
                      >
                        {telegramConnected ? (
                          <Link
                            href={`https://t.me/${data.telegram.username}`}
                            target='_blank'
                          >
                            <TelegramIcon />
                          </Link>
                        ) : (
                          <TelegramIcon />
                        )}
                      </div>
                    </Tooltip>
                    <Tooltip
                      title={
                        twitterConnected
                          ? `Connected: ${data.x.username}`
                          : "Not connected"
                      }
                    >
                      <div
                        className={twitterConnected ? "enabled" : "disabled"}
                      >
                        {twitterConnected ? (
                          <Link
                            href={`https://x.com/${data.x.username}`}
                            target='_blank'
                          >
                            <TwitterIcon />
                          </Link>
                        ) : (
                          <TwitterIcon />
                        )}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <CTabs
          activeKey={activeType}
          defaultActiveKey='1'
          onChange={handleTabChange}
          // items={tabsList}
          items={[
            {
              key: "1",
              label: "Posts",
              content: <FeedList method='byUName' id={userId} />,
            },
            {
              key: "2",
              label: "Saved",
              content: <SavedPost />,
            },
            {
              key: "3",
              label: "Followers",
              content:
                isLoading || !data ? (
                  <FollowListLoader />
                ) : (
                  <Followers uid={data?.id} entityType='u' />
                ),
            },
            {
              key: "4",
              label: "Followings",
              content:
                isLoading || !data ? (
                  <FollowListLoader />
                ) : (
                  <Followings uid={data?.id} entityType='u' />
                ),
            },
            {
              key: "5",
              label: "Community",
              content:
                isLoading || !data ? (
                  <FollowListLoader />
                ) : (
                  <Followings uid={data?.id} entityType='c' />
                ),
            },
          ]}
        />
      </div>
    </>
  );
}
