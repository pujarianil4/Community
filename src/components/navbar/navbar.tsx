import { ConnectButton } from "@rainbow-me/rainbowkit";
import React from "react";
import "./navbar.scss";

export default function Navbar() {
  return (
    <nav className='nav_container'>
      <div></div>
      <div>
        <a href=''>Home</a>
        <a href=''>Stats</a>
      </div>
      <div>
        <ConnectButton />
      </div>
    </nav>
  );
}
