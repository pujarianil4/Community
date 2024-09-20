import React from "react";
import "./index.scss";
import PageWraper from "@/components/Wrapers/PageWraper";
import ProposalDetails from "./proposalDetails";

interface IProps {
  params: any;
}

export default async function ProposalPage({ params }: IProps) {
  const { proposalId } = params;

  return (
    <PageWraper>
      <ProposalDetails proposalId={proposalId} />
    </PageWraper>
  );
}
