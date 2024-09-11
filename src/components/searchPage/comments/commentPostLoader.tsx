import React from "react";

export default function CommentPostLoader() {
  return (
    <div className='comment_post_loader'>
      <div className='user_head skeleton'></div>
      <div className='content skeleton'></div>
    </div>
  );
}
