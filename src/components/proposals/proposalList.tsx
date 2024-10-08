"use client";
import React, { useEffect, useState } from "react";
import ProposalItem from "./proposalItem";
import useAsync from "@/hooks/useAsync";
import { fetchProposalsByCId } from "@/services/api/proposalApi";
import { IProposal } from "@/utils/types/types";
import EmptyData from "../common/Empty";
import ProposalItemLoader from "./proposalItemLoader";
import { Virtuoso } from "react-virtuoso";
import VirtualList from "../common/virtualList";

interface IProps {
  cid: number;
  refetchProposal: boolean;
  setRefetchProposal: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function ProposalList({
  cid,
  refetchProposal,
  setRefetchProposal,
}: IProps) {
  const [page, setPage] = useState<number>(1);
  const [proposals, setProposals] = useState<IProposal[]>([]);
  const limit = 10;
  const {
    isLoading,
    data: proposalsData,
    refetch,
  } = useAsync(fetchProposalsByCId, {
    cid,
    page,
    limit,
  });

  useEffect(() => {
    if (refetchProposal) {
      refetch();
      setRefetchProposal(false);
    }
  }, [refetchProposal]);

  useEffect(() => {
    if (proposalsData && proposalsData?.length > 0) {
      setProposals((prevPosts) => [...prevPosts, ...proposalsData]);
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
      {/* <Virtuoso
        data={proposals}
        // totalCount={200} // add this if we know total count of posts and remove below condition
        endReached={() => {
          if (
            !isLoading &&
            proposals.length % limit === 0 &&
            proposals.length / limit === page
          ) {
            setPage((prevPage) => prevPage + 1);
          }
        }}
        itemContent={(index, proposal) => (
          <ProposalItem key={proposal.id} proposal={proposal} />
        )}
        className='virtuoso'
      /> */}
      <VirtualList
        listData={proposals}
        isLoading={isLoading}
        page={page}
        setPage={setPage}
        limit={limit}
        renderComponent={(index: number, proposal: IProposal) => (
          <ProposalItem key={proposal.id} proposal={proposal} />
        )}
        footerHeight={80}
      />
      {isLoading && page > 1 && <ProposalItemLoader />}
      {!isLoading && proposals.length === 0 && <EmptyData />}
    </div>
  );
}
