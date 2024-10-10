import React from "react";
import "./index.scss";

export default function PostLoader() {
  return (
    <div className='draft_post_loader'>
      <div className='content skeleton'></div>
      <div className='img_bx'>
        <div className='post_img skeleton'></div>
      </div>
    </div>
  );
}
