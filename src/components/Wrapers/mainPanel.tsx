import React from "react";
import "./index.scss";
import CreatePost from "../createPost/CreatePost";
import FeedCard from "../feedPost/feedPost";
import UserHead from "../userHead/UserHead";

export default function MainPanel({ children, hideScroll }: any) {
  console.log("hideScroll", hideScroll);

  return (
    <div
      style={hideScroll ? { overflow: "hidden" } : { overflow: "auto" }}
      className='main_panel_container'
    >
      {/* <CreatePost />
      <FeedCard />
      <UserHead /> */}
      {children}
    </div>
  );
}
