"use client";
import React, { useCallback, useEffect, useState } from "react";
import ProposalItem from "./proposalItem";
import useAsync from "@/hooks/useAsync";
import {
  fetchProposalsByCId,
  fetchSearchProposal,
} from "@/services/api/proposalApi";
import { IProposal } from "@/utils/types/types";
import EmptyData from "../common/Empty";
import ProposalItemLoader from "./proposalItemLoader";
import VirtualList from "../common/virtualList";
import { debounce } from "@/utils/helpers";

interface IProps {
  cid: number;
  refetchProposal: boolean;
  setRefetchProposal: React.Dispatch<React.SetStateAction<boolean>>;
  search?: string;
}
export default function ProposalList({
  cid,
  refetchProposal,
  setRefetchProposal,
  search,
}: IProps) {
  const [page, setPage] = useState<number>(1);
  const [proposals, setProposals] = useState<IProposal[]>([]);
  const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(
    search
  );
  const limit = 10;

  const updateDebouncedSearch = useCallback(
    debounce((value: string) => {
      setDebouncedSearch(value);
    }, 300),
    []
  );

  const fetchMethod =
    debouncedSearch && debouncedSearch?.length > 2
      ? fetchSearchProposal
      : fetchProposalsByCId;
  const {
    isLoading,
    data: proposalsData,
    refetch,
  } = useAsync(fetchMethod, {
    cid,
    search: debouncedSearch,
    page,
    limit,
  });

  // TODO: due to create proposal seperate page not using this refech method
  // useEffect(() => {
  //   if (refetchProposal) {
  //     refetch();
  //     setRefetchProposal(false);
  //   }
  // }, [refetchProposal]);

  useEffect(() => {
    if (search) refetch();
  }, [search]);

  useEffect(() => {
    updateDebouncedSearch(search || "");
  }, [search, updateDebouncedSearch]);

  useEffect(() => {
    let data = Array.isArray(proposalsData)
      ? proposalsData
      : proposalsData?.proposals;
    if (data && data?.length > 0) {
      if (page === 1) {
        setProposals(data);
      } else {
        setProposals((prevPosts) => [...prevPosts, ...data]);
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
    <div className='proposal_List'>
      {/* {!isLoading ? (
        proposalsData?.length > 0 ? (
          proposalsData?.map((proposal: IProposal) => (
            <ProposalItem key={proposal.id} proposal={proposal} />
          ))
        ) : (
          <EmptyData />
        )
      ) : (
        Array(3)
          .fill(() => 0)
          .map((_, i) => <ProposalItemLoader key={i} />)
      )} */}
      <VirtualList
        listData={proposals}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        limit={limit}
        renderComponent={(index: number, proposal: IProposal) => (
          <ProposalItem key={index} proposal={proposal} />
        )}
        footerHeight={120}
      />
      {isLoading && page > 1 && <ProposalItemLoader />}
      {!isLoading && proposals.length === 0 && <EmptyData />}
    </div>
  );
}
