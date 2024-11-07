"use client";
import React, { useState } from "react";
import General from "@/components/setting/General/General";
import { RootState } from "@/contexts/store";
import { IUser } from "@/utils/types/types";
import useRedux from "@/hooks/useRedux";
import CButton from "@/components/common/Button";
import { SignUpModal } from "@/components/common/auth/signUpModal";

export default function WalletsPage() {
  const userNameSelector = (state: RootState) => state?.user;
  const [{}, [{ profile, isLoading, error }]] = useRedux([userNameSelector]);
  const userProfile: IUser = profile;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState(3);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
    setModalTab(1);
  };
  return (
    <div className='wallete_page'>
      {error || (!userProfile.id && !isLoading) ? (
        <div className='login'>
          <h2>Please connect your wallet</h2>
          <CButton auth='auth' onClick={showModal}>
            LogIn
          </CButton>
        </div>
      ) : (
        <General />
      )}
      <SignUpModal
        modalTab={modalTab}
        setModalTab={setModalTab}
        handleCancel={handleCancel}
        isModalOpen={isModalOpen}
      />
    </div>
  );
}
