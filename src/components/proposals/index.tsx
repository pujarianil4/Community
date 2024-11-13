"use client";
import React, { useCallback, useState } from "react";
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
import { debounce } from "@/utils/helpers";
import { Tooltip } from "antd";
interface IPrpos {
  cid: number;
  cname: string;
  enableCreate: boolean;
}
export default function Proposals({ cid, cname, enableCreate }: IPrpos) {
  const router = useRouter();
  const [refetchProposal, setRefetchProposal] = useState(false);
  const [searchVal, setSearchVal] = useState("");
  // const [isProposalModalOpen, setIsProposalModalOpen] = useState(false);
  // const handleCreateProposal = () => {
  //   setIsProposalModalOpen(true);
  // };

  const handleRedirect = () => {
    router.push(`/p/create-proposal?community=${cname}&id=${cid}`);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchVal(value);
      setRefetchProposal(true);
    }, 300),
    []
  );

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(event.target.value);
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
              onChange={handleSearch}
            />
          </div>

          <Tooltip
            title={
              !enableCreate ? "Join the community to create a proposal" : ""
            }
            placement='top'
          >
            <div>
              <CButton
                onClick={enableCreate ? handleRedirect : undefined}
                className='btn'
                disabled={!enableCreate}
              >
                <AddIcon /> Create Proposal
              </CButton>
            </div>
          </Tooltip>
        </section>
        <ProposalList
          cid={cid}
          refetchProposal={refetchProposal}
          setRefetchProposal={setRefetchProposal}
          search={searchVal}
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
