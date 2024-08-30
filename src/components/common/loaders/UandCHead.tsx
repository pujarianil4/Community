import "./index.scss";

import React from "react";

import "./index.scss";
import CButton from "../Button";

export default function UandCHeadLoader() {
  return (
    // <div className='userhead_cotainer_loader'>
    //   <div className='info'>
    //     <div>
    //       <div className='img skeleton'></div>
    //       <h4 className='skeleton'></h4>
    //       <span></span>
    //     </div>
    //     <div className='btn skeleton'></div>
    //   </div>
    //   <div className='content'>
    //     <div className='statics'>
    //       <div className='skeleton'></div>
    //       <div className='skeleton'></div>
    //       <div className='skeleton'></div>
    //     </div>
    //     <div className='overview skeleton'>
    //       <p></p>
    //     </div>
    //   </div>
    // </div>
    <div className='userhead_cotainer_loader'>
      <div className='cover_photo skeleton'></div>
      <div className='details'>
        <div className='detailed_data'>
          <div className='box user'>
            <div className='avatar skeleton'></div>
            <div className='user_name'>
              <h4 className='skeleton'></h4>
              <p className='skeleton'></p>
            </div>
          </div>
          <div className='stats box'>
            <p className='skeleton'></p>
            <h4 className='skeleton'></h4>
          </div>
          <div className='stats box'>
            <p className='skeleton'></p>
            <h4 className='skeleton'></h4>
          </div>
          <div className='stats box'>
            <p className='skeleton'></p>
            <h4 className='skeleton'></h4>
          </div>
        </div>
        <div className='activity'>
          <p className='skeleton'></p>
          <button className='skeleton'></button>
        </div>
        <div className='socials'>
          <div className='logo skeleton'></div>
          <div className='logo skeleton'></div>
          <div className='logo skeleton'></div>
        </div>
      </div>
    </div>
  );
}
