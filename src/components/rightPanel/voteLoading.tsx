import PageLoader from "@/components/common/loaders/pageLoader";
import React from "react";
import "./index.scss";
export default function Loading() {
  return (
    <div className=''>
      <div className='range_bar_data skeleton'></div>
      <div className='range_bar_data skeleton'></div>
      <div className='range_bar_data skeleton'></div>
      <div className='range_bar_data skeleton'></div>
    </div>
  );
}
