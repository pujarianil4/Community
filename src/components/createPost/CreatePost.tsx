"use client";

import React, { useState, useEffect, useRef, memo } from "react";
import dynamic from "next/dynamic";
import "./index.scss";
import { LuImagePlus } from "react-icons/lu";
import {
  MdDeleteOutline,
  MdEmojiEmotions,
  MdOutlineGifBox,
} from "react-icons/md";
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
import TiptapEditor from "../common/tiptapEditor";
import TurndownService from "turndown";
import { BackIcon, LinkIcon } from "@/assets/icons";
import FocusableDiv from "../common/focusableDiv";

import { getPosts } from "@/services/api/api";
import { IPost } from "@/utils/types/types";
import PostLoader from "./postLoader";
import MarkdownRenderer from "../common/MarkDownRender";
import { identifyMediaType } from "@/utils/helpers";
import { Pagination } from "antd";
interface Props {
  setIsPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPostModalOpen: boolean;
  post?: IPost;
  defaultCommunity?: ICommunity;
}

export const Img: React.FC<{
  file: File | { url: string }; // Accept either File or object with URL
  onRemove: (index: number) => void;
  index: number;
}> = React.memo(({ file, onRemove, index }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    if (file) {
      if (file instanceof File) {
        // If it's a File object, create a URL
        const url = URL.createObjectURL(file);
        setFileUrl(url);
        return () => URL.revokeObjectURL(url);
      } else {
        // Otherwise, it's already a URL
        setFileUrl(file.url);
      }
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
      //reset value to select same image again
      event.target.value = "";
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

const CreatePost: React.FC<Props> = ({
  isPostModalOpen,
  setIsPostModalOpen,
  defaultCommunity,
}) => {
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
  const [uploadedImg, setUploadedImg] = useState<File[]>([]);
  const [content, setContent] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<ICommunity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState({ msg: "", type: "" });
  const [isDraft, setIsDraft] = useState(false); // State to switch between draft and create post sections

  const {
    isLoading: isLoadingPostData,
    data: posts,
    refetch: refetchPost,
  } = useAsync(getPosts, { sortby: "pCount" });

  const [isEditingPost, setIsEditingPost] = useState(false); // State to check if we're editing a post

  // add pagination for draft posts
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts?.slice(indexOfFirstPost, indexOfLastPost);

  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  };

  const closeBtn = document.querySelector(".ant-modal-close");

  const handlePost = async () => {
    const turndownService = new TurndownService();
    const markDownContent = turndownService.turndown(content);
    try {
      setIsLoadingPost(true);

      const data = {
        cid: selectedOption?.id,
        text: markDownContent,
        media: uploadedImg ? uploadedImg : null,
      };

      await handlePostToCommunity(data);
      setIsLoadingPost(false);
      NotificationMessage("success", "Post Updated");
      resetPostForm();
    } catch (error: any) {
      NotificationMessage("error", error?.message);
      setIsLoadingPost(false);
      resetPostForm();
    }
  };

  const saveDraft = async (draftData: any) => {
    try {
      console.log("save drasft api calll");
    } catch (error) {
      throw new Error("Error saving draft");
    }
  };

  const handleSaveDraft = async () => {
    const turndownService = new TurndownService();
    const markDownContent = turndownService.turndown(content);
    try {
      setIsLoadingPost(true);
      const draftData = {
        cid: selectedOption?.id,
        text: markDownContent,
        media: uploadedImg ? uploadedImg : null,
        isDraft: true, // Mark this post as a draft
      };

      await saveDraft(draftData); // function to save draft
      setIsLoadingPost(false);
      NotificationMessage("success", "Draft Saved");
      resetPostForm();
      setIsDraft(true); // Switch to the draft section
    } catch (error: any) {
      NotificationMessage("error", error?.message);
      setIsLoadingPost(false);
    }
  };

  const resetPostForm = () => {
    setSelectedOption(null);
    setContent("");
    setPics([]);
    setUploadedImg([]);
    setSearchTerm("");
    setUploadMsg({ msg: "", type: "" });
    setIsEditingPost(false); // Stop editing mode
  };

  const handleUploadFile = async (newPics: FileList) => {
    setIsUploading(true);
    setUploadMsg({ msg: "Uploading...", type: "info" });

    try {
      const filesArray = Array.from(newPics);
      if (filesArray.length > 5) {
        NotificationMessage("info", "Please select up to 5 media");
        setUploadMsg({ msg: "", type: "" });
      } else {
        const uploadedFiles = await uploadMultipleFile(newPics);
        setPics((prevPics) => [...prevPics, ...filesArray]);

        if (uploadedFiles.length > 0)
          setUploadedImg((prevPics) => [...prevPics, ...uploadedFiles]);
        setUploadMsg({ msg: "Uploaded Successfully", type: "success" });
        console.log("Uploaded files:", uploadedFiles);
      }
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      setUploadMsg({ msg: "Failed to Upload", type: "error" });
      NotificationMessage("error", "Error uploading files");
    }
  };
  useEffect(() => {
    closeBtn?.addEventListener("click", () => {
      console.log("close");
      // Clear states when the modal is closed
      setIsLoadingPost(false);
      setSelectedOption(null);
      setContent("");
      setPics([]);
      setUploadedImg([]);
      setSearchTerm("");
      setUploadMsg({
        msg: "",
        type: "",
      });
      setIsPostModalOpen(false);
    });
  }, [closeBtn]);

  useEffect(() => {
    if (comminityRefetch) {
      refetch();
      dispatch(actions.setRefetchCommunity(false));
    }
  }, [comminityRefetch]);

  useEffect(() => {
    if (defaultCommunity?.id) {
      setSelectedOption(defaultCommunity);
    }
  }, [defaultCommunity]);

  useEffect(() => {
    setISDisabled(!content || !selectedOption);
    console.log("DIS", !content || !selectedOption);
  }, [content, selectedOption]);

  const handleEditPost = async (post: any) => {
    console.log("Editing post:", post);
    setIsEditingPost(true); // Enable editing mode

    setContent(post.text); // Set post content
    setSelectedOption(post?.community); // Set community

    if (post?.media?.length > 0) {
      const mediaFiles = post.media.map((mediaUrl: any) => {
        return { url: mediaUrl };
      });

      // Update pics and uploadedImg states
      setPics(mediaFiles); // For rendering in the Img component
      setUploadedImg(post.media); // Set the media URLs to uploadedImg
    }

    setIsDraft(false); // Close draft view
  };

  const handleRemoveMedia = (rmIndx: number) => {
    setPics((prevPics) => prevPics.filter((_, idx) => idx !== rmIndx));
    setUploadedImg((prevImg) => prevImg.filter((_, idx) => idx !== rmIndx)); // If applicable, also update uploadedImg state
  };

  return (
    <main className='create_post_container'>
      <span className='back_btn' onClick={() => setIsDraft(!isDraft)}>
        {isDraft ? <BackIcon /> : ""}
      </span>

      <section className='user_data'>
        <div>
          <Image
            loading='lazy'
            src={getImageSource(user?.img, "u")}
            alt='user_img'
            width={48}
            height={48}
          />
          <h3 className='heading02'>
            {user?.name || user?.username || "user name"}
          </h3>
        </div>
        <div>
          {!isDraft ? (
            <CButton onClick={() => setIsDraft(!isDraft)} className='draft_btn'>
              Draft
            </CButton>
          ) : null}
        </div>
      </section>

      {isDraft ? (
        <section className='draft_posts_section'>
          {isLoadingPostData ? (
            <>
              {Array(5)
                .fill(() => 0)
                .map((_: any, i: number) => (
                  <PostLoader key={i} />
                ))}
            </>
          ) : (
            <section>
              {currentPosts?.map((post: IPost) => (
                <article
                  className='draft_post'
                  key={post?.id}
                  onMouseEnter={() => setIsEditingPost(false)}
                >
                  <div className='content'>
                    <MarkdownRenderer markdownContent={post?.text} limit={2} />
                  </div>
                  {post?.media?.[0] && (
                    <Image
                      className='post_img'
                      src={post.media[0]}
                      alt=''
                      width={160}
                      height={128}
                    />
                  )}
                  <div className='hover_bx'>
                    <CButton
                      onClick={() => handleEditPost(post)}
                      className='editBtn'
                    >
                      Edit
                    </CButton>
                    <CButton onClick={handlePost} className='hvr_postBtn'>
                      Post
                    </CButton>
                  </div>
                </article>
              ))}
              <div className='drft_pagination'>
                <Pagination
                  current={currentPage}
                  total={posts?.length}
                  pageSize={postsPerPage}
                  onChange={handlePaginationChange}
                />
              </div>
            </section>
          )}
        </section>
      ) : (
        <section className='create_post_form'>
          <div className='inputArea'>
            <DropdownWithSearch
              // onSelect={setSelectedOption}
              // options={communityList}
              // searchTerm={searchTerm}
              // setSearchTerm={setSearchTerm}
              onSelect={setSelectedOption}
              options={communityList} // Array of ICommunity objects
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selected={selectedOption}
              defaultCommunity={defaultCommunity}
            />
            <div className='post_editor'>
              <FocusableDiv>
                <TiptapEditor
                  setContent={setContent}
                  content={content}
                  autoFocus={true}
                  maxCharCount={300}
                />
                {/* {pics?.length > 0 && (
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
                )} */}
                {pics?.length > 0 && (
                  <div className='file_container'>
                    {pics?.map((picFile, index) => (
                      <Img
                        key={index}
                        index={index}
                        file={picFile}
                        onRemove={handleRemoveMedia}
                      />
                    ))}
                  </div>
                )}

                <div className='inputs'>
                  <FileInput onChange={handleUploadFile}>
                    <LuImagePlus color='#636466' size={20} />
                  </FileInput>
                  <div>
                    <LinkIcon />
                  </div>
                  <div>
                    <MdEmojiEmotions color='#636466' size={20} />
                  </div>

                  <span className={uploadMsg.type}>{uploadMsg?.msg}</span>
                </div>
              </FocusableDiv>
            </div>
          </div>
          <div className='media'>
            <CButton
              loading={isLoadingPostData}
              disabled={isDisabled}
              onClick={handleSaveDraft}
              className='create_btn'
            >
              Save as Draft
            </CButton>
            <CButton
              loading={isLoadingPost}
              disabled={isDisabled}
              onClick={handlePost}
              className='create_btn'
            >
              {isEditingPost ? "Update Post" : "Post"}
            </CButton>
          </div>
        </section>
      )}
    </main>
  );
};

export default CreatePost;
