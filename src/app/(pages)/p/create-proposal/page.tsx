import React from "react";
import "./index.scss";
import PageWraper from "@/components/Wrapers/PageWraper";
import CreateProposal from "./createProposal";

interface IProps {
  params?: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function ProposalPage({ searchParams }: IProps) {
  const { community, id } = searchParams;
  return (
    <PageWraper hideRightPanel>
      <CreateProposal cid={Number(id)} cname={community as string} />
    </PageWraper>
  );
}
