"use client";
import React, { useState } from "react";
import CInput from "../common/Input";
import CButton from "../common/Button";
import Image from "next/image";
import { DropdownLowIcon } from "@/assets/icons";
import TiptapEditor from "../common/tiptapEditor";

interface IProps {
  setIsProposalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function CreateProposal({ setIsProposalModalOpen }: IProps) {
  const [content, setContent] = useState<string>("");
  const handleTokenList = () => {
    console.log("HANDLE_TOKEN_LIST");
  };
  return (
    <main className='create_proposal_container'>
      <label htmlFor='Title'>Title</label>
      <CInput className='input_container' placeholder='' />
      <label htmlFor='To'>To</label>
      <div className='address_container'>
        <CInput
          className='input_container'
          placeholder='Wallet Address or ENS name'
        />
        <div className='dropdown' onClick={handleTokenList}>
          <Image
            src='https://picsum.photos/300/300?random=1'
            alt='logo'
            width={20}
            height={20}
            loading='lazy'
          />
          <p>UFT</p>
          <DropdownLowIcon width={10} height={10} />
        </div>
      </div>
      <CInput className='input_container' placeholder='0' />
      <label htmlFor='Description'>Description</label>
      <div className='input_container description'>
        <TiptapEditor content={content} setContent={setContent} />
      </div>
      <CButton className='proposal_btn'>Save</CButton>
    </main>
  );
}
