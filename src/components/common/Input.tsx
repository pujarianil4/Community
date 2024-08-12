import { Input } from "antd";
import React from "react";
import "./index.scss";

interface ICInput {
  className?: string;
  [key: string]: any; // Allows additional props
}

export default function CInput({ className, ...props }: ICInput) {
  return <Input className={`CInput ${className}`} {...props} />;
}
