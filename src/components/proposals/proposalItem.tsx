import { getImageSource, timeAgo } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import CButton from "../common/Button";
import MarkdownRenderer from "../common/MarkDownRender";

export default function ProposalItem() {
  // TODO: create seperate component for USER_HEAD
  // TODO: update community and user data
  const proposalId = 1;
  const isActive = true;
  const time = "2024-08-28T12:54:59.918Z";
  const community = {
    id: 1,
    username: "UnilendOfficial",
    name: "Unilend",
    ticker: "UNO",
    logo: "https://picsum.photos/200/300",
    metadata: "This is our official community.",
    pCount: 6,
    followers: 0,
    tSupply: 0,
    sts: 1,
    cta: "2024-08-28T12:43:06.494Z",
    uta: "2024-08-28T12:43:06.494Z",
  };

  const user = {
    id: 1,
    username: "im_mangesh",
    name: "Mangesh",
    img: "https://picsum.photos/200/300",
    pcount: 6,
    tid: null,
    did: null,
    desc: null,
    sts: 1,
    cta: "2024-08-28T12:41:03.323Z",
    uta: "2024-08-28T12:41:03.323Z",
  };
  const yesCount = 452;
  const noCount = 124;
  const content =
    "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.";

  return (
    <>
      <section className='proposal_Item'>
        <div className='user_head'>
          <Link
            href={`u/${user.username}`}
            as={`/u/${user.username}`}
            className='community_logo'
          >
            <Image
              src={getImageSource(user.img)}
              alt={user.username || "user"}
              width={52}
              height={52}
            />
          </Link>
          <div className='names'>
            <Link
              href={`u/${user.username}`}
              as={`/u/${user.username}`}
              className='user_name'
            >
              {user.username}
            </Link>
            <Link
              href={`c/${community.username}`}
              as={`/c/${community.username}`}
              className='community_name'
            >
              {community.username}
            </Link>
          </div>
          <p className='post_time'>&bull; {timeAgo(time)}</p>
          <CButton>{isActive ? "Active" : "Ended"}</CButton>
          {/* <div className='more'><IoIosMore /></div> */}
        </div>
        <Link href={`p/${proposalId}`} as={`/p/${proposalId}`}>
          <div className='proposal_data'>
            <div className='content'>
              <MarkdownRenderer markdownContent={content} />
              <div className='stats'>
                <p>On going</p>
                <p>452 WUFT</p>
                <p>Started on January 12,2023</p>
              </div>
            </div>
            <div className='votes'>
              <div className='range_bar_data'>
                <div className='range_data'>
                  <p>Yes</p>
                  <p className='yes'>{yesCount} WUFT</p>
                </div>
                <RangeBar total={yesCount + noCount} current={yesCount} />
              </div>
              <div className='range_bar_data'>
                <div className='range_data'>
                  <p>No</p>
                  <p className='no'>{noCount} WUFT</p>
                </div>
                <RangeBar total={yesCount + noCount} current={noCount} />
              </div>
            </div>
          </div>
        </Link>
      </section>
    </>
  );
}

interface RangeBarProps {
  total: number;
  current: number;
}

const RangeBar: React.FC<RangeBarProps> = ({ total, current }) => {
  // Calculate the percentage width
  const percentage = (current / total) * 100;

  return (
    <div className='rangebar'>
      <div className='progress' style={{ width: `${percentage}%` }}></div>
    </div>
  );
};

// export default RangeBar;
