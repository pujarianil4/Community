"use client";
import React, { useEffect, useRef, useState } from "react";

import TiptapEditor from "../../common/tiptapEditor";
import "./index.scss";
import CButton from "../../common/Button";
import { uploadSingleFile } from "@/services/api/commonApi";

import useAsync from "@/hooks/useAsync";
import NotificationMessage from "../../common/Notification";

import { debounce, getImageSource, getRandomImageLink } from "@/utils/helpers";

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
import DropdownWithSearch from "../../common/dropdownWithSearch";
import { IMAGE_FILE_TYPES } from "@/utils/constants";
//image name length chekcer
import { useImageNameValidator } from "@hooks/useImageNameValidator";
import { useParams } from "next/navigation";
interface ICommunityForm {
  name?: string;
  username?: string;
  ticker?: string;
  metadata?: string;
  img: {
    pro: string;
    cvr: string;
  };
  twitter?: string;
  telegram?: string;
  discord?: string;
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

export const GeneralProfile = ({}: ICreateCommunity) => {
  const { community } = useParams<{ community: string }>();
  const {
    error,
    isLoading: load,
    data: communityData,
    refetch,
  } = useAsync(fetchCommunityByCname, community);

  console.log("community Data", communityData);

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
    twitter: "",
    telegram: "",
    discord: "",
  });

  const { validateImage, error: err, clearError } = useImageNameValidator();
  const [usernameError, setUsernameError] = useState({
    type: "",
    msg: "",
  });
  const { isLoading, callFunction, data } = useAsync();
  const fileRefs = {
    cover: useRef<HTMLInputElement>(null),
    avatar: useRef<HTMLInputElement>(null),
  };

  const [searchTerm, setSearchTerm] = useState<string>("");
  console.log("searchterm", searchTerm);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [content, setContent] = useState<string>("");
  const turndownService = new TurndownService();
  const markDownContent = turndownService.turndown(content);
  const [charCount, setCharCount] = useState(0);
  const maxChars = 300;

  const telegramRegex = /^https?:\/\/(t\.me\/|telegram\.me\/)[a-zA-Z0-9_]+$/;
  const discordRegex =
    /^https?:\/\/(discord\.gg\/|discordapp\.com\/invite\/)[a-zA-Z0-9]+$/;
  const twitterRegex = /^https?:\/\/(www\.)?twitter\.com\/[a-zA-Z0-9_]+$/;

  // State for storing link errors
  const [linkErrors, setLinkErrors] = useState({
    twitter: "",
    telegram: "",
    discord: "",
  });

  // Validate the links
  const validateLinks = (name: string, value: string) => {
    let errorMessage = "";

    if (name === "telegram" && value && !telegramRegex.test(value)) {
      errorMessage = "Invalid Telegram link. Use t.me or telegram.me format.";
    } else if (name === "discord" && value && !discordRegex.test(value)) {
      errorMessage =
        "Invalid Discord link. Use discord.gg or discordapp.com format.";
    } else if (name === "twitter" && value && !twitterRegex.test(value)) {
      errorMessage = "Invalid Twitter link. Use twitter.com format.";
    }

    setLinkErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));

    return !errorMessage; // Return true if valid
  };

  const onPickFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      try {
        setIsUploadingAvatar(true);
        const file = event.target.files[0];
        if (!validateImage(file)) {
          console.error("Validation failed:", err);
          NotificationMessage(
            "error",
            "Image name should not exceed 25 characters."
          );
          setIsUploadingAvatar(false);
          return;
        }
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
        if (!validateImage(file)) {
          console.error("Validation failed:", err);
          NotificationMessage(
            "error",
            "Image name should not exceed 25 characters."
          );
          setIsUploadingAvatar(false);
          return;
        }
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
      twitter: community.twitter,
      telegram: community.telegram,
      discord: community.discord,
    });
  };

  useEffect(() => {
    if (communityData) {
      handleSetData(communityData);
    }
  }, [communityData]);

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
    if (name === "metadata" && value.length > maxChars) return;
    if (["telegram", "discord", "twitter"].includes(name)) {
      validateLinks(name, value);
    }
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
    } else if (name === "metadata") {
      if (value.length <= maxChars) {
        setCharCount(value.length);
        setForm((prevForm) => ({ ...prevForm, [name]: value }));
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
      // markDownContent?.trim() !== "";
      form.metadata?.trim() !== "";

    // Check if the usernameError is not an error and all fields are filled
    const isUsernameValid =
      usernameError.type === "success" || usernameError.msg === "";
    const areLinksValid = Object.values(linkErrors).every(
      (error) => error === ""
    );

    return isFilled && isUsernameValid && areLinksValid;
  };

  const handleUpdateCommunity = async () => {
    try {
      console.log("Form", form);
      const communityForm = {
        ...form,
      };
      await callFunction(createCommunity, communityForm); //change update community api
      NotificationMessage("success", "Community updated");
      // refetchCommunities();
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

  useEffect(() => {
    setForm((prevForm) => ({
      ...prevForm,
      ticker: searchTerm,
    }));
  }, [searchTerm]);

  return (
    <div className='community_profile_container'>
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
            accept={IMAGE_FILE_TYPES}
            style={{ visibility: "hidden" }}
          />
        </div>
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
            accept={IMAGE_FILE_TYPES}
            style={{ visibility: "hidden" }}
          />
        </div>
      </div>

      <div className='info'>
        <span className='label'>Community Name</span>
        <input
          type='text'
          name='name'
          value={form.name}
          onChange={handleForm}
          placeholder='Enter your Community Name'
        />
      </div>
      <div className='info'>
        <span className='label'>Username</span>
        <input
          type='text'
          name='username'
          value={form.username}
          onChange={handleForm}
          placeholder='Enter your Username'
        />
      </div>
      <div className='info'>
        <span className='label'>Ticker</span>

        <DropdownWithSearch
          onSelect={(selectedTicker: string) => {
            setForm((prevForm) => ({ ...prevForm, ticker: selectedTicker }));
          }}
          options={tickers}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selected={form.ticker}
          placeholder='Select Ticker'
          isStringArray={true}
        />
      </div>
      <div className='info'>
        <span className='label'>Description</span>

        <div className='textarea-container'>
          <textarea
            rows={5}
            cols={10}
            onChange={handleForm}
            name='metadata'
            value={form.metadata}
            maxLength={maxChars}
          />
          <span className='char-counter'>
            {`${form.metadata?.length || 0}/${maxChars}`}
          </span>
        </div>
      </div>
      <div className='info'>
        <span className='label'>Telegram Link</span>
        <input
          type='text'
          name='telegram'
          value={form.telegram}
          onChange={handleForm}
          placeholder='Enter your Telegram link'
        />
        {linkErrors.telegram && (
          <span className='error'>{linkErrors.telegram}</span>
        )}
      </div>
      <div className='info'>
        <span className='label'>Discord Link</span>
        <input
          type='text'
          name='discord'
          value={form.discord}
          onChange={handleForm}
          placeholder='Enter your Discord link'
        />
        {linkErrors.discord && (
          <span className='error'>{linkErrors.discord}</span>
        )}
      </div>
      <div className='info'>
        <span className='label'>Twitter Link</span>
        <input
          type='text'
          name='twitter'
          value={form.twitter}
          onChange={handleForm}
          placeholder='Enter your Twitter link'
        />
        {linkErrors.twitter && (
          <span className='error'>{linkErrors.twitter}</span>
        )}
      </div>

      <div className='btns'>
        {usernameError.type == "success" && (
          <span className='user_msg'>{usernameError.msg}</span>
        )}
        {usernameError.type == "error" && (
          <span className='user_msg_error'>{usernameError.msg}</span>
        )}

        <CButton
          disabled={!isFormValid()}
          onClick={handleUpdateCommunity}
          loading={isLoading}
        >
          Save
        </CButton>
      </div>
    </div>
  );
};
