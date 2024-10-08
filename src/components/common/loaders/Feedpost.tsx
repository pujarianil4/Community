import React from "react";
import "./index.scss";
export default function FeedPostLoader() {
  return (
    // <div className='feedpostloader'>
    //   <div className='user_head'>
    //     <div className='user_avatar skeleton'></div>

    //     <p className='post_time skeleton'></p>
    //   </div>
    //   <div className='skeleton content'></div>
    //   <div className='skeleton content'></div>
    //   <div className='skeleton content'></div>
    // </div>

    <div className='feedpost_container'>
      <div className='user_head'>
        <div className='skeleton user_avatar'> </div>
        <div className='names'>
          <div className='skeleton user_name'> </div>
          <div className='skeleton community_name'> </div>
        </div>
        <p className='post_time skeleton'></p>

        <div className='more'>
          <div className=' skeleton options '></div>
          <div className='views'>
            <span className='skeleton'></span>
          </div>
        </div>
      </div>
      <div className='skeleton content'></div>
      <div className='skeleton content'></div>
      <div className='skeleton content'></div>
    </div>
  );
}
