import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { getClientSideCookie } from "@/utils/helpers";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { Button } from "antd";
import React, { useState } from "react";
import AuthModal from "./auth/AuthModal";
import { SignUpModal } from "./auth/signUpModal";
import "./index.scss";

interface ICButton {
  children: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  size?: number | string;
  loading?: boolean;
  disabled?: boolean;
  auth?: "auth" | "linkAddress";
  icon?: any;
}

export default function CButton({
  children,
  size,
  onClick,
  className,
  loading,
  disabled,
  auth,
  icon,
}: ICButton) {
  const commonSelector = (state: RootState) => state?.common;
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [{ dispatch, actions }] = useRedux();
  const [modalTab, setModalTab] = useState(3);
  // const [{}, [common]] = useRedux([commonSelector]);
  const handleAction = () => {
    const user = getClientSideCookie("authToken");

    if (auth == "auth") {
      onClick?.();
      return;
    }
    // else if (user && auth == "linkAddress") {
    //   dispatch(actions.setWalletRoute("linkWallet"));
    //   setIsModalOpen(true);
    //   return;
    // }
    // console.log("usere", user);

    if (!user) {
      setIsModalOpen(true);
    } else {
      onClick?.();
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    return;
    // onClick?.();
  };

  return (
    <>
      <Button
        loading={loading}
        icon={icon}
        disabled={disabled}
        style={{ fontSize: `${size}px` }}
        onClick={handleAction}
        className={`CButton ${className}`}
      >
        {children}
      </Button>
      <SignUpModal
        modalTab={modalTab}
        setModalTab={setModalTab}
        handleCancel={closeModal}
        isModalOpen={isModalOpen}
      />
    </>
  );
}
