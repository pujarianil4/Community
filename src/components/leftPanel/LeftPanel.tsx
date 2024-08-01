import React from "react";
import "./leftpanel.scss";
import { GoHome } from "react-icons/go";
import { PiMegaphone } from "react-icons/pi";

export default function LeftPanel() {
  return (
    <div className='left_container'>
      <div className='active'>
        <GoHome size={20} />
        <h4>Home</h4>
      </div>
      <div>
        <PiMegaphone size={20} />
        <h4>Popular</h4>
      </div>
      <hr />
      <div>
        <GoHome size={20} />
        <h4>Communities</h4>
      </div>
      <div>
        <GoHome size={20} />
        <h4>Advertise</h4>
      </div>
      <div>
        <GoHome size={20} />
        <h4>Home</h4>
      </div>
      <div>
        <GoHome size={20} />
        <h4>Popular</h4>
      </div>
    </div>
  );
}
