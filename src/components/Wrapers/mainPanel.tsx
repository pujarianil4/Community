import React from "react";
import "./index.scss";
import CreatePost from "../createPost/CreatePost";
import FeedCard from "../feedPost/feedPost";
import UserHead from "../userHead/UserHead";

export default function MainPanel({ children, hideScroll }: any) {
  return (
    <div
      style={hideScroll ? { overflow: "hidden" } : {}}
      className='main_panel_container'
    >
      {/* <CreatePost />
      <FeedCard />
      <UserHead /> */}
      {children}
    </div>
  );
}
