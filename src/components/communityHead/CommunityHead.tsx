import React from "react";
import CButton from "../common/Button";
import "./index.scss";
export default function CommunityHead() {
  return (
    <div className='userhead_cotainer'>
      <div className='info'>
        <div>
          <img
            src='https://cdn-icons-png.flaticon.com/512/149/149071.png'
            alt=''
          />
          <h4>Name</h4>
          <span>username</span>
        </div>
        <CButton>Follow</CButton>
      </div>
      <div className='content'>
        <div className='statics'>
          <div>
            <h4>10</h4>
            <span>Posts</span>
          </div>
          <div>
            <h4>10</h4>
            <span>Followers</span>
          </div>
          <div>
            <h4>10</h4>
            <span>Followings</span>
          </div>
        </div>
        <div className='overview'>
          <p>
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Aspernatur
            recusandae voluptates aut perferendis omnis esse sequi nemo rem
            aliquid eos provident enim exercitationem amet commodi accusamus
            magnam, molestias atque quae?
          </p>
        </div>
      </div>
    </div>
  );
}
