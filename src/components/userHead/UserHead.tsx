"use client";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import useAsync from "@/hooks/useAsync";
import { fetchUser, viewUser } from "@/services/api/userApi";
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
import {
  formatNumber,
  getImageSource,
  numberWithCommas,
} from "@/utils/helpers";
import UserFollowButton from "../FollowBtn/userFollowbtn";
import FollowListLoader from "../common/loaders/followList";
import SavedPost from "./SavedPost";
import { Tooltip } from "antd";
import Link from "next/link";
import NotificationMessage from "../common/Notification";
import { BsEye } from "react-icons/bs";
import { convertNumber } from "@/utils/helpers/index";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
export default function UserHead() {
  const { userId: id } = useParams<{ userId: string }>();
  const userNameSelector = (state: RootState) => state?.user;

  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);
  console.log("user", user?.profile?.id);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathArray = pathname.split("/");
  const userId = id || pathArray[pathArray.length - 1];
  const stayTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { error, isLoading, data, refetch } = useAsync(fetchUser, userId || id);
  const [membersCount, setMembersCount] = useState<number>(0);

  const [isSelf, setIsSelf] = useState<boolean>(false);
  console.log("isSelf", isSelf);
  useEffect(() => {
    if (user?.profile?.id && data?.id) {
      setIsSelf(user.profile.id === data.id);
    }
  }, [user?.profile?.id, data?.id]);

  useEffect(() => {
    if (data) {
      setMembersCount(data.fwrs);
    }
  }, [data]);
  useEffect(() => {
    if (error) NotificationMessage("error", error?.message);
  }, [error]);

  useEffect(() => {
    if (data?.id && !isSelf) {
      console.log("");
      stayTimerRef.current = setTimeout(async () => {
        try {
          await viewUser(data.id);
          console.log("View count updated for user ID:", data.id);
        } catch (error) {
          console.error("Failed to update view count:", error);
        }
      }, 3000);
    } else {
      if (stayTimerRef.current) {
        clearTimeout(stayTimerRef.current);
        stayTimerRef.current = null;
      }
    }

    // Cleanup on component unmount
    return () => {
      if (stayTimerRef.current) {
        clearTimeout(stayTimerRef.current);
      }
    };
  }, [data?.id]);

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
      {
        key: "5",
        label: "Saved",
        content: <SavedPost />,
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
                    {/* <div className='views'>
                      <p>Views</p>
                      <h4>{convertNumber(data?.vCount || 0, 1)}</h4>
                    </div> */}
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
                  <div className='views'>
                    <span>{formatNumber(data?.vCount || 0, 1)}</span>
                    {/* <span> 2500</span> */}
                    <BsEye />
                  </div>

                  <UserFollowButton
                    userData={data}
                    onSuccess={handleMemberCountUpdate}
                  />

                  {/* <div className='socials'>
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
                  </div> */}
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
              label: "Followers",
              content:
                isLoading || !data ? (
                  <FollowListLoader />
                ) : (
                  <Followers uid={data?.id} entityType='u' />
                ),
            },
            {
              key: "3",
              label: "Followings",
              content:
                isLoading || !data ? (
                  <FollowListLoader />
                ) : (
                  <Followings uid={data?.id} entityType='u' />
                ),
            },
            {
              key: "4",
              label: "Community",
              content:
                isLoading || !data ? (
                  <FollowListLoader />
                ) : (
                  <Followings uid={data?.id} entityType='c' />
                ),
            },
            {
              key: "5",
              label: "Saved",
              content: <SavedPost />,
            },
          ]}
        />
      </div>
    </>
  );
}
