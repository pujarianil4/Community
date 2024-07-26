import React from "react";
import "./index.scss";
import { LiaArrowRightSolid } from "react-icons/lia";
import { PiArrowFatUpLight, PiArrowFatDownLight } from "react-icons/pi";
import { GoComment, GoShareAndroid } from "react-icons/go";

export default function FeedPost() {
  return (
    <div className='postcard_container'>
      <div className='user_head'>
        <div>
          <img src='./images.png' alt='' />
          <span>User Name</span>
          <LiaArrowRightSolid />
          <img src='./images.png' alt='' />
          <span>Community</span>
        </div>
        <span>10 july 2024</span>
      </div>
      <div className='content'>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid
          aperiam ipsa dolor! Qui quam optio voluptatibus temporibus. Ab cumque
          odio voluptates fugit laborum est, hic neque nihil minima aliquid
          dolore?''
        </p>
      </div>
      <div className='actions'>
        <div>
          <PiArrowFatUpLight size={18} />
          <span>100</span>
          <PiArrowFatDownLight size={18} />
        </div>
        <div>
          <GoComment size={18} />
          <span>Comments</span>
        </div>
        <div>
          <GoShareAndroid size={18} />
          <span>Share</span>
        </div>
      </div>
    </div>
  );
}
