"use client";
import React, { useEffect, useRef, useState } from "react";

import TiptapEditor from "../common/tiptapEditor";
import "./index.scss";
import CButton from "../common/Button";
import { uploadSingleFile } from "@/services/api/commonApi";

import useAsync from "@/hooks/useAsync";
import NotificationMessage from "../common/Notification";

import { debounce, getImageSource, getRandomImageLink } from "@/utils/helpers";

import FocusableDiv from "../common/focusableDiv";
import { UploadIcon } from "@/assets/icons";

import TurndownService from "turndown";
import { Modal } from "antd";
import { ICommunity } from "@/utils/types/types";
import {
  createCommunity,
  fetchCommunityByCname,
} from "@/services/api/communityApi";

import Avatar from "@/components/common/loaders/userAvatar";
import ProfileAvatar from "@/components/common/loaders/profileAvatar";
import DropdownWithSearch from "../common/dropdownWithSearch";

interface ICommunityForm {
  name?: string;
  username?: string;
  ticker?: string;
  metadata?: string;
  img: {
    pro: string;
    cvr: string;
  };
}
interface ICreateCommunityModal {
  onClose: () => void;
  refetchCommunities: () => void;
  isModalOpen: boolean;
  defaultCommunity?: ICommunity;
}

interface ICreateCommunity {
  onClose: () => void;
  refetchCommunities: () => void;
  defaultCommunity?: ICommunity;
}

export const CreateCommunityModal = ({
  onClose,
  refetchCommunities,
  isModalOpen,
  defaultCommunity,
}: ICreateCommunityModal) => {
  return (
    <Modal
      open={isModalOpen}
      onCancel={onClose}
      className='community-model'
      footer={<></>}
    >
      <CreateCommunity
        onClose={onClose}
        refetchCommunities={refetchCommunities}
        defaultCommunity={defaultCommunity}
      />
    </Modal>
  );
};

const tickers = [
  "ADA",
  "ARB",
  "BNB",
  "BTC",
  "DOT",
  "ETH",
  "SOL",
  "USDC",
  "USDT",
  "MATIC",
];

export const CreateCommunity = ({
  onClose,
  refetchCommunities,
  defaultCommunity,
}: ICreateCommunity) => {
  const [imgSrc, setImgSrc] = useState(getImageSource(null, "c"));
  const [imgSrcCover, setImgSrcCover] = useState(getImageSource(null, "cvr"));
  const [form, setForm] = useState<ICommunityForm>({
    img: {
      pro: imgSrc,
      cvr: imgSrcCover,
    },
    name: "",
    username: "",
    metadata: "",
    ticker: "",
  });

  const [usernameError, setUsernameError] = useState({
    type: "",
    msg: "",
  });
  const { isLoading, callFunction, data } = useAsync();
  const fileRefs = {
    cover: useRef<HTMLInputElement>(null),
    avatar: useRef<HTMLInputElement>(null),
  };
  const closeBtn = document.querySelector(".ant-modal-close");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [content, setContent] = useState<string>("");
  const turndownService = new TurndownService();
  const markDownContent = turndownService.turndown(content);

  const onPickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setIsUploadingAvatar(true);
        const file = event.target.files[0];
        const imgURL = await uploadSingleFile(file);
        setImgSrc(imgURL);
        setForm((prevForm) => ({
          ...prevForm,
          img: { ...prevForm.img, pro: imgURL },
        }));
        setIsUploadingAvatar(false);
        //reset value to select same image again
        event.target.value = "";
      } catch (error) {
        NotificationMessage("error", "Avatar uploading failed");
        setIsUploadingAvatar(false);
        //reset value to select same image again
        event.target.value = "";
      }
    }
  };

  // Handle cover image upload
  const onCoverImg = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setIsUploadingCover(true);
        const file = event.target.files[0];
        const imgURL = await uploadSingleFile(file);
        setImgSrcCover(imgURL);
        setForm((prevForm) => ({
          ...prevForm,
          img: { ...prevForm.img, cvr: imgURL },
        }));
        setIsUploadingCover(false);
      } catch (error) {
        NotificationMessage("error", "Cover uploading failed");
        setIsUploadingCover(false);
      }
    }
  };

  useEffect(() => {
    closeBtn?.addEventListener("click", () => {
      // Clear states when the modal is closed
      if (defaultCommunity) {
        onClose();
      } else {
        onClose();
        setForm({
          img: {
            pro: imgSrc,
            cvr: imgSrcCover,
          },
          name: "",
          username: "",
          metadata: "",
          ticker: "",
        });
      }
    });
  }, [closeBtn]);

  const handleSetData = (community: ICommunity) => {
    setImgSrcCover(community.img.cvr);
    setImgSrc(community.img.pro);
    setContent(community.metadata);
    setForm({
      img: {
        pro: community.img.pro,
        cvr: community.img.cvr,
      },
      name: community.name,
      username: community.username,
      metadata: community.metadata,
      ticker: community.ticker,
    });
  };

  useEffect(() => {
    if (defaultCommunity) {
      handleSetData(defaultCommunity);
    }
  }, [defaultCommunity]);

  //fallback img
  const setFallbackURL = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = getRandomImageLink();
  };

  const debouncedCheckUsername = debounce(async (username: string) => {
    if (username === "") {
      console.log("COMMUNITY", username);
      setUsernameError({ type: "", msg: "" });
      return;
    }
    try {
      const community = await fetchCommunityByCname(username);

      if (community) {
        // If a community with the same username is found, show an error
        if (community.username === username) {
          setUsernameError({ type: "error", msg: "Community already exists" });
        } else {
          setUsernameError({ type: "success", msg: "Community is available" });
        }
      } else {
        // If no community is found, the username is available
        setUsernameError({ type: "success", msg: "Community is available" });
      }
    } catch (error) {
      console.log("COMMUNITY error", error);

      if (username && error == "Error: user not available") {
        // If the API error indicates the username is not available in the database
        setUsernameError({ type: "success", msg: "Community is available" });
      } else {
        // Handle any other errors from the API
        setUsernameError({ type: "error", msg: "Error checking availability" });
      }
    }
  }, 500);

  function checkWhitespace(str: string) {
    return /\s/.test(str);
  }

  const handleForm = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name === "username") {
      // If the user clears the field, ensure the success message is cleared
      if (value === "") {
        setUsernameError({ type: "", msg: "" });
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
      } else {
        debouncedCheckUsername(value);
        if (!checkWhitespace(value)) {
          setForm((prevForm) => ({ ...prevForm, [name]: value }));
        }
      }
    } else {
      setForm((prevForm) => ({ ...prevForm, [name]: value }));
    }
  };

  const isFormValid = () => {
    const isFilled =
      form.name?.trim() !== "" &&
      form.username?.trim() !== "" &&
      form.ticker?.trim() !== "" &&
      markDownContent?.trim() !== "";

    // Check if the usernameError is not an error and all fields are filled
    const isUsernameValid =
      usernameError.type === "success" || usernameError.msg === "";

    return isFilled && isUsernameValid;
  };

  const handleCreateCommunity = async () => {
    try {
      console.log("Form", form);
      const communityForm = {
        ...form,
        metadata: markDownContent,
      };
      await callFunction(createCommunity, communityForm);
      NotificationMessage("success", "Community Created");
      refetchCommunities();
      onClose();
    } catch (error: any) {
      let errorMessage;
      if (
        Array.isArray(error.response.data.message) &&
        error.response.data.message.length > 0
      ) {
        errorMessage = error.response.data.message[0]; // Get the first element of the array
      } else {
        errorMessage = "Please Enter valid values";
      }

      console.log("error", errorMessage);

      NotificationMessage("error", errorMessage);

      // Handle error appropriately
      console.error("Failed to create community:", error);
    }
  };

  const handleUpdateCommunity = () => {};

  return (
    <div className='create_community_container'>
      <div className='cover_bx'>
        {isUploadingCover || !imgSrcCover ? (
          <ProfileAvatar />
        ) : (
          <img
            loading='lazy'
            onError={setFallbackURL}
            src={imgSrcCover}
            alt='Avatar'
          />
        )}
        <div
          onClick={() =>
            fileRefs.cover.current?.click && fileRefs.cover.current?.click()
          }
          className='upload'
        >
          <UploadIcon />
          <input
            ref={fileRefs.cover}
            onChange={onCoverImg}
            type='file'
            name='file'
            accept='image/*'
            style={{ visibility: "hidden" }}
          />
        </div>
        {/* {isUploadingCover && <span className='cvrmsg'>uploading...</span>} */}
      </div>
      <div className='avatar'>
        {isUploadingAvatar || !imgSrc ? (
          <Avatar />
        ) : (
          <img
            loading='lazy'
            onError={setFallbackURL}
            src={imgSrc}
            alt='Avatar'
          />
        )}

        <div
          onClick={() =>
            fileRefs.avatar.current?.click && fileRefs.avatar.current?.click()
          }
          className='upload'
        >
          <UploadIcon />
          <input
            ref={fileRefs.avatar}
            onChange={onPickFile}
            type='file'
            name='file'
            accept='image/*'
            style={{ visibility: "hidden" }}
          />
        </div>
        {/* {isUploadingAvatar && <span className='msg'>uploading...</span>} */}
      </div>

      <div className='info'>
        <span className='label'>Community Name</span>
        <input
          type='text'
          name='name'
          value={form.name}
          onChange={handleForm}
        />
      </div>
      <div className='info'>
        <span className='label'>Username</span>
        <input
          type='text'
          name='username'
          value={form.username}
          onChange={handleForm}
        />
      </div>
      <div className='info'>
        <span className='label'>Ticker</span>
        {/* <input
          type='text'
          name='ticker'
          value={form.ticker}
          onChange={handleForm}
        /> */}
        <DropdownWithSearch
          onSelect={(selectedTicker: string) => {
            setForm((prevForm) => ({ ...prevForm, ticker: selectedTicker }));
          }}
          options={tickers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selected={form?.ticker}
          placeholder='Select Ticker'
          isStringArray={true}
        />
      </div>
      <div className='info'>
        <span className='label'>Description</span>
        {/* <textarea
          name='metadata'
          value={form.metadata}
          rows={5}
          cols={10}
          onChange={handleForm}
        > */}
        {/* <div className='editor'>
          <TiptapEditor
            setContent={setContent}
            content={content}
            autoFocus={false}
          />
        </div> */}

        <FocusableDiv>
          <TiptapEditor
            setContent={setContent}
            content={content}
            autoFocus={true}
            maxCharCount={100}
          />
        </FocusableDiv>

        {/* </textarea> */}
      </div>
      <div className='btns'>
        {usernameError.type == "success" && (
          <span className='user_msg'>{usernameError.msg}</span>
        )}
        {usernameError.type == "error" && (
          <span className='user_msg_error'>{usernameError.msg}</span>
        )}

        {defaultCommunity ? (
          <CButton
            disabled={!isFormValid()}
            onClick={handleUpdateCommunity}
            loading={isLoading}
          >
            {/* <p
            className={`${
              usernameError == "Community is available" ? "success" : "error"
            }`}
          >
            {usernameError}
          </p> */}
            Update Community
          </CButton>
        ) : (
          <CButton
            disabled={!isFormValid()}
            onClick={handleCreateCommunity}
            loading={isLoading}
          >
            {/* <p
            className={`${
              usernameError == "Community is available" ? "success" : "error"
            }`}
          >
            {usernameError}
          </p> */}
            Create Community
          </CButton>
        )}
      </div>
    </div>
  );
};
