/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import EmptyData from "@/components/common/Empty";
import ProposalItem from "@/components/proposals/proposalItem";
import ProposalItemLoader from "@/components/proposals/proposalItemLoader";
import useAsync from "@/hooks/useAsync";
import { fetchProposalsByCId } from "@/services/api/proposalApi";
import { IProposal } from "@/utils/types/types";
import VirtualList from "../../common/virtualList";
import CInput from "@/components/common/Input";
import { IoSearch } from "react-icons/io5";
import "./index.scss";
import CButton from "@/components/common/Button";

export default function ProposalVotes() {
  const [page, setPage] = useState<number>(1);
  const [proposals, setProposals] = useState<IProposal[]>([]);
  const limit = 10;
  const [selectedProposals, setSelectedProposals] = useState<
    Map<number, boolean>
  >(new Map());
  // TODO: Update API as pe my votes
  const {
    isLoading,
    data: proposalsData,
    refetch,
  } = useAsync(fetchProposalsByCId, {
    cid: 2,
    page,
    limit,
  });

  const selectedCount = selectedProposals.size;

  const handleSelectChange = (id: number, selected: boolean) => {
    setSelectedProposals((prev) => {
      const updatedSelected = new Map(prev);
      updatedSelected.set(id, selected);
      return updatedSelected;
    });
  };

  const handleSelectAll = () => {
    const allSelected = selectedProposals.size === proposals.length;
    const newSelected = new Map<number, boolean>();
    if (!allSelected) {
      proposals.forEach((proposal) => {
        newSelected.set(proposal.id, true);
      });
    }
    setSelectedProposals(newSelected);
  };

  const handleDevote = () => {
    const newSelected = new Map<number, boolean>();
    setSelectedProposals(newSelected);
  };

  useEffect(() => {
    if (proposalsData && proposalsData?.length > 0) {
      if (page === 1) {
        setProposals(proposalsData);
      } else {
        setProposals((prevPosts) => [...prevPosts, ...proposalsData]);
      }
    }
  }, [proposalsData]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  if (page < 2 && isLoading) {
    return Array(3)
      .fill(() => 0)
      .map((_: any, i: number) => <ProposalItemLoader key={i} />);
  }
  return (
    <>
      <div className='votes_head'>
        <div className='search_container'>
          <CInput
            prefix={<IoSearch />}
            placeholder='Search Proposal Here'
            className='search'
          />
        </div>
        <div>
          <CButton className='select_all' onClick={handleSelectAll}>
            {selectedCount !== 0 && selectedCount} Select All
          </CButton>
          <CButton
            disabled={selectedProposals.size === 0}
            onClick={handleDevote}
          >
            Devote
          </CButton>
        </div>
      </div>
      <VirtualList
        listData={proposals}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        limit={limit}
        renderComponent={(index: number, proposal: IProposal) => (
          <ProposalItem
            key={index}
            proposal={proposal}
            showCheckbox
            onSelectChange={handleSelectChange}
            isChecked={selectedProposals.get(proposal.id) || false}
          />
        )}
        footerHeight={120}
      />
      {isLoading && page > 1 && <ProposalItemLoader />}
      {!isLoading && proposals.length === 0 && <EmptyData />}
    </>
  );
}
