import React from "react";
import { ICommunity, IUser } from "@/utils/types/types";
import Image from "next/image";
import CButton from "@/components/common/Button";

interface IUserCardProps {
  cardData: IUser;
  type: "u";
}

interface ICommunityCardProps {
  cardData: ICommunity;
  type: "c";
}

type IProps = ICommunityCardProps | IUserCardProps;
export default function Card({ cardData, type = "u" }: IProps) {
  return (
    <section className='card_container'>
      <div className='photo_section'>
        <Image
          className='cover_photo'
          src={
            type === "c"
              ? (cardData as ICommunity)?.logo
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
              ? (cardData as ICommunity)?.logo
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
          {(type === "c"
            ? (cardData as ICommunity)?.metadata
            : (cardData as IUser)?.desc) ||
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry."}
        </p>
        <div className='action'>
          {/* TODO: add dynamic followers data */}
          {type === "c" ? (
            <p>
              2.5k Members <br /> <span>569 Online</span>
            </p>
          ) : (
            <p>2.5k Followers</p>
          )}
          <CButton>Join</CButton>
        </div>
      </div>
    </section>
  );
}
