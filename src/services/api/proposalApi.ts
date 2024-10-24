import { IProposalForm, IVoteProposalPayload } from "@/utils/types/types";
import { store } from "@contexts/store";
import { api } from "./api";

// Create Proposal
export const createProposal = async (payload: IProposalForm) => {
  // TODO: pass direct payload after create proposal API update
  const tempPayload = {
    title: payload?.title,
    desc: payload?.desc,
    cid: payload?.cid,
    validity: payload?.validity?.end,
  };
  try {
    const { data } = await api.post(`/governance/proposal`, tempPayload);
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
  const uid = store.getState().user?.profile?.id;
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
  const uid = store.getState().user?.profile?.id;
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

// fetch proposal by id for metadata
export const getProposalForMeta = async (pId: number) => {
  try {
    const response = await api.get(`/governance/proposal/${pId}`);
    const data = response.data;
    return data;
  } catch (error) {
    console.error("GET_POSTS_ERROR", error);
    return null;
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
  const uid = store.getState().user?.profile?.id;
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

export const fetchVotedProposalsByUname = async ({
  uname,
  page = 1,
  limit = 10,
}: {
  uname: string;
  page: number;
  limit: number;
}) => {
  try {
    const { data } = await api.get(`/governance/vote/u/${uname}`);
    return data;
  } catch (error) {
    console.error("Fetch_Voted_Proposals_Error", error);
    throw error;
  }
};

export const revokeProposals = async (pid: number[] = []) => {
  console.log("PID", pid);
  let url = `/governance/vote/revoke`;
  if (pid.length > 0) {
    const queryParam = encodeURIComponent(JSON.stringify(pid));
    url += `?pid=${queryParam}`;
  }
  try {
    const { data } = await api.delete(url);
    return data;
  } catch (error) {
    console.error("Fetch_Voted_Proposals_Error", error);
    throw error;
  }
};

export const fetchSearchProposal = async ({
  cid,
  search,
  page = 1,
  limit = 10,
}: {
  cid: number;
  search: string;
  page: number;
  limit: number;
}) => {
  if (search?.length < 3) return null;
  const uid = store.getState().user?.profile?.id;
  try {
    const { data } = await api.get(
      `/search/inProposal?cid=${cid}&keyword=${search}&page=${page}&limit=${limit}&uid=${uid}`
    );
    return data;
  } catch (error) {
    console.error("Search_Proposal_Error", error);
    throw error;
  }
};
