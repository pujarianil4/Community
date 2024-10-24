"use client";
import React, { useState } from "react";
import "./index.scss";
import CInput from "../common/Input";
import { IoSearch } from "react-icons/io5";
import CButton from "../common/Button";
import { AddIcon } from "@/assets/icons";
// import { Modal } from "antd";
// import CreateProposal from "./createProposal";
import ProposalList from "./proposalList";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface IPrpos {
  cid: number;
  cname: string;
}
export default function Proposals({ cid, cname }: IPrpos) {
  const router = useRouter();
  // const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  const [refetchProposal, setRefetchProposal] = useState(false);
  // const handleCreateProposal = () => {
  //   setIsProposalModalOpen(true);
  // };

  const handleRedirect = () => {
    router.push(`/p/create-proposal?community=${cname}&id=${cid}`);
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
          <CButton onClick={handleRedirect}>
            <AddIcon /> Create Proposal
          </CButton>
        </section>
        <ProposalList
          cid={cid}
          refetchProposal={refetchProposal}
          setRefetchProposal={setRefetchProposal}
        />
      </main>
      {/* <Modal
        className='create_proposal_modal'
        open={isProposalModalOpen}
        onCancel={() => setIsProposalModalOpen(false)}
        footer={<></>}
        centered
      >
        <CreateProposal
          setIsProposalModalOpen={setIsProposalModalOpen}
          cname={cname}
          cid={cid}
          setRefetchProposal={setRefetchProposal}
        />
      </Modal> */}
    </>
  );
}
