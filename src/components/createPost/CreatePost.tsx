"use client";

import React, { useState, useEffect, useCallback } from "react";
import "./index.scss";
import { LuImagePlus } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { uploadMultipleFiles } from "@/services/api/commonApi";
import { getFollowinsByUserId } from "@/services/api/userApi";
import Image from "next/image";
import useRedux from "@/hooks/useRedux";
import { RootState } from "@/contexts/store";
import DropdownWithSearch from "../common/dropdownWithSearch";
import useAsync from "@/hooks/useAsync";
import { getImageSource } from "@/utils/helpers";
import { ICommunity } from "@/utils/types/types";
import NotificationMessage from "../common/Notification";
import CButton from "../common/Button";
import TiptapEditor from "../common/tiptapEditor";
import TurndownService from "turndown";
import { BackIcon, LinkIcon } from "@/assets/icons";
import FocusableDiv from "../common/focusableDiv";
import { patchPost, getPostsByuName } from "@/services/api/postApi";
import { IPost } from "@/utils/types/types";

import { createPost } from "@/services/api/postApi";
import Drafts from "./drafts";
import EmojiPicker from "../common/emoji";
import { FileInput } from "../common/FileInput";
interface Props {
  setIsPostModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isPostModalOpen: boolean;
  editPost?: IPost;
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

const userNameSelector = (state: RootState) => state?.user?.profile;
const refetchPost = (state: RootState) => state.common.refetch.post;
const refetchCommunitySelector = (state: RootState) =>
  state.common.refetch.community;

const CreatePost: React.FC<Props> = ({
  isPostModalOpen,
  setIsPostModalOpen,
  defaultCommunity,
  editPost,
}) => {
  const [{ dispatch, actions }, [user, comminityRefetch, postRefetch]] =
    useRedux([userNameSelector, refetchCommunitySelector, refetchPost]);
  const {
    isLoading,
    data: communityList,
    refetch,
  } = useAsync(getFollowinsByUserId, {
    userId: user?.id,
    type: "c",
  });

  const followCList = communityList?.map((item: any) => item.followedCommunity);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isLoadingDraftPost, setIsLoadingDraftPost] = useState(false);
  const [pics, setPics] = useState<File[]>([]);
  const [uploadedImg, setUploadedImg] = useState<File[]>([]);
  const [content, setContent] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<ICommunity | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState({ msg: "", type: "" });
  const [isDraft, setIsDraft] = useState(false);
  const [post, setPost] = useState<IPost>();

  const [page, setPage] = useState(1);
  const [draftPosts, setDraftPosts] = useState<any[]>([]);
  const limit = 9;
  const turndownService = new TurndownService();
  const markDownContent = turndownService.turndown(content);
  const [uploadingSkeletons, setUploadingSkeletons] = useState<number[]>([]);
  const payload = {
    nameId: user?.username,
    sortby: "time",
    page,
    limit,
    sts: "draft",
  };

  const {
    isLoading: isLoadingUserPost,
    data: userPosts,
    refetch: refetchUserPost,
  } = useAsync(getPostsByuName, payload);

  const [isEditingPost, setIsEditingPost] = useState(false);

  const closeBtn = document.querySelector(".ant-modal-close");

  const handlePost = async (postStatus: "draft" | "published") => {
    const turndownService = new TurndownService();
    const markDownContent = turndownService.turndown(content);

    try {
      if (postStatus === "draft") {
        setIsLoadingDraftPost(true);
      } else {
        setIsLoadingPost(true);
      }

      const data = {
        cid: selectedOption?.id || defaultCommunity?.id,
        text: markDownContent,
        media: uploadedImg.length > 0 ? uploadedImg : null,
        sts: postStatus,
      };
      // await createPost(data);
      if (isEditingPost && post?.id) {
        // If editing an existing post, update it
        await patchPost(post?.id, data);
        NotificationMessage("success", `Post ${postStatus} successfully`);
        refetchUserPost();
      } else {
        // Otherwise, create a new post
        await createPost(data);
        NotificationMessage("success", `Post ${postStatus} Succesfuly`);
      }
      setIsLoadingDraftPost(false);
      setIsLoadingPost(false);
      setIsPostModalOpen(false);
      dispatch(actions.setRefetchPost(true));
      // dispatch(actions.setRefetchCommunity(true));
      resetPostForm();
    } catch (error: any) {
      console.log("error", error);
      NotificationMessage("error", error?.message);
      setIsLoadingPost(false);
      // setIsPostModalOpen(false);
      // resetPostForm();
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

    const filesArray = Array.from(newPics);
    const skeletonIds = filesArray.map((_, index) => pics.length + index);
    setUploadingSkeletons((prev) => [...prev, ...skeletonIds]);

    try {
      if (filesArray.length > 5) {
        NotificationMessage("info", "Please select up to 5 media");
        setUploadMsg({ msg: "", type: "" });
      } else {
        const uploadedFiles = await uploadMultipleFiles(newPics);
        setPics((prevPics) => [...prevPics, ...filesArray]);

        if (uploadedFiles.length > 0) {
          setUploadedImg((prevImgs) => [...prevImgs, ...uploadedFiles]);
        }

        setUploadMsg({ msg: "Uploaded Successfully", type: "success" });
        setUploadingSkeletons([]);
      }
      setIsUploading(false);
    } catch (error) {
      setIsUploading(false);
      setUploadMsg({ msg: "Failed to Upload", type: "error" });
      NotificationMessage("error", "Error uploading files");
      setUploadingSkeletons([]);
    }
  };

  useEffect(() => {
    closeBtn?.addEventListener("click", () => {
      console.log("close");
      if (editPost) {
        setIsPostModalOpen(false);
      } else {
        // Clear states when the modal is closed
        setIsLoadingPost(false);
        setSelectedOption(null);
        setContent("");
        setPics([]);
        setUploadedImg([]);
        setSearchTerm(defaultCommunity?.username || "");
        setUploadMsg({
          msg: "",
          type: "",
        });
        setDraftPosts([]);
        setIsPostModalOpen(false);
        setInitialState({ text: "", media: [], community: null });
      }
    });
  }, [closeBtn]);

  useEffect(() => {
    if (comminityRefetch) {
      refetch();
      dispatch(actions.setRefetchCommunity(false));
    }
  }, [comminityRefetch]);

  useEffect(() => {
    console.log("default", defaultCommunity);

    if (defaultCommunity?.id) {
      setSelectedOption(defaultCommunity);
    }
  }, [defaultCommunity]);

  const isFormValid = () => {
    const isFilled = markDownContent?.trim() !== "" && selectedOption !== null;

    return isFilled;
  };

  const [initialState, setInitialState] = useState({
    text: content,
    media: pics,
    community: selectedOption,
  });
  const [hasChanged, setHasChanged] = useState(false);

  const checkForChanges = useCallback(() => {
    // Compare the text
    const textChanged = initialState.text.trim() !== markDownContent?.trim();

    const normalizedInitialMedia = initialState.media || [];
    const picUrls = pics.map((pic: any) =>
      pic instanceof File ? URL.createObjectURL(pic) : pic.url
    );

    // Compare the media
    const mediaChanged =
      picUrls.length !== normalizedInitialMedia.length ||
      picUrls.some((url, index) => url !== normalizedInitialMedia[index]);
    const communityChanged = initialState.community?.id !== selectedOption?.id;

    setHasChanged(textChanged || mediaChanged || communityChanged);
  }, [pics, markDownContent, initialState, selectedOption]);

  useEffect(() => {
    checkForChanges();
  }, [pics, checkForChanges, content, selectedOption]);

  const handleEditPost = async (post: any) => {
    setPost(post);
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
    setInitialState({
      text: post.text,
      media: post.media,
      community: post.community,
    });

    setIsDraft(false); // Close draft view
  };

  useEffect(() => {
    if (editPost) {
      handleEditPost(editPost);
    }
  }, [editPost, isPostModalOpen]);

  const handleRemoveMedia = (rmIndx: number) => {
    setPics((prevPics) => prevPics.filter((_, idx) => idx !== rmIndx));
    setUploadedImg((prevImg) => prevImg.filter((_, idx) => idx !== rmIndx)); // If applicable, also update uploadedImg state
  };

  const handleUpdatePost = async () => {
    const turndownService = new TurndownService();
    const markDownContent = turndownService.turndown(content);
    try {
      setIsLoadingPost(true);
      const data = {
        cid: selectedOption?.id,
        text: markDownContent,
        // ...(uploadedImg && { media: uploadedImg }),
        // media: uploadedImg ? uploadedImg : null,
        media: uploadedImg.length > 0 ? uploadedImg : null,
      };

      if (post?.id) {
        await patchPost(post?.id, data);
        setIsLoadingPost(false);
        setIsPostModalOpen(false);
        NotificationMessage("success", "Post updated Succesfuly");
        dispatch(actions.setRefetchPost(true));
      }
      // dispatch(actions.setRefetchCommunity(true));
      // resetPostForm();
    } catch (error: any) {
      console.log("error", error);
      NotificationMessage("error", error?.message);
      setIsLoadingPost(false);
      // setIsPostModalOpen(false);
      // resetPostForm();
    }
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
            src={getImageSource(user?.img?.pro, "u")}
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
        <Drafts
          isPostModalOpen={isPostModalOpen}
          setIsPostModalOpen={setIsPostModalOpen}
          onEditPost={handleEditPost}
        />
      ) : (
        <section className='create_post_form'>
          <div className='inputArea'>
            <DropdownWithSearch
              onSelect={setSelectedOption}
              options={followCList}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              selected={selectedOption}
              defaultCommunity={defaultCommunity || editPost?.community}
            />
            <div className='post_editor'>
              <FocusableDiv>
                <TiptapEditor
                  setContent={setContent}
                  content={content}
                  autoFocus={false}
                  maxCharCount={1000}
                  className='box_height'
                  // hideBtn={["h1", "h2", "h3", "code"]}
                />
                <div className='file_container'>
                  {pics.map((picFile, index) => (
                    <Img
                      key={index}
                      index={index}
                      file={picFile}
                      onRemove={handleRemoveMedia}
                    />
                  ))}

                  {uploadingSkeletons.map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className='skeleton img_loader'
                    ></div>
                  ))}
                </div>

                <div className='inputs'>
                  <FileInput onChange={handleUploadFile}>
                    <LuImagePlus color='#636466' size={20} />
                  </FileInput>
                  {/* TODO: temp disabled feature is not decided yet */}
                  {/* <div>
                    <LinkIcon />
                  </div> */}
                </div>
              </FocusableDiv>
            </div>
          </div>
          {editPost ? (
            <div className='media'>
              <CButton
                loading={isLoadingPost}
                disabled={!isFormValid() || !hasChanged}
                onClick={handleUpdatePost}
                className='create_btn'
              >
                Update Post
              </CButton>
            </div>
          ) : (
            <div className='media'>
              <CButton
                loading={isLoadingDraftPost}
                disabled={!isFormValid() || !hasChanged}
                onClick={() => handlePost("draft")}
                className='create_btn'
              >
                Save as Draft
              </CButton>
              <CButton
                loading={isLoadingPost}
                disabled={!isFormValid() || !hasChanged}
                onClick={() => handlePost("published")}
                className='create_btn'
              >
                Post
              </CButton>
            </div>
          )}
        </section>
      )}
    </main>
  );
};

export default CreatePost;
