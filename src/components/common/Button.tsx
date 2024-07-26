import React from "react";
import "./index.scss";

interface ICButton {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  size?: number | string;
}

export default function CButton({
  children,
  size,
  onClick,
  className,
}: ICButton) {
  return (
    <button
      style={{ fontSize: `${size}px` }}
      onClick={onClick}
      className={`CButton ${className}`}
    >
      {children}
    </button>
  );
}
