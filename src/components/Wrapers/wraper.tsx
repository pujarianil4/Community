import React from "react";
import "./index.scss";
export default function Wraper({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className='wraper'>{children}</div>;
}
