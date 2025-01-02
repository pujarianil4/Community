import React from "react";

import "./index.scss";
import { PiDotsThreeBold } from "react-icons/pi";
import { Popover } from "antd";
// Define the structure of a notification
interface Notification {
  id: number;
  message: string;
}

interface NotificationProps {
  notifications: Notification[];
}

const Notification: React.FC<NotificationProps> = ({ notifications }) => {
  console.log("notifications", notifications);

  const content = (
    <div>
      <p
        onClick={() => console.log("Turned off notification type")}
        style={{ cursor: "pointer", margin: 0 }}
      >
        Turn off this type of notification
      </p>
    </div>
  );

  return (
    <div className='notification-container'>
      <div className='notification-header'>
        <h3>Notifications</h3>
      </div>

      <div className='notification-list'>
        {notifications.length === 0 ? (
          <p>No notifications available.</p>
        ) : (
          // Correctly map over the notifications
          notifications.map((notification) => (
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
                    username replied to your post in postuser
                  </span>
                  <span className='time'>
                    <span> • </span>
                    <time
                      dateTime='2024-11-13T10:27:08.000Z'
                      title='Wednesday, November 13, 2024 at 3:57:08 PM GMT+5:30'
                      className=''
                    >
                      Nov 13
                    </time>
                  </span>
                </div>
                <div className='message'>{notification.message}</div>
              </div>
              <div className='more_btn'>
                <Popover
                  content={content}
                  trigger='click'
                  placement='bottomRight'
                >
                  <PiDotsThreeBold style={{ cursor: "pointer" }} />
                </Popover>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
