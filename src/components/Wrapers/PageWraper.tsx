import React, { ReactNode } from "react";
import Wraper from "./wraper";

import MainPanel from "./mainPanel";
import Navbar from "../navbar/navbar";
import RightPanel from "../rightPanel/RightPanel";
import SideBar from "../sidebar/Sidebar";
import "./index.scss";
interface PageWrapperProps {
  children: ReactNode;
  hideRightPanel?: boolean;
  hideScroll?: boolean;
}

export default function PageWraper({
  children,
  hideRightPanel,
  hideScroll,
}: PageWrapperProps) {
  return (
    <div className='pagewraper'>
      <Navbar />
      <Wraper>
        <SideBar />
        <MainPanel>{children}</MainPanel>
        {!hideRightPanel && <RightPanel />}
      </Wraper>
    </div>
  );
}
