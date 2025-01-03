"use client";
import React, { useEffect, useState } from "react";
import "./index.scss";
import Post, { PostLoader } from "./post";
import { RightUpIcon } from "@/assets/icons";
import VoteSection from "./voteSection";
import { usePathname } from "next/navigation";
import useAsync from "@/hooks/useAsync";
import { getPosts } from "@/services/api/postApi";
import { fetchCommunities } from "@/services/api/communityApi";
import { ICommunity, IPost } from "@/utils/types/types";
import Community from "./community";
import Link from "next/link";
import { RootState } from "@/contexts/store";
import { useSelector } from "react-redux";

export default function RightPanel() {
  const pathName = usePathname();

  const userInfo = useSelector((state: RootState) => state.user.profile);

  const isProposalPage =
    pathName.split("/")[1] === "p" &&
    pathName.split("/")[2] !== "create-proposal"
      ? true
      : false;

  const { isLoading: isPostLoading, data: postByComments } = useAsync(
    getPosts,
    { sortby: "ccount" }
  );
  const {
    isLoading,
    data: communities,
    refetch,
  } = useAsync(fetchCommunities, "pCount");

  const [topPosts, setTopPosts] = useState<IPost[]>([]);
  const [topCommunities, setTopCommunities] = useState<ICommunity[]>([]);

  useEffect(() => {
    if (userInfo.id) {
      refetch();
    }
  }, [userInfo.id]);

  useEffect(() => {
    const topPost = postByComments?.slice(0, 3);
    const topCommunity = communities?.slice(0, 3);
    console.log("TOP_POST", topPost);
    setTopPosts(topPost);
    setTopCommunities(topCommunity);
  }, [postByComments, communities]);

  if (isProposalPage) {
    return (
      <div className='rightpanel_container'>
        <VoteSection />
      </div>
    );
  }

  return (
    <div className='rightpanel_container'>
      {/* <div className='createCommunity'>
        <p> Come here to check in with your favorite community</p>
        <button>Create Commumity</button>
      </div> */}
      <div className='card'>
        <div className='card_heading'>
          <h2>Suggestions</h2>
          <div>
            <Link href={"/communities"} as={"/communities"}>
              <span>
                View All <RightUpIcon />
              </span>
            </Link>
          </div>
        </div>
        {isLoading ? (
          <>
            {Array(3)
              .fill(() => 0)
              .map((_, i: number) => (
                <div key={i} className='card_heading'>
                  <div
                    style={{ width: "180px", height: "50px" }}
                    className='community_bx skeleton'
                  ></div>
                  <div className='community_join skeleton'></div>
                </div>
              ))}
          </>
        ) : (
          <>
            {topCommunities?.map((community: ICommunity) => (
              <Community key={community?.id} community={community} />
            ))}
          </>
        )}
      </div>

      <div className='card'>
        <div className='card_heading'>
          <h2>Trending Post</h2>
          {/* <div>
            <Link href={"/"} as={"/"}>
              <span>
                View All <RightUpIcon />
              </span>
            </Link>
          </div> */}
        </div>
        {isPostLoading ? (
          <>
            {Array(3)
              .fill(() => 0)
              .map((_, i: number) => (
                <PostLoader key={i} />
              ))}
          </>
        ) : (
          <>
            {topPosts?.map((post: IPost) => (
              <Post key={post?.id} post={post} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}
