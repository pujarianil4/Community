"use client";
import React from "react";
import "./index.scss";
import PageWraper from "@/components/Wrapers/PageWraper";
import { fetchProposalByID } from "@/services/api/api";
import ProposalDetails from "./proposalDetails";

interface IProps {
  params: any;
}

// TODO: Create seperate button for Active button
export default async function ProposalPage({ params }: IProps) {
  const { proposalId } = params;
  const proposalData = await fetchProposalByID(proposalId);

  return (
    <PageWraper>
      <ProposalDetails proposal={proposalData} />
    </PageWraper>
  );
}
