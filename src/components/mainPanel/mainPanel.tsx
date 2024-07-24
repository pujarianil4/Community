import React from "react";
import "./index.scss";
import CreatePost from "./createPost/CreatePost";

export default function MainPanel() {
  return (
    <div className='main_panel_container'>
      <CreatePost />
    </div>
  );
}
