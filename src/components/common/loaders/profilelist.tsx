import React from "react";
import "./index.scss";
export default function ProfilelistLoader() {
  return (
    <div className='profilelist_loader'>
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
      <div className='profile'>
        <div className='img skeleton'></div>
        <div className='content skeleton'></div>
      </div>
    </div>
  );
}
