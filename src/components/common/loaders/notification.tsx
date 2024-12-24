import React from "react";
import "./index.scss";
export default function notificationLoader() {
  return (
    <div className='notification_loader'>
      <div className='profile'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
      <div className='profile'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
      <div className='profile'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
    </div>
  );
}
