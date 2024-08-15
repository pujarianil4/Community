import { getClientSideCookie } from "@/utils/helpers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "antd";
import React from "react";
import "./index.scss";

interface ICButton {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  size?: number | string;
  loading?: boolean;
  disabled?: boolean;
}

export default function CButton({
  children,
  size,
  onClick,
  className,
  loading,
  disabled,
}: ICButton) {
  const { openConnectModal } = useConnectModal();
  const handleAction = () => {
    const user = getClientSideCookie("authToken");

    if (!user) {
      openConnectModal?.();
    } else {
      onClick?.();
    }
  };

  return (
    <Button
      loading={loading}
      disabled={disabled}
      style={{ fontSize: `${size}px` }}
      onClick={handleAction}
      className={`CButton ${className}`}
    >
      {children}
    </Button>
  );
}
