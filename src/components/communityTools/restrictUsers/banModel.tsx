"use client";
import React, { useEffect, useState } from "react";
import "./banned.scss";
import CButton from "../../common/Button";
import useAsync from "@/hooks/useAsync";
import NotificationMessage from "../../common/Notification";
import { Modal } from "antd";
import DropdownWithSearch from "../../common/dropdownWithSearch";
import { createCommunity } from "@/services/api/communityApi";

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

export const BanModel = ({
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
    <CreateCommunity onClose={onClose} />
  </Modal>
);

export const CreateCommunity = ({ onClose }: { onClose: () => void }) => {
  const [form, setForm] = useState<UserBanForm>({
    user: "",
    rule: "",
    duration: "",
    modNote: "",
    msg: "",
  });

  const [ruleSearchTerm, setRuleSearchTerm] = useState<string>("");
  const [durationSearchTerm, setDurationSearchTerm] = useState<string>("");

  const { isLoading, callFunction } = useAsync();

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
      form.user?.trim() !== "" &&
      form.rule?.trim() !== "" &&
      form.duration?.trim() !== ""
    );
  };

  const handleCreateCommunity = async () => {
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
    <div className='create_community_container'>
      <div className='info'>
        <span className='label'>User*</span>
        <input
          type='text'
          name='user'
          value={form.user ?? ""}
          onChange={handleFormChange}
          placeholder='Enter Username'
        />
      </div>
      <div className='info'>
        <span className='label'>Violation*</span>
        <DropdownWithSearch
          onSelect={(value) => handleDropdownSelect("rule", value)}
          options={["Rule 1: Spam", "Rule 2: Harassment"]}
          searchTerm={ruleSearchTerm} // Use specific search term for rule dropdown
          setSearchTerm={setRuleSearchTerm} // Use specific setter for rule search term
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
          searchTerm={durationSearchTerm} // Use specific search term for duration dropdown
          setSearchTerm={setDurationSearchTerm} // Use specific setter for duration search term
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
          onClick={handleCreateCommunity}
          loading={isLoading}
        >
          Ban User
        </CButton>
      </div>
    </div>
  );
};
