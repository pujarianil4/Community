"use client";
import React, { useState } from "react";

import EmptyData from "@/components/common/Empty";
import "./index.scss";
import Notify from "@/components/common/notifications/notify";
import VirtualList from "@/components/common/virtualList";
import { IoSettingsOutline } from "react-icons/io5";
import { Popover, Switch } from "antd";

interface NotificationFilter {
  post: boolean;
  comment: boolean;
  mention: boolean;
  upvotesPost: boolean;
  upvotesComment: boolean;
  followers: boolean;
}

export default function Notifications() {
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState<NotificationFilter>({
    post: true,
    comment: true,
    mention: true,
    upvotesPost: true,
    upvotesComment: true,
    followers: true,
  });

  const isLoading = false;
  const notificationsData = [
    { id: 1, type: "post", message: "Your post received a new comment!" },
    {
      id: 2,
      type: "others",
      message: "Your profile was updated successfully.",
    },
    { id: 3, type: "post", message: "New follower added to your profile!" },
    { id: 4, type: "comment", message: "Someone replied to your comment." },
    { id: 5, type: "upvotesPost", message: "System maintenance notification." },
    {
      id: 5,
      type: "upvotesComment",
      message: "System maintenance notification.",
    },
    { id: 6, type: "mention", message: "for post" },
    { id: 6, type: "followers", message: "you have new follower" },
  ];

  const filteredNotifications = notificationsData.filter(
    (notification) => filter[notification.type as keyof NotificationFilter]
  );

  const handleFilterChange = (type: keyof NotificationFilter) => {
    setFilter((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // const settingsContent = (
  //   <div className='settings-popup'>
  //     <div className='filter_bx' onClick={() => handleFilterChange("post")}>
  //       <span> Posts</span>
  //       <Checkbox checked={filter.post}></Checkbox>
  //     </div>

  //     <div className='filter_bx' onClick={() => handleFilterChange("comment")}>
  //       <span> Comments</span>
  //       <Checkbox checked={filter.comment}></Checkbox>
  //     </div>

  //     <div className='filter_bx' onClick={() => handleFilterChange("others")}>
  //       <span> Others</span>
  //       <Checkbox checked={filter.others}></Checkbox>
  //     </div>
  //   </div>
  // );

  const settingsContent = (
    <div className='settings-popup'>
      <div className='filter_bx' onClick={() => handleFilterChange("post")}>
        <span> Posts</span>
        <Switch checked={filter.post} />
      </div>

      <div className='filter_bx' onClick={() => handleFilterChange("comment")}>
        <span> Comments</span>
        <Switch checked={filter.comment} />
      </div>

      <div className='filter_bx' onClick={() => handleFilterChange("mention")}>
        <span>Mentions of u/username</span>
        <Switch checked={filter.mention} />
      </div>
      <div
        className='filter_bx'
        onClick={() => handleFilterChange("upvotesPost")}
      >
        <span> Upvotes Post</span>
        <Switch checked={filter.upvotesPost} />
      </div>
      <div
        className='filter_bx'
        onClick={() => handleFilterChange("upvotesComment")}
      >
        <span> Upvotes Comment</span>
        <Switch checked={filter.upvotesComment} />
      </div>
      <div
        className='filter_bx'
        onClick={() => handleFilterChange("followers")}
      >
        <span> New Follower</span>
        <Switch checked={filter.followers} />
      </div>
    </div>
  );

  return (
    <div className='notfy_container'>
      <div className='main_text'>
        <h3>Notifications</h3>

        <Popover
          content={settingsContent}
          trigger='click'
          placement='bottomRight'
        >
          <IoSettingsOutline size={25} />
        </Popover>
      </div>
      {!isLoading && filteredNotifications?.length === 0 ? (
        <EmptyData />
      ) : (
        <VirtualList
          listData={filteredNotifications}
          isLoading={isLoading}
          page={1}
          setPage={setPage}
          limit={4}
          renderComponent={(index: number, post: any) => (
            <Notify key={index} notifications={post} />
          )}
          footerHeight={150}
        />
      )}
    </div>
  );
}
