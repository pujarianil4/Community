import React from "react";
import "./index.scss";

interface ICInput {
  className?: string;
  [key: string]: any; // Allows additional props
}

export default function CInput({ className, ...props }: ICInput) {
  return <input className={`CInput ${className}`} {...props} />;
}
