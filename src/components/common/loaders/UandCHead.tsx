import "./index.scss";

import React from "react";

import "./index.scss";
import CButton from "../Button";

export default function UandCHeadLoader() {
  return (
    <div className='userhead_cotainer_loader'>
      <div className='info'>
        <div>
          <div className='img skeleton'></div>
          <h4 className='skeleton'></h4>
          <span></span>
        </div>
        <div className='btn skeleton'></div>
      </div>
      <div className='content'>
        <div className='statics'>
          <div className='skeleton'></div>
          <div className='skeleton'></div>
          <div className='skeleton'></div>
        </div>
        <div className='overview skeleton'>
          <p></p>
        </div>
      </div>
    </div>
  );
}
