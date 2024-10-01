"use client";
import useAsync from "@/hooks/useAsync";
import { fetchCommunityByCname } from "@/services/api/api";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import CButton from "../common/Button";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
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
import { Modal } from "antd";
import CreatePost from "../createPost/CreatePost";
import ProposalItemLoader from "../proposals/proposalItemLoader";
import FollowListLoader from "../common/loaders/followList";
export default function CommunityHead() {
  const { communityId: id } = useParams<{ communityId: string }>();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const pathArray = pathname.split("/");
  const communityId = id || pathArray[pathArray.length - 1];
  const { isLoading, data, refetch } = useAsync(
    fetchCommunityByCname,
    communityId
  );
  console.log("isLoading", isLoading);
  const tabsList = useMemo(() => {
    const baseTabs = [
      {
        key: "1",
        label: "Posts",
        content: <FeedList method='byCName' id={communityId} />,
      },
      {
        key: "2",
        label: "Members",
        content: <Followers uid={data?.id} entityType='c' />,
      },
      // {
      //   key: "3",
      //   label: "Voters",
      //   content: <Followings uid={data.id} />,
      // },
      {
        key: "4",
        label: "Proposals",
        content: <Proposals cid={data?.id} cname={data?.name} />,
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
    refetch();
  }, []);

  useEffect(() => {
    if (data) {
      const value = localStorage?.getItem("recentCommunity");
      const prevCommunities: any = value ? JSON.parse(value) : [];
      const recentCommunities = addItemToRecentCommunity(prevCommunities, data);
      setToLocalStorage("recentCommunity", recentCommunities);
    }
  }, [data]);

  const handleCancel = () => {
    setIsPostModalOpen(false);
  };

  const handleCreatePost = () => {
    // TODO: Show create post with current community
    console.log("CREATE_POST");
    setIsPostModalOpen(true);
  };

  return (
    <>
      {!data ? (
        <UandCHeadLoader />
      ) : (
        <div className='user_container'>
          <div className='userhead_cotainer'>
            <div className='cover_photo'>
              <Image
                src={getImageSource(data?.img?.cvr, "cvr")}
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
                      src={getImageSource(data?.img?.pro, "c")}
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
                <div className='desc_bx'>
                  <MarkdownRenderer
                    markdownContent={data?.metadata}
                    limit={3}
                    showViewMore={true}
                  />
                </div>

                <div className='social_bx'>
                  <CommunityFollowButton communityData={data} />
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
              {/* TODO: add disabled class as per social link availablity */}
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
          (
          <CTabs
            activeKey={activeType}
            defaultActiveKey='1'
            onChange={handleTabChange}
            items={[
              {
                key: "1",
                label: "Posts",
                content: <FeedList method='byCName' id={communityId} />,
              },
              {
                key: "2",
                label: "Members",
                content:
                  isLoading || !data ? (
                    <FollowListLoader />
                  ) : (
                    <Followers uid={data?.id} entityType='c' />
                  ),
              },
              // {
              //   key: "3",
              //   label: "Voters",
              //   content: <Followings uid={data.id} />,
              // },
              {
                key: "4",
                label: "Proposals",
                content:
                  isLoading || !data ? (
                    <>
                      {Array(3)
                        .fill(() => 0)
                        .map((_: any, i: number) => (
                          <ProposalItemLoader key={i} />
                        ))}
                    </>
                  ) : (
                    <Proposals cid={data?.id} cname={data?.name} />
                  ),
              },
            ]}
          />
          )
        </div>
      )}

      <Modal
        className='create_post_modal'
        open={isPostModalOpen}
        onCancel={handleCancel}
        footer={<></>}
        centered
      >
        {isPostModalOpen && (
          <CreatePost
            isPostModalOpen={isPostModalOpen}
            setIsPostModalOpen={setIsPostModalOpen}
            defaultCommunity={data}
          />
        )}
      </Modal>
    </>
  );
}
