import React, { ReactNode } from "react";
import "./index.scss";

interface IProps {
  children: ReactNode;
}

export default function MainPanel({ children }: IProps) {
  return <main className='main_panel_container'>{children}</main>;
}
