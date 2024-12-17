"use client";
import React, { useEffect, useState } from "react";
import "./banned.scss";
import CButton from "../../common/Button";
import useAsync from "@/hooks/useAsync";
import NotificationMessage from "../../common/Notification";
import { Modal } from "antd";
import DropdownWithSearch from "../../common/dropdownWithSearch";
import { createCommunity } from "@/services/api/communityApi";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import { allUser } from "@/services/api/userApi";
import { IUser } from "@/utils/types/types";
interface UserBanForm {
  user: string | null | undefined;
  rule: string | null | undefined;
  duration: string | null | undefined;
  modNote: string | null | undefined;
  msg: string | null | undefined;
}

interface BanModelProps {
  isModalOpen: boolean;
  onClose: () => void;
  initialData?: UserBanForm;
  onSubmit?: (data: UserBanForm) => void;
  submitButtonText?: string;
}

export const CreateMuteModal = ({
  isModalOpen,
  onClose,
  initialData = {
    user: "",
    rule: "",
    duration: "",
    modNote: "",
    msg: "",
  },
  onSubmit,
  submitButtonText = "Ban User",
}: BanModelProps) => (
  <Modal
    open={isModalOpen}
    onCancel={onClose}
    className='community-model'
    footer={null}
  >
    <MuteModal onClose={onClose} submitButtonText={submitButtonText} />
  </Modal>
);

export const MuteModal = ({
  onClose,
  submitButtonText,
}: {
  onClose: () => void;
  submitButtonText: string;
}) => {
  const [form, setForm] = useState<UserBanForm>({
    user: "",
    rule: "",
    duration: "",
    modNote: "",
    msg: "",
  });

  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);
  const userId = user?.profile?.id;
  const { error, isLoading, data, refetch, callFunction } = useAsync(
    allUser,
    userId
  );
  console.log("get all user", data);
  const [selectedOption, setSelectedOption] = useState<IUser | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState<string>("");
  const [durationSearchTerm, setDurationSearchTerm] = useState<string>("");

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleDropdownSelect = (field: keyof UserBanForm, value: string) => {
    setForm((prevForm) => ({ ...prevForm, [field]: value }));
  };

  const isFormValid = () => {
    return selectedOption !== null && form.duration?.trim() !== "";
  };
  console.log("isform", isFormValid());
  const handleMuteUser = async () => {
    try {
      await callFunction(createCommunity, form);
      NotificationMessage("success", "Community Created");
      onClose();
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message?.[0] || "Please enter valid values.";
      NotificationMessage("error", errorMessage);
    }
  };

  return (
    <div className='user_container'>
      <div className='info'>
        <span className='label'>User*</span>
        <DropdownWithSearch
          onSelect={setSelectedOption}
          options={data}
          searchTerm={userSearchTerm}
          setSearchTerm={setUserSearchTerm}
          selected={selectedOption}
          placeholder='Search and Select User'
        />
      </div>

      <div className='info'>
        <span className='label'>Duration*</span>
        <DropdownWithSearch
          onSelect={(value) => handleDropdownSelect("duration", value)}
          options={["1 Week", "1 Month", "Permanent"]}
          searchTerm={durationSearchTerm}
          setSearchTerm={setDurationSearchTerm}
          selected={form.duration}
          placeholder='Select Duration'
          isStringArray
        />
      </div>
      <div className='info'>
        <span className='label'>Moderator Note</span>
        <textarea
          rows={5}
          name='modNote'
          value={form.modNote ?? ""}
          onChange={handleFormChange}
          placeholder='Add a note for moderators (optional)'
        />
      </div>
      <div className='btns'>
        <CButton
          disabled={!isFormValid()}
          onClick={handleMuteUser}
          loading={isLoading}
        >
          Mute
        </CButton>
      </div>
    </div>
  );
};
