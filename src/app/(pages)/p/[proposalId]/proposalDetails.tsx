"use client";
import React, { useEffect } from "react";
import { ShareIcon } from "@/assets/icons";
import CButton from "@/components/common/Button";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import { getImageSource, timeAgo } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import useRedux from "@/hooks/useRedux";
import useAsync from "@/hooks/useAsync";
import { fetchProposalByID } from "@/services/api/api";

interface IProps {
  proposalId: string;
}
export default function ProposalDetails({ proposalId }: IProps) {
  const { isLoading, data: proposalData } = useAsync(
    fetchProposalByID,
    proposalId
  );

  const [{ dispatch, actions }] = useRedux();

  useEffect(() => {
    dispatch(actions.setProposalVote(proposalData?.isVoted));
  }, [proposalData]);

  return (
    <>
      {proposalData && (
        <main className='proposal_page_container'>
          <section className='proposal_content'>
            <h1>Proposal</h1>
            <section className='proposal_section'>
              <div className='proposal_head'>
                <h2>{proposalData?.title}</h2>
                <div>
                  <CButton className='active'>Active</CButton>
                  <p className='post_time'> {timeAgo(proposalData?.cta)}</p>
                </div>
              </div>
              <div className='user_head'>
                <div>
                  <Link
                    href={`c/${proposalData?.community?.username}`}
                    as={`/c/${proposalData?.community?.username}`}
                  >
                    <Image
                      src={getImageSource(
                        proposalData?.community?.img?.pro,
                        "c"
                      )}
                      alt={proposalData?.community?.name || "community"}
                      width={24}
                      height={24}
                      loading='lazy'
                    />
                    <p>{proposalData?.community?.username}</p>
                  </Link>
                  <Link
                    href={`u/${proposalData?.user?.username}`}
                    as={`/u/${proposalData?.user?.username}`}
                  >
                    <Image
                      src={getImageSource(proposalData?.user?.img?.pro, "u")}
                      alt={proposalData?.user?.name || "user"}
                      width={24}
                      height={24}
                      loading='lazy'
                    />
                    <p>{proposalData?.user?.username}</p>
                  </Link>
                </div>
                <CButton>
                  <ShareIcon />
                  Share
                </CButton>
              </div>
              <MarkdownRenderer markdownContent={proposalData?.desc} />
            </section>
          </section>
        </main>
      )}
    </>
  );
}