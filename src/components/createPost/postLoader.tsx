import React from "react";
import "./index.scss";

export default function PostLoader() {
  return (
    <div className='search_post_item loader'>
      <div className='content skeleton'></div>
      <div className='post_img skeleton'></div>
    </div>
  );
}
