import React from "react";
import { Popover } from "antd";
import "./index.scss";
import { PiDotsThreeBold } from "react-icons/pi";
import { timeAgo } from "@/utils/helpers";
// Define the structure of a notification
interface Notification {
  id: number;
  message: string;
  cta: string;
}

interface NotificationProps {
  notifications: Notification;
}

export default function notify({ notifications }: NotificationProps) {
  const { message, cta, id } = notifications;

  const content = (
    <div
      onClick={() => console.log("Turned off notification type")}
      className='turn_off'
    >
      Turn off this type of notification
    </div>
  );

  return (
    <div className='notification-container'>
      <div className='notification-list'>
        <div className='notification-item'>
          <div className='noti_ox'>
            <div className='noti_inn'>
              <span className='avatar_bx'>
                <span className='avatar_inn'>
                  <img
                    src='https://testcommunity.s3.amazonaws.com/67c9729d-b9b8-4936-9f13-111e4a917f71-Group%2030094.png'
                    alt='avatar for notification'
                    className='avatar'
                  />
                </span>
              </span>
            </div>
          </div>
          <div className='text_ox'>
            <div className='title'>
              <span className='text_bx'>
                {id} replied to your post in postuser
              </span>
              <span className='time'>
                <span> • </span>
                {timeAgo(cta)}
              </span>
            </div>
            <div className='message'>{message}</div>
          </div>
          <div className='more_btn'>
            <Popover content={content} trigger='click' placement='bottomRight'>
              <PiDotsThreeBold style={{ cursor: "pointer" }} />
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
