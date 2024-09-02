"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import dynamic from "next/dynamic";
import "./index.scss";
import { LuImagePlus } from "react-icons/lu";
import { MdDeleteOutline, MdOutlineGifBox } from "react-icons/md";
import {
  fetchCommunities,
  handlePostToCommunity,
  uploadMultipleFile,
  uploadSingleFile,
} from "@/services/api/api";
// import { LocalStore } from "@/utils/helpers";
import Image from "next/image";
import useRedux from "@/hooks/useRedux";
import { RootState } from "@/contexts/store";
import DropdownWithSearch from "./dropdownWithSearch";
import useAsync from "@/hooks/useAsync";
import { getImageSource } from "@/utils/helpers";
import { ErrorType, ICommunity } from "@/utils/types/types";
import NotificationMessage from "../common/Notification";
import CButton from "../common/Button";
// import SkeltonLoader from "./skeltonLoader";

const RichTextEditor = dynamic(() => import("../common/richTextEditor"), {
  ssr: false,
});

interface Props {
  setIsPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export const Img: React.FC<{
  file: File;
  onRemove: (index: number) => void;
  index: number;
}> = React.memo(({ file, onRemove, index }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setFileUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  return fileUrl ? (
    <div className='file' key={index}>
      <img alt='pic' src={fileUrl} />
      {onRemove && (
        <div className='remove' onClick={() => onRemove(index)}>
          <MdDeleteOutline size={20} />
        </div>
      )}
    </div>
  ) : null;
});

// Set displayName for Img component
Img.displayName = "Img";

interface FileInputProps {
  onChange: (files: FileList) => void;
  children: React.ReactNode;
}

export const FileInput: React.FC<FileInputProps> = React.memo(
  ({ onChange, children }) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const onPickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      console.log("event.target.files", event.target.files);

      if (event.target.files && event.target.files.length > 0) {
        onChange(event.target.files);
      }
    };

    return (
      <div onClick={() => fileRef.current && fileRef.current.click()}>
        {children}
        <input
          multiple
          ref={fileRef}
          onChange={onPickFile}
          accept='image/*,video/*'
          type='file'
          style={{ display: "none" }}
        />
      </div>
    );
  }
);

// Set displayName for FileInput component
FileInput.displayName = "FileInput";

const userNameSelector = (state: RootState) => state?.user;
const refetchCommunitySelector = (state: RootState) =>
  state.common.refetch.community;

const CreatePost: React.FC<Props> = ({ setIsPostModalOpen }) => {
  const [{ dispatch, actions }, [user, comminityRefetch]] = useRedux([
    userNameSelector,
    refetchCommunitySelector,
  ]);
  const {
    isLoading,
    data: communityList,
    refetch,
  } = useAsync(fetchCommunities);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isDisabled, setISDisabled] = useState(false);
  const [pics, setPics] = useState<File[]>([]);
  const [uplodedImg, setUploadedImg] = useState<File[]>([]);
  const [content, setContent] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<ICommunity | null>();
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState({
    msg: "",
    type: "",
  });

  const handlePost = async () => {
    try {
      setIsLoadingPost(true);
      const data = {
        cid: selectedOption?.id,
        text: content,
        images: uplodedImg,
      };
      await handlePostToCommunity(data);
      setIsLoadingPost(false);
      NotificationMessage("success", "Post Created");
      dispatch(actions.setRefetchUser(true));
      setIsPostModalOpen(false);
      setSelectedOption(null);
      setContent("");
      setSearchTerm("");
    } catch (error: any) {
      console.log("POST_ERROR", error);
      setIsLoadingPost(false);
      NotificationMessage("error", error?.message);
    }
  };

  const handleUploadFile = async (newPics: FileList) => {
    setIsUploading(true);
    setUploadMsg({ msg: "Uploading...", type: "info" });
    console.log("FILES_DATA", newPics);
    try {
      // if (newPics.length === 0) {
      //   return;
      // }

      const filesArray = Array.from(newPics);

      if (filesArray.length > 5) {
        NotificationMessage("info", "Please select upto 5 media");
        setUploadMsg({ msg: "", type: "" });
      } else {
        const uploadedFiles = await uploadMultipleFile(newPics);

        setPics((prevPics) => [...prevPics, ...filesArray]);
        setUploadMsg({ msg: "Uploaded Successfully", type: "success" });

        console.log("Uploaded files:", uploadedFiles);
      }
      setIsUploading(false);
      // console.log("FILES_ARR", filesArray);
      // const uploadedFiles = await Promise.all(
      //   filesArray?.map((file) => uploadMultipleFile(file))
      // );
    } catch (error) {
      setIsUploading(false);
      console.error("Error uploading files", error);
      setUploadMsg({ msg: "Failed to Upload", type: "error" });
      NotificationMessage("error", "Error uploading files");
    }
  };

  // const handleUploadFile = async (file: any) => {
  //   setPics([file[0]]);
  //   try {
  //     const uploadedFile = await uploadSingleFile(file[0]);
  //     setUploadedImg([uploadedFile]);
  //     console.log("UPLOADED_FILE", uploadedFile);
  //   } catch (error) {
  //     console.error("Error uploading files", error);
  //     NotificationMessage("error", "Error uploading files");
  //   }
  // };

  useEffect(() => {
    if (comminityRefetch) {
      refetch();
      dispatch(actions.setRefetchCommunity(false));
    }
  }, [comminityRefetch]);

  useEffect(() => {
    setISDisabled(!content || !selectedOption);
    console.log("DIS", !content || !selectedOption);
  }, [content, selectedOption]);

  // if (isLoading) {
  //   return <div className='create_post_loader'>loading...</div>;
  // }

  return (
    <main className='create_post_container'>
      <section className='user_data'>
        <Image
          loading='lazy'
          src={getImageSource(user?.img, "u")}
          alt='user_img'
          width={48}
          height={48}
        />
        {/* TODO  */}
        <h3 className='heading02'>
          {user?.name || user?.username || "user name"}
        </h3>
      </section>
      <section className='create_post_form'>
        <div className='inputArea'>
          <DropdownWithSearch
            onSelect={setSelectedOption}
            options={communityList}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          {/* <TestArea content={content} setContent={setContent} /> */}
          <RichTextEditor setContent={setContent} />
          {pics?.length > 0 && (
            <div className='file_container'>
              {pics?.map((picFile, index) => (
                <Img
                  key={index}
                  index={index}
                  file={picFile}
                  onRemove={(rmIndx) =>
                    setPics(pics.filter((_, idx) => idx !== rmIndx))
                  }
                />
              ))}
            </div>
          )}
        </div>
        <hr />
        <div className='media'>
          <div className='inputs'>
            <FileInput onChange={handleUploadFile}>
              <LuImagePlus color='var(--primary)' size={20} />
            </FileInput>
            <span className={uploadMsg.type}>{uploadMsg?.msg}</span>
            {/* <MdOutlineGifBox color='var(--primary)' size={20} />
            <LuImagePlus color='var(--primary)' size={20} /> */}
          </div>
          {/* <div className='postbtn'> */}
          <CButton
            loading={isLoadingPost}
            disabled={isDisabled}
            onClick={handlePost}
          >
            Post
          </CButton>
          {/* </div> */}
        </div>
      </section>
    </main>
  );
};

export default CreatePost;
