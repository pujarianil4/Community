"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import CButton from "../common/Button";
import { voteToProposal } from "@/services/api/api";
import { IVoteProposalPayload } from "@/utils/types/types";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import NotificationMessage from "../common/Notification";

export default function VoteSection() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const [value, setValue] = useState<string>("yes");

  const proposalVote = (state: RootState) => state?.common.proposalVote;
  const [{ dispatch, actions }, [proposalVoteData]] = useRedux([proposalVote]);

  const handleVote = async () => {
    const payload: IVoteProposalPayload = {
      pid: +proposalId,
      typ: value,
    };
    try {
      await voteToProposal(payload);
      dispatch(actions.setProposalVote(value == "yes" ? true : false));
    } catch (error: any) {
      NotificationMessage("error", error.response.data.message);
    }
  };
  return (
    <section className='vote_section'>
      <p>Cast ypur Vote</p>
      <CButton
        className={`option ${value == "yes" ? "yes" : ""}`}
        onClick={() => setValue("yes")}
      >
        Yes
      </CButton>
      <CButton
        className={`option ${value == "no" ? "no" : ""}`}
        onClick={() => setValue("no")}
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
