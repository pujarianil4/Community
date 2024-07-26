import React from "react";
import "./index.scss";
import CreatePost from "../createPost/CreatePost";
import FeedCard from "../feedPost/feedPost";
import UserHead from "../userHead/UserHead";

export default function MainPanel({ children }: any) {
  return (
    <div className='main_panel_container'>
      {/* <CreatePost />
      <FeedCard />
      <UserHead /> */}
      {children}
    </div>
  );
}
