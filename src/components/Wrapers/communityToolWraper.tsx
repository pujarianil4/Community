import React, { ReactNode } from "react";
import Wraper from "./wraper";

import MainPanel from "./mainPanel";
import Navbar from "../navbar/navbar";
import RightPanel from "../rightPanel/RightPanel";
import SideBar from "../sidebar/Sidebar";
import "./index.scss";
import RightPanelWrapper from "./RightSideWrapper";
import DashBoardSideBar from "../communityTools/Sidebar/Sidebar";
interface PageWrapperProps {
  children: ReactNode;
  hideRightPanel?: boolean;
  // mainPanelClass?: string;
}

export default function CommunityToolWraper({
  children,
  hideRightPanel,
}: // mainPanelClass,
PageWrapperProps) {
  return (
    <div className='pagewraper'>
      <Navbar />
      <Wraper>
        <DashBoardSideBar />
        <MainPanel className={`${hideRightPanel ? "hidden_right_panel" : ""}`}>
          {children}
        </MainPanel>
        {!hideRightPanel && <RightPanel />}
      </Wraper>
    </div>
  );
}
