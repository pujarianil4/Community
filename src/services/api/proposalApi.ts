import { ICreateProposalPayload, IVoteProposalPayload } from "@/utils/types/types";
import { store } from "@contexts/store";
import { api } from "./api";



// Create Proposal
export const createProposal = async (payload: ICreateProposalPayload) => {
  try {
    const { data } = await api.post(`/governance/proposal`, payload);
    console.log("New Proposal Created");
    return data;
  } catch (error) {
    console.error("Proposal Error", error);
    throw error;
  }
};


// Fetch All Proposals
export const fetchAllProposals = async ({
  page = 1,
  limit = 10,
}: {
  page: number;
  limit: number;
}) => {
  const uid = store.getState().user?.uid;
  try {
    const { data } = await api.get(
      `/governance/proposal?page=${page}&limit=${limit}&uid=${uid}`
    );
    return data;
  } catch (error) {
    console.error("Fetch Proposals Error", error);
    throw error;
  }
};

// Vote on Proposal
export const voteToProposal = async (payload: IVoteProposalPayload) => {
  try {
    const { data } = await api.post(`/governance/vote`, payload);
    console.log("Proposal Vote");
    return data;
  } catch (error) {
    console.error("Vote Proposal Error", error);
    throw error;
  }
};

// fetch proposal by id
export const fetchProposalByID = async (proposalId: number) => {
  const uid = store.getState().user?.uid;
  try {
    const { data } = await api.get(
      `/governance/proposal/${proposalId}?uid=${uid}`
    );

    return Array.isArray(data) ? data[0] : data;
  } catch (error) {
    console.error("Fetch_ProposalByID_Error", error);
    throw error;
  }
};

// fetch proposals by community id
export const fetchProposalsByCId = async ({
  cid,
  page = 1,
  limit = 10,
}: {
  cid: number;
  page: number;
  limit: number;
}) => {
  const uid = store.getState().user?.uid;
  try {
    const { data } = await api.get(
      `/governance/proposal/c/${cid}?page=${page}&limit=${limit}&uid=${uid}`
    );
    return data;
  } catch (error) {
    console.error("Fetch_Proposals_Error", error);
    throw error;
  }
};
