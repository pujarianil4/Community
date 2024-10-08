import React, { ReactNode } from "react";
import "./index.scss";

interface IProps {
  children: ReactNode;
  className?: string;
}

export default function MainPanel({ children, className }: IProps) {
  return (
    <main className={`main_panel_container ${className}`}>{children}</main>
  );
}
