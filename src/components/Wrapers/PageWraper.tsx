import React from "react";
import Wraper from "./wraper";
import LeftPanel from "../leftPanel/LeftPanel";
import MainPanel from "./mainPanel";
import Navbar from "../navbar/navbar";
import RightPanel from "../rightPanel/RightPanel";

export default function PageWraper({ children }: any) {
  return (
    <>
      <Navbar />
      <Wraper>
        <LeftPanel />
        <MainPanel>{children}</MainPanel>
        <RightPanel />
      </Wraper>
    </>
  );
}
