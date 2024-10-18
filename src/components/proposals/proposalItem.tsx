"use client";
import { getImageSource, timeAgo } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import MarkdownRenderer from "../common/MarkDownRender";
import { useRouter } from "next/navigation";
import { IProposal } from "@/utils/types/types";
import "./index.scss";

interface IProps {
  proposal: IProposal;
  showCheckbox?: boolean;
  onSelectChange?: (id: number, selected: boolean) => void;
  isChecked?: boolean;
}

export default function ProposalItem({
  proposal,
  showCheckbox = false,
  onSelectChange,
  isChecked = false,
}: IProps) {
  // TODO: create seperate component for USER_HEAD
  // TODO: update community and user data

  const { id, cta: time, title, desc, up, down, user, community } = proposal;
  // active, ended, up_coming
  const proposalAction = "up_coming"; // TODO: upadate dynamic action after API update
  const router = useRouter();

  const handleRedirect = () => {
    router.push(`/p/${id}`);
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onSelectChange) {
      onSelectChange(id, event.target.checked);
    }
  };
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
              src={getImageSource(user?.img?.pro, "u")}
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
          {/* TODO: add action */}
          <p className={`proposal_action ${proposalAction} `}>Action</p>
          {/* <CButton onClick={() => {}}>{isActive ? "Active" : "Ended"}</CButton> */}
          {/* <div className='more'><IoIosMore /></div> */}
          {showCheckbox && (
            <input
              className='checkbox'
              type='checkbox'
              onChange={handleCheckboxChange}
              checked={isChecked}
            />
          )}
        </div>

        <div className='proposal_data' onClick={handleRedirect}>
          <div className='content'>
            <h3>{title}</h3>
            <MarkdownRenderer markdownContent={desc} limit={4} />
            <div className='stats'>
              {/* TODO: on going show as per activity */}
              {/* <p>On going</p> */}
              <p>{up} WUFT</p>
              <p>Started on January 12,2023</p>
            </div>
          </div>
          <div className='votes'>
            <div className='range_bar_data'>
              <div className='range_data'>
                <p>Yes</p>
                <p className='yes'>{up}&nbsp; Votes</p>
              </div>
              <RangeBar total={up + down} current={up} />
            </div>
            <div className='range_bar_data'>
              <div className='range_data'>
                <p>No</p>
                <p className='no'>{down} &nbsp; Votes</p>
              </div>
              <RangeBar total={up + down} current={down} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

interface RangeBarProps {
  total: number;
  current: number;
}

export const RangeBar: React.FC<RangeBarProps> = ({ total, current }) => {
  // Calculate the percentage width
  const percentage = total !== 0 ? (current / total) * 100 : 0;

  return (
    <div className='rangebar'>
      <div className='progress' style={{ width: `${percentage}%` }}></div>
    </div>
  );
};
