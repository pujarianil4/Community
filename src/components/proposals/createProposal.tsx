"use client";
import React, { useState } from "react";
import CInput from "../common/Input";
import CButton from "../common/Button";
import TiptapEditor from "../common/tiptapEditor";
import { IProposalForm } from "@/utils/types/types";
import { createProposal } from "@/services/api/proposalApi";
import NotificationMessage from "../common/Notification";
import TurndownService from "turndown";

interface IProps {
  setIsProposalModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cname: string;
  cid: number;
  setRefetchProposal: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function CreateProposal({
  setIsProposalModalOpen,
  cname,
  cid,
  setRefetchProposal,
}: IProps) {
  const today = new Date().toISOString().slice(0, 10);
  const initialProposal = {
    title: "",
    desc: "",
    cid: cid,
    validity: today,
  };
  const [content, setContent] = useState<string>("");
  const [isLoadingProposal, setIsLoadingProposal] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({
    title: "",
    desc: "",
  });
  const [proposalForm, setProposalForm] =
    useState<IProposalForm>(initialProposal);

  // const handleTokenList = () => {
  //   console.log("HANDLE_TOKEN_LIST");
  // };

  const handleProposalForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProposalForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleDescriptionClick = () => {
    if (formErrors.desc) {
      setFormErrors((prevErrors) => ({ ...prevErrors, desc: "" }));
    }
  };

  const handleCreateProposal = async () => {
    try {
      let valid = true;
      const errors = { ...formErrors };
      if (!proposalForm.title) {
        errors.title = "Title is required";
        valid = false;
      }
      if (!content) {
        errors.desc = "Description is required";
        valid = false;
      }
      if (!valid) {
        setFormErrors(errors);
        return;
      }
      setIsLoadingProposal(true);
      const turndownService = new TurndownService();
      const markDownContent = turndownService.turndown(content);
      const proposalData = { ...proposalForm, desc: markDownContent };
      await createProposal(proposalData);
      setIsProposalModalOpen(false);
      setProposalForm(initialProposal);
      setContent("");
      setRefetchProposal(true);
    } catch (error: any) {
      NotificationMessage("error", error?.message);
    } finally {
      setIsLoadingProposal(false);
    }
  };
  // TODO: Update proper UI for errors too.
  return (
    <main className='create_proposal_container'>
      <h2>{cname}</h2>
      <label htmlFor='Title'>Title</label>
      <CInput
        className='input_container'
        name='title'
        value={proposalForm.title}
        onChange={handleProposalForm}
        // onFocus={() => handleInputFocus("title")}
        onFocus={() =>
          setFormErrors((prevErrors) => ({ ...prevErrors, title: "" }))
        }
      />
      {formErrors.title && <p className='error_message'>{formErrors.title}</p>}
      {/* 
      <label htmlFor='To'>To</label>
      <CInput
        className='input_container'
        placeholder='Wallet Address or ENS name'
      />

      <div className='amount_container'>
        <CInput className='input_container' placeholder='0' />
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
      </div> */}
      <label htmlFor='Description'>Description</label>
      <div
        className='input_container description'
        onClick={handleDescriptionClick}
      >
        <TiptapEditor content={content} setContent={setContent} />
      </div>
      {formErrors.desc && <p className='error_message'>{formErrors.desc}</p>}
      <input
        type='date'
        value={proposalForm.validity}
        min={today}
        onChange={handleProposalForm}
        name='validity'
      />
      <CButton
        loading={isLoadingProposal}
        className='proposal_btn'
        onClick={handleCreateProposal}
      >
        Save
      </CButton>
    </main>
  );
}
