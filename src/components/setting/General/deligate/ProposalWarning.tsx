import React from "react";
import { Modal } from "antd";
import CButton from "@/components/common/Button";
import "../index.scss";

interface IProposalWarning {
  onClose: () => void;
  isModalOpen: boolean;
  onProceed: () => void;
}

export default function ProposalWarning({
  onClose,
  isModalOpen,
  onProceed,
}: IProposalWarning) {
  return (
    <Modal
      className='proposal_modal'
      open={isModalOpen}
      onCancel={onClose}
      footer={<></>}
      centered
    >
      <ProposalWarningModal onClose={onClose} onProceed={onProceed} />
    </Modal>
  );
}

export function ProposalWarningModal({
  onClose,
  onProceed,
}: {
  onClose: () => void;
  onProceed: () => void;
}) {
  // const closeBtn = document.querySelector(".ant-modal-close");

  const handleCancelDelegate = () => {
    onClose();
  };
  const handleProceedDelegate = () => {
    // TODO: Add feature to remove all votes and proceed to delegation
    onProceed();
  };
  return (
    <main className='proposal_warning_container'>
      <p>
        You have votes on active proposals, deligationg to a different account
        your votes will cancel by choosing a different delegate account.
      </p>
      <div>
        <CButton className='btn' onClick={handleCancelDelegate}>
          cancel
        </CButton>
        <CButton className='btn' onClick={handleProceedDelegate}>
          proceed any way
        </CButton>
      </div>
    </main>
  );
}
