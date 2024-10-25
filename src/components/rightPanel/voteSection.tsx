"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import CButton from "../common/Button";
import { fetchProposalByID, voteToProposal } from "@/services/api/proposalApi";
import { IVoteProposalPayload } from "@/utils/types/types";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import NotificationMessage from "../common/Notification";
import { RangeBar } from "../proposals/proposalItem";
import useAsync from "@/hooks/useAsync";
import VoteLoading from "./voteLoading";
import { formatNumber } from "@/utils/helpers";
export default function VoteSection() {
  const { proposalId } = useParams<{ proposalId: string }>();
  const {
    isLoading,
    data: proposalData,
    refetch,
  } = useAsync(fetchProposalByID, proposalId);

  console.log("proposalData", proposalData);

  const proposalVote = (state: RootState) => state?.common?.proposal;
  const [{ dispatch, actions }, [proposalVoteData]] = useRedux([proposalVote]);
  // const { isVoted, up, down } = proposalVoteData;
  // const { isVoted, up: up, down: down } = proposalData;
  const [value, setValue] = useState<string>(proposalData?.isVoted && "up");

  const handleVote = async (value: string) => {
    const payload: IVoteProposalPayload = {
      pid: +proposalId,
      typ: value,
    };
    try {
      await voteToProposal(payload);
      dispatch(
        actions.setProposalData(
          value == "up"
            ? { isVoted: true, up: proposalData?.up, down: proposalData?.down }
            : { isVoted: false, up: proposalData?.up, down: proposalData?.down }
        )
      );
      refetch();
    } catch (error: any) {
      NotificationMessage("error", error.response.data.message);
    }
  };

  return (
    <section className='vote_section'>
      <p>Cast your Vote</p>
      {isLoading ? (
        <VoteLoading />
      ) : (
        <>
          <CButton
            className={`option ${value == "up" ? "yes" : ""}`}
            // onClick={() => setValue("up")}
            onClick={() => {
              handleVote("up");
              setValue("up");
            }}
          >
            Yes
          </CButton>
          <CButton
            className={`option ${value == "down" ? "no" : ""}`}
            // onClick={() => setValue("down")}
            onClick={() => {
              handleVote("down");
              setValue("down");
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
                  {proposalData?.up > 0 ? formatNumber(+proposalData?.up) : 0}
                  {proposalData?.up < 2 ? ` vote` : ` votes`}
                </p>
              </div>
              <RangeBar
                total={Number(proposalData?.up) + Number(proposalData?.down)}
                current={Number(proposalData?.up)}
              />
            </div>
            <div className='range_bar_data'>
              <div className='range_data'>
                <p>No</p>
                <p className='no'>
                  {proposalData?.down > 0
                    ? formatNumber(proposalData?.down)
                    : 0}
                  {proposalData?.down < 2 ? ` vote` : ` votes`}
                </p>
              </div>
              <RangeBar
                total={Number(proposalData?.up) + Number(proposalData?.down)}
                current={Number(proposalData?.down)}
              />
            </div>
          </div>
        </>
      )}
      {/* )} */}
    </section>
  );
}
