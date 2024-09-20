"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import CButton from "../common/Button";
import { voteToProposal } from "@/services/api/api";
import { IVoteProposalPayload } from "@/utils/types/types";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";

export default function VoteSection() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const [value, setValue] = useState<number>(0);

  const proposalVote = (state: RootState) => state?.common.proposalVote;
  const [{ dispatch, actions }, [proposalVoteData]] = useRedux([proposalVote]);

  const handleVote = async () => {
    const payload: IVoteProposalPayload = {
      pid: +proposalId,
      value: 1,
    };
    await voteToProposal(payload);
    dispatch(actions.setProposalVote(value == 1 ? true : false));
  };
  return (
    <section className='vote_section'>
      <p>Cast ypur Vote</p>
      <CButton
        className={`option ${value == 1 ? "yes" : ""}`}
        onClick={() => setValue(1)}
      >
        Yes
      </CButton>
      <CButton
        className={`option ${value == -1 ? "no" : ""}`}
        onClick={() => setValue(-1)}
      >
        No
      </CButton>
      {/* <CButton className='option abstain'>Abstain</CButton> */}
      <CButton className='vote_btn' onClick={handleVote}>
        Vote
      </CButton>
    </section>
  );
}
