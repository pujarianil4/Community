import React, { ReactNode } from "react";
import Wraper from "./wraper";

import MainPanel from "./mainPanel";
import Navbar from "../navbar/navbar";
import RightPanel from "../rightPanel/RightPanel";
import SideBar from "../sidebar/Sidebar";
import "./index.scss";
import RightPanelWrapper from "./RightSideWrapper";
interface PageWrapperProps {
  children: ReactNode;
  hideRightPanel?: boolean;
  // mainPanelClass?: string;
}

export default function PageWraper({
  children,
  hideRightPanel,
}: // mainPanelClass,
PageWrapperProps) {
  return (
    <div className='pagewraper'>
      <Navbar />
      <Wraper>
        {/* <SideBar /> */}
        <MainPanel className={`${hideRightPanel ? "hidden_right_panel" : ""}`}>
          {children}
        </MainPanel>
        {!hideRightPanel && <RightPanel />}
      </Wraper>
    </div>
  );
}
