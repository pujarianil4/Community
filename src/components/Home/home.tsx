import React from "react";
import LeftPanel from "../leftPanel/LeftPanel";
import Wraper from "./wraper";

export default function HomeComponent() {
  return (
    <Wraper>
      <LeftPanel />
    </Wraper>
  );
}
