// "use client";
import React, { useEffect } from "react";
import { ShareIcon } from "@/assets/icons";
import CButton from "@/components/common/Button";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { IProposal } from "@/utils/types/types";
import Image from "next/image";
import Link from "next/link";
import useRedux from "@/hooks/useRedux";

interface IProps {
  proposal: IProposal;
}
export default function ProposalDetails({ proposal }: IProps) {
  const { cta: time, title, isVoted, desc, user, community } = proposal;

  console.log("Proposal", proposal);
  //
  const [{ dispatch, actions }] = useRedux();

  // useEffect(() => {
  dispatch(actions.setProposalVote(isVoted));
  // }, [proposal]);

  return (
    <main className='proposal_page_container'>
      <section className='proposal_content'>
        <h1>Proposal</h1>
        <section className='proposal_section'>
          <div className='proposal_head'>
            <h2>{title}</h2>
            <div>
              <CButton className='active'>Active</CButton>
              <p className='post_time'> {timeAgo(time)}</p>
            </div>
          </div>
          <div className='user_head'>
            <div>
              <Link
                href={`c/${community?.username}`}
                as={`/c/${community?.username}`}
              >
                <Image
                  src={getImageSource(community?.img?.pro, "c")}
                  alt={community?.name || "community"}
                  width={24}
                  height={24}
                  loading='lazy'
                />
                <p>{community?.username}</p>
              </Link>
              <Link href={`u/${user?.username}`} as={`/u/${user?.username}`}>
                <Image
                  src={getImageSource(user?.img?.pro, "u")}
                  alt={user?.name || "user"}
                  width={24}
                  height={24}
                  loading='lazy'
                />
                <p>{user?.username}</p>
              </Link>
            </div>
            <CButton>
              <ShareIcon />
              Share
            </CButton>
          </div>
          <MarkdownRenderer markdownContent={desc} />
        </section>
      </section>
    </main>
  );
}
