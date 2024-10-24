import React from "react";
import Image from "next/image";
import "./index.scss";
import { ICommunity } from "@/utils/types/types";
import { getImageSource } from "@/utils/helpers";

interface ICHead {
  community: ICommunity;
}

export default function CHead({ community }: ICHead) {
  return (
    <div className='chead'>
      <Image
        src={getImageSource(community?.img?.pro, "c")}
        width={20}
        alt='communitylogo'
        height={20}
      />
      <div className='content'>
        <p>{community?.username}</p>
        <span className='member'> {community?.followers} Members</span>
      </div>
    </div>
  );
}
