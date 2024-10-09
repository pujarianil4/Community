import React from "react";
import type { Metadata, ResolvingMetadata } from "next";
import "./index.scss";
import PageWraper from "@/components/Wrapers/PageWraper";
import ProposalDetails from "./proposalDetails";
import { getProposalForMeta } from "@/services/api/proposalApi";
import markdownToTxt from "markdown-to-txt";

interface IProps {
  params: any;
}

export default async function ProposalPage({ params }: IProps) {
  const { proposalId } = params;
  console.log("proposalid", proposalId);
  return (
    <PageWraper>
      <ProposalDetails proposalId={proposalId} />
    </PageWraper>
  );
}

export async function generateMetadata(
  { params }: IProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { proposalId } = params;
  console.log("pid", proposalId);
  try {
    const proposal = await getProposalForMeta(proposalId);
    console.log("proposal data", proposal);

    // with external package
    const postTitle2 = markdownToTxt(proposal.title || "Welcome to Community");
    const postDescription2 = markdownToTxt(
      proposal.desc || "Community for connecting web3 users"
    );

    // const postImage =
    //   proposal?.media[0] ||
    //   "https://testcommunity.s3.ap-south-1.amazonaws.com/ee27b86d-e9a6-4320-b240-33e4ab8d5306-38636.jpg";

    // const previousImages = (await parent)?.openGraph?.images || [];

    return {
      title: postTitle2,
      description: postDescription2,
      // openGraph: {
      //   images: [postImage, ...previousImages],
      // },
    };
  } catch (error) {
    console.error("Failed to fetch proposal data", error);
    return {
      title: "Error fetching proposal",
      description: "Could not fetch the proposal details.",
    };
  }
}
