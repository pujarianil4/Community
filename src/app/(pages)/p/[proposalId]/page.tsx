"use client";
import React from "react";
import "./index.scss";
import PageWraper from "@/components/Wrapers/PageWraper";
import CButton from "@/components/common/Button";
import { getImageSource, timeAgo } from "@/utils/helpers";
import Link from "next/link";
import Image from "next/image";
import { ShareIcon } from "@/assets/icons";
import MarkdownRenderer from "@/components/common/MarkDownRender";

export default function ProposalPage() {
  const time = "2024-08-28T12:54:59.918Z";
  const community = {
    id: 1,
    username: "UnilendOfficial",
    name: "Unilend",
    ticker: "UNO",
    logo: "https://picsum.photos/300/300?random=1",
    metadata: "This is our official community.",
    pCount: 6,
    followers: 0,
    tSupply: 0,
    sts: 1,
    cta: "2024-08-28T12:43:06.494Z",
    uta: "2024-08-28T12:43:06.494Z",
  };

  const user = {
    id: 1,
    username: "im_mangesh",
    name: "Mangesh",
    img: "https://picsum.photos/300/300?random=2",
    pcount: 6,
    tid: null,
    did: null,
    desc: null,
    sts: 1,
    cta: "2024-08-28T12:41:03.323Z",
    uta: "2024-08-28T12:41:03.323Z",
  };
  const content = `
  ### Details
  
  1: [ENS Public Resolver](https://example.com), 
  0x6774Bcbd5ceCeF1336b5300fb5186a12DDD8b367,
  0x70C62C8b8e801124A4Aa81ce07b637A3e83cb919.
  
  ### Description
  ## Deploy Uniswap V3 on Scroll
  
  After a successful temperature check as well as deployments of Uniswap
  V3 on both our Alpha and Sepolia testnets, Scroll looks to move towards
  a final governance proposal to officially approve Scroll’s Uniswap V3
  deployment on its newly launched mainnet.
  
  - Scroll is a bytecode-compatible zk-rollup, a native zkEVM scaling
  solution for Ethereum.
  
  - Scroll is an open-source project developed in collaboration with the
  Ethereum Foundation Privacy and Scaling Explorations organization. It
  was built with the community, for the community.
  
  - Our community ethos and vision are aligned with Ethereum. We are
  committed to a secure, decentralized, censorship-resistant, and
  efficient future that Ethereum offers through our plans to
  decentralize Scroll sequencers and provers.
  
  - **Proposers:** Scroll Foundation
  `;
  return (
    <PageWraper>
      <main className='proposal_page_container'>
        <section className='proposal_content'>
          <h1>Proposal</h1>
          <section className='proposal_section'>
            <div className='proposal_head'>
              <h2>Governance Proposal for UniLend v2 Deployment on Arbitrum</h2>
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
                    src={getImageSource(community?.logo)}
                    alt={community.name || "community"}
                    width={24}
                    height={24}
                    loading='lazy'
                  />
                  <p>{community?.username}</p>
                </Link>
                <Link href={`u/${user?.username}`} as={`/u/${user?.username}`}>
                  <Image
                    src={getImageSource(user?.img)}
                    alt={user.name || "user"}
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
            <MarkdownRenderer markdownContent={content} />
          </section>
        </section>
        {/* <section className='vote_section'>
          <p>Cast ypur Vote</p>
          <CButton className='option yes'>Yes</CButton>
          <CButton className='option no'>No</CButton>
          <CButton className='option abstain'>Abstain</CButton>
          <CButton className='vote_btn'>Vote</CButton>
        </section> */}
      </main>
    </PageWraper>
  );
}
