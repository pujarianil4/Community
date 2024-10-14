"use client";
import React, { useState } from "react";
import { ICommunity, IUser } from "@/utils/types/types";
import Image from "next/image";
import CButton from "@/components/common/Button";
import { getImageSource, numberWithCommas } from "@/utils/helpers";
import CommunityFollowButton from "../FollowBtn/communityFollowBtn";
import UserFollowButton from "../FollowBtn/userFollowbtn";
import { useRouter } from "next/navigation";

interface IUserCardProps {
  cardData: IUser;
  type: "u";
}

interface ICommunityCardProps {
  cardData: ICommunity;
  type: "c";
}
// TODO: ADD Redirect url
type IProps = ICommunityCardProps | IUserCardProps;
export default function Card({ cardData, type = "u" }: IProps) {
  const router = useRouter();

  const [memberCount, setMemberCount] = useState<number>(
    type === "c" ? (cardData as ICommunity)?.followers : 0
  );

  const handleRedirect = () => {
    if (type == "c") {
      router.push(`/c/${cardData?.username}`);
    } else {
      router.push(`/u/${cardData?.username}`);
    }
  };

  const updateMemberCount = (isFollowed: boolean) => {
    setMemberCount((prevCount) =>
      isFollowed ? prevCount + 1 : Math.max(0, prevCount - 1)
    );
  };

  return (
    <section className='card_container' onClick={handleRedirect}>
      <div className='photo_section'>
        <Image
          className='cover_photo'
          src={getImageSource(
            type === "c"
              ? (cardData as ICommunity)?.img?.cvr
              : (cardData as IUser)?.img?.cvr,
            "cvr"
          )} // TODO: Update c image
          alt='cover_photo'
          width={176}
          height={50}
        />
        <Image
          className='main_photo'
          src={
            type === "c"
              ? getImageSource((cardData as ICommunity)?.img?.pro, "c")
              : getImageSource((cardData as IUser)?.img?.pro, "u")
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
                {numberWithCommas(memberCount || 0)}
                {/* {numberWithCommas((cardData as ICommunity)?.followers) || 0} */}
                &nbsp; Members <br /> <span>569 Online</span>
              </p>

              <CommunityFollowButton
                communityData={cardData as ICommunity}
                onSuccess={(isFollowed) => updateMemberCount(isFollowed)}
              />
            </>
          ) : (
            <>
              <p>2.5k Followers</p>
              <UserFollowButton
                userData={cardData as IUser}
                // userId={(cardData as IUser).username}
              />
            </>
          )}
        </div>
      </div>
    </section>
  );
}
