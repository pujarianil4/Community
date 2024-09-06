"use client";
import React, { useState, useEffect } from "react";
import { Modal, Input, Button } from "antd";
import CButton from "../Button";
import CInput from "../Input";

interface LinkModalProps {
  visible: boolean;
  selectedText?: string;
  onCreate: (text: string, href: string) => void;
  onCancel: () => void;
}

export const LinkModal: React.FC<LinkModalProps> = ({
  visible,
  selectedText = "",
  onCreate,
  onCancel,
}) => {
  const [linkText, setLinkText] = useState<string>(selectedText);
  const [linkHref, setLinkHref] = useState<string>("");

  useEffect(() => {
    setLinkText(selectedText);
  }, [selectedText]);

  const handleCreate = () => {
    if (linkText && linkHref) {
      onCreate(linkText, linkHref);
      setLinkText("");
      setLinkHref("");
    }
  };

  const handleCancel = () => {
    onCancel();
    setLinkText("");
    setLinkHref("");
  };

  return (
    <Modal
      title='Add Hyperlink'
      open={visible}
      onCancel={onCancel}
      className='link_Modal'
      footer={[
        <CButton className='cancel' key='cancel' onClick={handleCancel}>
          Cancel
        </CButton>,
        <CButton className='create' key='create' onClick={handleCreate}>
          Create
        </CButton>,
      ]}
    >
      <CInput
        placeholder='Link Text'
        value={linkText}
        onChange={(e: any) => setLinkText(e.target.value)}
      />
      <CInput
        placeholder='Link URL'
        value={linkHref}
        onChange={(e: any) => setLinkHref(e.target.value)}
        style={{ marginTop: 10 }}
      />
    </Modal>
  );
};
