import React from "react";

export default function FeedPostLoader() {
  return (
    <div className='feedpostloader'>
      <div className='user_head'>
        <div className='img skeleton'></div>
        <p className='post_time skeleton'></p>
      </div>
      <div className='skeleton content'></div>
      <div className='skeleton content'></div>
      <div className='skeleton content'></div>
    </div>
  );
}
