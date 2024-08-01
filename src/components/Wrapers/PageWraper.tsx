import React, { ReactNode } from "react";
import Wraper from "./wraper";
import LeftPanel from "../leftPanel/LeftPanel";
import MainPanel from "./mainPanel";
import Navbar from "../navbar/navbar";
import RightPanel from "../rightPanel/RightPanel";
import SideBar from "../sidebar/Sidebar";
interface PageWrapperProps {
  children: ReactNode;
  hideRightPanel?: boolean;
}

export default function PageWraper({
  children,
  hideRightPanel,
}: PageWrapperProps) {
  return (
    <>
      <Navbar />
      <Wraper>
        {/* <LeftPanel /> */}
        <SideBar />
        <MainPanel>{children}</MainPanel>
        {!hideRightPanel && <RightPanel />}
      </Wraper>
    </>
  );
}
