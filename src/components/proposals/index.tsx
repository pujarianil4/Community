"use client";
import React, { useState } from "react";
import "./index.scss";
import ProposalItem from "./proposalItem";
import CInput from "../common/Input";
import { IoSearch } from "react-icons/io5";
import CButton from "../common/Button";
import { AddIcon } from "@/assets/icons";
import { Modal } from "antd";
import CreateProposal from "./createProposal";

export default function Proposals() {
  const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const handleCreateProposal = () => {
    setIsProposalModalOpen(true);
  };
  return (
    <>
      <main className='proposal_container'>
        <section className='controls'>
          <div className='search_container'>
            <CInput
              prefix={<IoSearch />}
              placeholder='Search Proposal Here'
              className='search'
            />
          </div>
          <CButton onClick={handleCreateProposal}>
            <AddIcon /> Create Proposal
          </CButton>
        </section>
        <ProposalItem />
        <ProposalItem />
        <ProposalItem />
      </main>
      <Modal
        className='create_proposal_modal'
        open={isProposalModalOpen}
        onCancel={() => setIsProposalModalOpen(false)}
        footer={<></>}
        centered
      >
        <CreateProposal setIsProposalModalOpen={setIsProposalModalOpen} />
      </Modal>
    </>
  );
}
