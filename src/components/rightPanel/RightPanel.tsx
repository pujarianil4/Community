import { getRandomImageLink } from "@/utils/helpers";
import React from "react";
import "./index.scss";
import Post from "./post";
export default function RightPanel() {
  return (
    <div className='rightpanel_container'>
      <div className='createCommunity'>
        <p> Come here to check in with your favorite community</p>
        <button>Create Commumity</button>
      </div>
      <div className='recentposts'>
        <span className='title'>Recent Posts</span>
        {Array(3)
          .fill(() => 0)
          .map(() => (
            <Post />
          ))}
      </div>
    </div>
  );
}
