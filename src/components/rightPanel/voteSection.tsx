"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CButton from "../common/Button";
import { fetchProposalByID, voteToProposal } from "@/services/api/api";
import { IVoteProposalPayload } from "@/utils/types/types";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import NotificationMessage from "../common/Notification";
import { RangeBar } from "../proposals/proposalItem";
import useAsync from "@/hooks/useAsync";

export default function VoteSection() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const {
    isLoading,
    data: proposalData,
    refetch,
  } = useAsync(fetchProposalByID, proposalId);

  const proposalVote = (state: RootState) => state?.common?.proposal;
  const [{ dispatch, actions }, [proposalVoteData]] = useRedux([proposalVote]);
  // const { isVoted, yes, no } = proposalVoteData;
  // const { isVoted, up: yes, down: no } = proposalData;
  const [value, setValue] = useState<string>(proposalData?.isVoted && "yes");

  const handleVote = async (value: string) => {
    const payload: IVoteProposalPayload = {
      pid: +proposalId,
      typ: value,
    };
    try {
      await voteToProposal(payload);
      dispatch(
        actions.setProposalData(
          value == "yes"
            ? { isVoted: true, yes: proposalData?.yes, no: proposalData?.no }
            : { isVoted: false, yes: proposalData?.yes, no: proposalData?.no }
        )
      );
      refetch();
    } catch (error: any) {
      NotificationMessage("error", error.response.data.message);
    }
  };

  return (
    <section className='vote_section'>
      <p>Cast ypur Vote</p>
      <CButton
        className={`option ${value == "yes" ? "yes" : ""}`}
        // onClick={() => setValue("yes")}
        onClick={() => {
          handleVote("yes");
          setValue("yes");
        }}
      >
        Yes
      </CButton>
      <CButton
        className={`option ${value == "no" ? "no" : ""}`}
        // onClick={() => setValue("no")}
        onClick={() => {
          handleVote("no");
          setValue("no");
        }}
      >
        No
      </CButton>
      {/* <CButton className='option abstain'>Abstain</CButton> */}
      {/* <CButton className='vote_btn' onClick={handleVote}>
        Vote
      </CButton> */}
      {/* {isLoading ? (
        <div className='votes'>
          <div className='range_bar_data skeleton'></div>
          <div className='range_bar_data skeleton'></div>
        </div>
      ) :(  */}
      <div className='votes'>
        <div className='range_bar_data'>
          <div className='range_data'>
            <p>Yes</p>
            <p className='yes'>
              {proposalData?.up || 0}
              {proposalData?.up < 2 ? `vote` : ` votes`}
            </p>
          </div>
          <RangeBar
            total={proposalData?.up + proposalData?.down}
            current={proposalData?.up}
          />
        </div>
        <div className='range_bar_data'>
          <div className='range_data'>
            <p>No</p>
            <p className='no'>
              {proposalData?.down < 2
                ? `${proposalData?.down} vote`
                : `${proposalData?.down} votes`}
            </p>
          </div>
          <RangeBar
            total={proposalData?.up + proposalData?.down}
            current={proposalData?.down}
          />
        </div>
      </div>
      {/* )} */}
    </section>
  );
}
