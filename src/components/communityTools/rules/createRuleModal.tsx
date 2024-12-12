"use client";
import React, { useEffect, useState } from "react";
import "./rules.scss";
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
import CInput from "@/components/common/Input";

interface UserBanForm {
  description: string | undefined;
  rule: string | undefined;
}

interface BanModelProps {
  isModalOpen: boolean;
  onClose: () => void;
  editData?: UserBanForm;
  onSubmit?: (data: UserBanForm) => void;
  submitButtonText?: string;
}

export const CreateRuleModal = ({
  isModalOpen,
  onClose,
  editData,
  onSubmit,
  submitButtonText = "Create Rule",
}: BanModelProps) => (
  <Modal
    open={isModalOpen}
    onCancel={onClose}
    className='community-model'
    footer={null}
  >
    <RuleModal
      onClose={onClose}
      submitButtonText={submitButtonText}
      editData={editData}
      onSubmit={onSubmit}
    />
  </Modal>
);

const RuleModal = ({
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
    rule: "",
    description: "",
  });

  console.log("edit data", editData);
  const userNameSelector = (state: RootState) => state?.user;
  const [{ dispatch, actions }, [user]] = useRedux([userNameSelector]);
  const userId = user?.profile?.id;

  useEffect(() => {
    if (editData) {
      setForm({
        rule: editData.rule ?? "",
        description: editData.description ?? "",
      });
    }
  }, [editData]);

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const isFormValid = () => {
    return form.rule?.trim() !== "" && form.description?.trim() !== "";
  };

  const handleCreateRule = async () => {
    try {
      onSubmit?.(form);
      // await callFunction(createCommunity, form);
      // NotificationMessage("success", "Community Created");
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
        <span className='label'>Rule*</span>
        <CInput value={form.rule} placeholder='Add Rule Name' />
      </div>

      <div className='info'>
        <span className='label'>Description</span>
        <textarea
          rows={5}
          name='modNote'
          value={form.description ?? ""}
          onChange={handleFormChange}
          placeholder='Add a note for moderators (optional)'
        />
      </div>

      <div className='btns'>
        <CButton disabled={!isFormValid()} onClick={handleCreateRule}>
          {submitButtonText}
        </CButton>
      </div>
    </div>
  );
};
