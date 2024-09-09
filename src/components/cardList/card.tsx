"use client";
import React from "react";
import { ICommunity, IUser } from "@/utils/types/types";
import Image from "next/image";
import CButton from "@/components/common/Button";
import { numberWithCommas } from "@/utils/helpers";
import CommunityFollowButton from "../communityFollowBtn";
import UserFollowButton from "../communityFollowBtn/userFollowbtn";

interface IUserCardProps {
  cardData: IUser;
  type: "u";
}

interface ICommunityCardProps {
  cardData: ICommunity;
  type: "c";
}
// TODO: ADD FOLLOW API, ADD Redirect url
type IProps = ICommunityCardProps | IUserCardProps;
export default function Card({ cardData, type = "u" }: IProps) {
  return (
    <section className='card_container'>
      <div className='photo_section'>
        <Image
          className='cover_photo'
          src={
            type === "c"
              ? (cardData as ICommunity)?.img?.cvr
              : (cardData as IUser)?.img?.cvr
          } // TODO: Update c image
          alt='cover_photo'
          width={200}
          height={50}
        />
        <Image
          className='main_photo'
          src={
            type === "c"
              ? (cardData as ICommunity)?.img?.pro
              : (cardData as IUser)?.img?.pro
          }
          alt='main_photo'
          width={56}
          height={56}
        />
      </div>
      <div className='content'>
        <p className='username'>{cardData?.username}</p>
        <p className='info'>
          {type === "c"
            ? (cardData as ICommunity)?.metadata
            : (cardData as IUser)?.desc}
        </p>
        <div className='action'>
          {/* TODO: add dynamic followers data */}
          {type === "c" ? (
            <>
              <p>
                {numberWithCommas((cardData as ICommunity)?.followers) || 0}
                &nbsp; Members <br /> <span>569 Online</span>
              </p>
              <CommunityFollowButton
                communityId={(cardData as ICommunity).username}
              />
            </>
          ) : (
            <>
              <p>2.5k Followers</p>
              <UserFollowButton userId={(cardData as IUser).username} />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
