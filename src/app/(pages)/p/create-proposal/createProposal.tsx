"use client";
import React, { useCallback, useState } from "react";
import "./index.scss";
import { IProposalForm } from "@/utils/types/types";
import TurndownService from "turndown";
import NotificationMessage from "@/components/common/Notification";
import CInput from "@/components/common/Input";
import TiptapEditor from "@/components/common/tiptapEditor";
import CButton from "@/components/common/Button";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";
import { createProposal } from "@/services/api/proposalApi";
import CustomRangePicker from "@/components/common/rangePicker";

const { RangePicker } = DatePicker;

interface IProps {
  cname: string;
  cid: number;
}
export default function CreateProposal({ cname, cid }: IProps) {
  const initialProposal = {
    title: "",
    desc: "",
    cid: cid,
    validity: {
      start: "",
      end: "",
    },
  };
  const [content, setContent] = useState<string>("");
  const [isLoadingProposal, setIsLoadingProposal] = useState<boolean>(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({
    title: "",
    desc: "",
    date: "",
  });
  const [proposalForm, setProposalForm] =
    useState<IProposalForm>(initialProposal);

  const [dates, setDates] = useState<[dayjs.Dayjs | null, dayjs.Dayjs | null]>([
    null,
    null,
  ]);
  const router = useRouter();
  const handleRedirect = (id: number) => {
    router.push(`/p/${id}`);
  };

  const onChange = (value: [dayjs.Dayjs | null, dayjs.Dayjs | null] | null) => {
    if (formErrors.date) {
      setFormErrors((prevErrors) => ({ ...prevErrors, date: "" }));
    }
    if (value) {
      setDates(value);
      const formattedStartDate = value[0]?.format("YYYY-MM-DD HH-mm-ss") || "";
      const formattedEndDate = value[1]?.format("YYYY-MM-DD HH-mm-ss") || "";

      setProposalForm({
        ...proposalForm,
        validity: {
          start: formattedStartDate,
          end: formattedEndDate,
        },
      });
    }
  };

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

  const clearDatePicker = () => {
    setDates([null, null]);
    setProposalForm((prevForm) => ({
      ...prevForm,
      validity: {
        start: "",
        end: "",
      },
    }));
  };

  const disabledDateFunction = useCallback((current: Dayjs | null) => {
    if (!current) {
      return false;
    }

    const yesterday = dayjs().subtract(1, "day");
    const ninetyDaysAfterToday = dayjs().add(90, "days");

    return current.isBefore(yesterday) || current.isAfter(ninetyDaysAfterToday);
  }, []);

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
      if (!dates[0] || !dates[1]) {
        errors.date = "Start and End dates are required";
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

      // if (proposalForm.validity.start && proposalForm.validity.end) {
      //   const daysBetween = calculateDaysBetween(
      //     proposalForm.validity.start,
      //     proposalForm.validity.end
      //   );
      //   console.log("Number of days between:", daysBetween);
      // }
      const res = await createProposal(proposalData);

      setProposalForm(initialProposal);
      setContent("");
      clearDatePicker();
      NotificationMessage("success", "Proposal Is Created Successfully");
      handleRedirect(res?.id);
      // TODO: Deside where to go after creating new proposal
    } catch (error: any) {
      NotificationMessage("error", error?.message);
    } finally {
      setIsLoadingProposal(false);
    }
  };

  return (
    <main className='create_proposal_container'>
      <h2>{cname}</h2>
      <label htmlFor='Title'>Title</label>
      <CInput
        className='input_container'
        name='title'
        value={proposalForm.title}
        onChange={handleProposalForm}
        onFocus={() =>
          setFormErrors((prevErrors) => ({ ...prevErrors, title: "" }))
        }
      />
      <p className='error_message'>{formErrors.title && formErrors.title}</p>
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
      <p className='error_message'>{formErrors.desc && formErrors.desc}</p>
      {/* <input
        type='date'
        value={proposalForm.validity}
        min={today}
        onChange={handleProposalForm}
        name='validity'
      /> */}
      {/* <RangePicker
        onChange={onChange}
        value={[
          dates[0] ? dayjs(dates[0]) : null,
          dates[1] ? dayjs(dates[1]) : null,
        ]}
        allowClear
        disabledDate={disabledDateFunction}
        // onFocus={() =>
        //   setFormErrors((prevErrors) => ({ ...prevErrors, date: "" }))
        // }
      /> */}
      <CustomRangePicker
        value={dates}
        onChange={onChange}
        disabledDate={disabledDateFunction}
        className=''
      />
      <p className='error_message'>{formErrors.date && formErrors.date}</p>

      <CButton
        loading={isLoadingProposal}
        className='proposal_btn'
        onClick={handleCreateProposal}
      >
        Create Proposal
      </CButton>
    </main>
  );
}
