import React from "react";
import "./index.scss";

interface ICustomInput {
  className?: string;
  [key: string]: any; // Allows additional props
}

export default function CustomInput({ className, ...props }: ICustomInput) {
  return <input className={`customInput ${className}`} {...props} />;
}
