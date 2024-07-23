import React from "react";
import LeftPanel from "../leftPanel/LeftPanel";
import MainPanel from "../mainPanel/mainPanel";
import Wraper from "./wraper";

export default function HomeComponent() {
  return (
    <Wraper>
      <LeftPanel />
      <MainPanel />
    </Wraper>
  );
}
