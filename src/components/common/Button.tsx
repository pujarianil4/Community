import React from "react";
import "./index.scss";

interface ICustomButton {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  size?: number | string;
}

export default function CustomButton({
  children,
  size,
  onClick,
  className,
}: ICustomButton) {
  return (
    <button
      style={{ fontSize: `${size}px` }}
      onClick={onClick}
      className={`customButton ${className}`}
    >
      {children}
    </button>
  );
}
