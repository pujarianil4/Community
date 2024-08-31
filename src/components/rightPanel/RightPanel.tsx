"use client";
import React from "react";
import "./index.scss";
import Post from "./post";
import { AddIcon, RightUpIcon } from "@/assets/icons";
import VoteSection from "./voteSection";
import { usePathname } from "next/navigation";
export default function RightPanel() {
  const pathName = usePathname();
  const isProposalPage = pathName.split("/")[1] == "p" ? true : false;

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
          <h2> Suggestions</h2>
          <div>
            <span>
              View All <RightUpIcon />
            </span>
          </div>
        </div>
        <div className='card_heading'>
          <div className='community_bx'>
            <img src='https://testcommunity.s3.amazonaws.com/0125f211-bf33-4610-8e73-6fc864787743-metamaskicon.png' />
            <span> anilcommunity</span>
          </div>
          <div className='community_join'>
            <span className='comm_icon'>Join</span>
          </div>
        </div>
        <div className='card_heading'>
          <div className='community_bx'>
            <img src='https://testcommunity.s3.amazonaws.com/0125f211-bf33-4610-8e73-6fc864787743-metamaskicon.png' />
            <span> anilcommunity</span>
          </div>
          <div className='community_join'>
            <span className='comm_icon'>
              Join
              {/* <AddIcon fill='#ffffff' /> */}
            </span>
          </div>
        </div>
        <div className='card_heading'>
          <div className='community_bx'>
            <img src='https://testcommunity.s3.amazonaws.com/0125f211-bf33-4610-8e73-6fc864787743-metamaskicon.png' />
            <span> anilcommunity</span>
          </div>
          <div className='community_join'>
            <span className='comm_icon'>
              Join
              {/* <AddIcon fill='#ffffff' /> */}
            </span>
          </div>
        </div>
      </div>
      {/* <div className='recentposts'>
        <span className='title'>Recent Posts</span>
        {Array(3)
          .fill(() => 0)
          .map((_, i: number) => (
            <Post key={i} />
          ))}
      </div> */}

      <div className='card'>
        <div className='card_heading'>
          <h2>Trending Post</h2>
          <div>
            <span>
              View All <RightUpIcon />
            </span>
          </div>
        </div>

        {Array(2)
          .fill(() => 0)
          .map((_, i: number) => (
            <Post key={i} />
          ))}
      </div>
    </div>
  );
}
