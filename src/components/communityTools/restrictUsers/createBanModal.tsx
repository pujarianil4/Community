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
  editData?: UserBanForm;
  onSubmit?: (data: UserBanForm) => void;
  submitButtonText?: string;
}

export const CreateBanModel = ({
  isModalOpen,
  onClose,
  editData,
  onSubmit,
  submitButtonText = "Ban User",
}: BanModelProps) => (
  <Modal
    open={isModalOpen}
    onCancel={onClose}
    className='community-model'
    footer={null}
  >
    <BanModal
      onClose={onClose}
      submitButtonText={submitButtonText}
      editData={editData}
      onSubmit={onSubmit}
    />
  </Modal>
);

export const BanModal = ({
  onClose,
  submitButtonText,
  editData,
  onSubmit,
}: {
  onClose: () => void;
  submitButtonText: string;
  editData?: UserBanForm;
  onSubmit?: (data: UserBanForm) => void;
}) => {
  const [form, setForm] = useState<UserBanForm>({
    user: "",
    rule: "",
    duration: "",
    modNote: "",
    msg: "",
  });

  console.log("edit data", editData);
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
  const [ruleSearchTerm, setRuleSearchTerm] = useState<string>("");
  const [durationSearchTerm, setDurationSearchTerm] = useState<string>("");

  useEffect(() => {
    if (editData) {
      setForm({
        user: editData.user ?? "",
        rule: editData.rule ?? "",
        duration: editData.duration ?? "",
        modNote: editData.modNote ?? "",
        msg: editData.msg ?? "",
      });
      if (editData.user) {
        setSelectedOption({ username: editData.user });
      }
    }
  }, [editData]);

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
    return (
      selectedOption !== null &&
      form.rule?.trim() !== "" &&
      form.duration?.trim() !== ""
    );
  };

  const handleBanUser = async () => {
    try {
      await callFunction(createCommunity, form);
      NotificationMessage("success", "ban user successfully");
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
        <span className='label'>Violation*</span>
        <DropdownWithSearch
          onSelect={(value) => handleDropdownSelect("rule", value)}
          options={["Rule 1: Spam", "Rule 2: Harassment"]}
          searchTerm={ruleSearchTerm}
          setSearchTerm={setRuleSearchTerm}
          selected={form.rule}
          placeholder='Select Rule'
          isStringArray
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
      <div className='info'>
        <span className='label'>Message to User</span>
        <textarea
          rows={5}
          name='msg'
          value={form.msg ?? ""}
          onChange={handleFormChange}
          placeholder='Message to the user (optional)'
        />
      </div>
      <div className='btns'>
        <CButton
          disabled={!isFormValid()}
          onClick={handleBanUser}
          loading={isLoading}
        >
          {submitButtonText}
        </CButton>
      </div>
    </div>
  );
};
