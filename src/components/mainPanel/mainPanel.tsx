import React from "react";
import "./index.scss";
import CreatePost from "./createPost/CreatePost";
import PostCard from "../postCard/PostCard";

export default function MainPanel() {
  return (
    <div className='main_panel_container'>
      <CreatePost />
      <PostCard />
    </div>
  );
}
