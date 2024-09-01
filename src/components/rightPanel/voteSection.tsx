"use client";
import React from "react";
import CButton from "../common/Button";

export default function VoteSection() {
  // TODO get params to vote at selected proposal
  return (
    <section className='vote_section'>
      <p>Cast ypur Vote</p>
      <CButton className='option yes'>Yes</CButton>
      <CButton className='option no'>No</CButton>
      <CButton className='option abstain'>Abstain</CButton>
      <CButton className='vote_btn'>Vote</CButton>
    </section>
  );
}
