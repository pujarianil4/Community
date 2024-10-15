import React from "react";
import { Modal } from "antd";
import CButton from "@/components/common/Button";

interface IProposalWarning {
  onClose: () => void;
  isModalOpen: boolean;
}

export default function ProposalWarning({
  onClose,
  isModalOpen,
}: IProposalWarning) {
  return (
    <Modal
      className='proposal_modal'
      open={isModalOpen}
      onCancel={onClose}
      footer={<></>}
      centered
    >
      <ProposalWarningModal onClose={onClose} />
    </Modal>
  );
}

export function ProposalWarningModal({ onClose }: { onClose: () => void }) {
  // const closeBtn = document.querySelector(".ant-modal-close");

  const handleCancelDelegate = () => {
    onClose();
  };
  const handleProceedDelegate = () => {
    // TODO: Add feature to remove all votes and proceed to delegation
  };
  return (
    <main className='proposal_warning_container'>
      <p>
        You have votes on active proposals, deligationg to a different account
        your votes will cancel by choosing a different delegate account.
      </p>
      <div>
        <CButton onClick={handleCancelDelegate}>cancel</CButton>
        <CButton onClick={handleProceedDelegate}>proceed any way</CButton>
      </div>
    </main>
  );
}
