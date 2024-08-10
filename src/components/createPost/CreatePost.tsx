"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import "./index.scss";
import { LuImagePlus } from "react-icons/lu";
import { MdOutlineGifBox } from "react-icons/md";
import TestArea from "./testArea";
import {
  fetchCommunities,
  getPosts,
  handlePostToCommunity,
} from "@/services/api/api";
// import { LocalStore } from "@/utils/helpers";
import Image from "next/image";
import useRedux from "@/hooks/useRedux";
import { RootState } from "@/contexts/store";
import DropdownWithSearch, { ICommunity } from "./dropdownWithSearch";
import useAsync from "@/hooks/useAsync";
import { getImageSource } from "@/utils/helpers";
import SkeltonLoader from "./skeltonLoader";

interface Props {
  setIsPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Img: React.FC<{
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
          x
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

const FileInput: React.FC<FileInputProps> = React.memo(
  ({ onChange, children }) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const onPickFile = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
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
const CreatePost: React.FC<Props> = ({ setIsPostModalOpen }) => {
  const [{}, [user]] = useRedux([userNameSelector]);
  const { isLoading, data: communityList } = useAsync(fetchCommunities);

  const [pics, setPics] = useState<File[]>([]);
  const [content, setContent] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<ICommunity | null>();
  const [searchTerm, setSearchTerm] = useState("");

  const handlePost = async () => {
    try {
      const data = {
        cid: selectedOption?.id,
        text: content,
      };
      await handlePostToCommunity(data);
      setIsPostModalOpen(false);
      setSelectedOption(null);
      setContent("");
      setSearchTerm("");
      await getPosts();
    } catch (error) {
      console.log("POST_ERROR", error);
    }
  };
  if (isLoading) {
    return <p>loading...</p>;
  }

  return (
    <main className='create_post_container'>
      <section className='user_data'>
        <Image
          loading='lazy'
          src={getImageSource(user?.img)}
          alt='user_img'
          width={48}
          height={48}
        />
        {/* TODO  */}
        <h3 className='heading02'>{user?.name || "user name"}</h3>
      </section>
      <section className='create_post_form'>
        <div className='inputArea'>
          <DropdownWithSearch
            onSelect={setSelectedOption}
            options={communityList}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          <TestArea content={content} setContent={setContent} />
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
        </div>
        <hr />
        <div className='media'>
          <div className='inputs'>
            <FileInput
              onChange={(newPics) =>
                setPics((prevPics) => [...prevPics, ...Array.from(newPics)])
              }
            >
              <LuImagePlus color='var(--primary)' size={20} />
            </FileInput>
            <MdOutlineGifBox color='var(--primary)' size={20} />
            <LuImagePlus color='var(--primary)' size={20} />
          </div>
          <div className='postbtn'>
            <button onClick={handlePost}>Post</button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CreatePost;
