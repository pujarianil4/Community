import PageLoader from "@/components/common/loaders/pageLoader";
import React from "react";
import "./index.scss";
export default function Loading() {
  return (
    <div className='proposal_loader'>
      <div className='proposal_head'>
        <div className='skeleton heading'></div>
        <div>
          <div className='skeleton status'> </div>
          <div className='skeleton time'> </div>
        </div>
      </div>

      <div className='user_head'>
        <div>
          <div className='avatar skeleton'> </div>
          <div className=' skeleton text'> </div>
          <div className='avatar skeleton'> </div>
          <div className=' skeleton text'> </div>
        </div>
        <p className=' skeleton btn'> </p>
      </div>
      <div className='content'>
        <div className='skeleton'></div>
      </div>
    </div>
  );
}
