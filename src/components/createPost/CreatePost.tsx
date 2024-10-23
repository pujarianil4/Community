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
import { uploadMultipleFiles } from "@/services/api/commonApi";
import { getFollowinsByUserId } from "@/services/api/userApi";
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
import VirtualList from "@/components/common/virtualList";
import { patchPost, getPostsByuName } from "@/services/api/postApi";
import { IPost } from "@/utils/types/types";
import PostLoader from "./postLoader";
import MarkdownRenderer from "../common/MarkDownRender";
import { identifyMediaType } from "@/utils/helpers";

import { createPost } from "@/services/api/postApi";
import EmptyData from "../common/Empty";
import Drafts from "./drafts";
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
    userId: user?.profile?.id,
    type: "c",
  });

  const followCList = communityList?.map((item: any) => item.followedCommunity);
  const [isLoadingPost, setIsLoadingPost] = useState(false);
  const [isLoadingDraftPost, setIsLoadingDraftPost] = useState(false);
  const [isDisabled, setISDisabled] = useState(false);
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
  console.log("LENGTH", draftPosts?.length);
  const limit = 9;
  const turndownService = new TurndownService();
  const markDownContent = turndownService.turndown(content);

  const [uploadingSkeletons, setUploadingSkeletons] = useState<number[]>([]);
  const payload = {
    nameId: user?.profile?.username,
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

  // useEffect(() => {
  //   if (userPosts && userPosts.length > 0) {
  //     setDraftPosts((prevData) =>
  //       page === 1 ? userPosts : [...prevData, ...userPosts]
  //     );
  //   }
  // }, [userPosts]);
  useEffect(() => {
    if (userPosts && userPosts?.length > 0) {
      if (page === 1) {
        setDraftPosts(userPosts);
      } else {
        setDraftPosts((prevPosts) => [...prevPosts, ...userPosts]);
      }
    } else {
      setDraftPosts([]);
    }
  }, [userPosts]);

  useEffect(() => {
    if (page !== 1) refetchUserPost();
  }, [page]);
  console.log("page", page);
  const closeBtn = document.querySelector(".ant-modal-close");

  const handlePost = async (postStatus: "draft" | "published") => {
    const turndownService = new TurndownService();
    const markDownContent = turndownService.turndown(content);
    console.log("handlePost", selectedOption, defaultCommunity);

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
        NotificationMessage("success", "Post Created Succesfuly");
      }
      setIsLoadingDraftPost(false);
      setIsLoadingPost(false);
      setIsPostModalOpen(false);
      dispatch(actions.setRefetchPost(true));
      // dispatch(actions.setRefetchCommunity(true));
      resetPostForm();
    } catch (error: any) {
      console.log("error", error);
      NotificationMessage("error", error?.response?.data?.message);
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
    if (postRefetch == true) {
      refetchUserPost();
      dispatch(actions.resetRefetch());
    }
  }, [postRefetch]);

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
      NotificationMessage("error", error?.response?.data?.message);
      setIsLoadingPost(false);
      // setIsPostModalOpen(false);
      // resetPostForm();
    }
  };

  const draftPost = async (post: IPost) => {
    try {
      setIsLoadingPost(true);
      const data = {
        cid: post?.cid,
        text: post?.text,
        media: post.media,
        sts: "published",
      };
      if (post?.id) {
        await patchPost(post?.id, data);
        setIsLoadingPost(false);
        setIsPostModalOpen(false);
        NotificationMessage("success", "Post created Succesfuly");
        dispatch(actions.setRefetchPost(true));
      }
      // dispatch(actions.setRefetchCommunity(true));
      // resetPostForm();
    } catch (error: any) {
      console.log("error", error);
      NotificationMessage("error", error?.response?.data?.message);
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
            src={getImageSource(user?.img, "u")}
            alt='user_img'
            width={48}
            height={48}
          />
          <h3 className='heading02'>
            {user?.profile?.name || user?.profile?.username || "user name"}
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
        // <section className='draft_posts_section'>
        //   {page < 2 && isLoadingUserPost ? (
        //     <>
        //       {Array(4)
        //         .fill(0)
        //         .map((_, i) => (
        //           <PostLoader key={i} />
        //         ))}
        //     </>
        //   ) : (
        //     <>
        //       <VirtualList
        //         listData={draftPosts}
        //         isLoading={isLoadingUserPost}
        //         page={page}
        //         setPage={setPage}
        //         limit={limit}
        //         renderComponent={(index: number, post: any) => (
        //           <article
        //             className='draft_post'
        //             key={index}
        //             onMouseEnter={() => setIsEditingPost(false)}
        //           >
        //             <div className='content'>
        //               <MarkdownRenderer
        //                 markdownContent={post?.text}
        //                 limit={2}
        //               />
        //             </div>
        //             {post?.media?.[0] && (
        //               <Image
        //                 className='post_img'
        //                 src={post.media[0]}
        //                 alt=''
        //                 width={160}
        //                 height={128}
        //               />
        //             )}
        //             <div className='hover_bx'>
        //               <CButton
        //                 onClick={() => handleEditPost(post)}
        //                 className='editBtn'
        //               >
        //                 Edit
        //               </CButton>

        //               <CButton
        //                 onClick={() => draftPost(post)}
        //                 className='hvr_postBtn'
        //               >
        //                 Post
        //               </CButton>
        //             </div>
        //           </article>
        //         )}
        //         footerHeight={150}
        //       />
        //       {isLoadingUserPost && page > 1 && <PostLoader />}
        //       {!isLoadingUserPost && draftPosts?.length === 0 && page === 1 && (
        //         <EmptyData />
        //       )}
        //     </>
        //   )}
        // </section>
        <Drafts />
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
                  autoFocus={true}
                  maxCharCount={300}
                  className='box_height'
                />
                {/* <div className='file_container'>
                  {pics.length > 0 && (
                    <div className='file_container'>
                      {pics.map((picFile, index) => (
                        <Img
                          key={index}
                          index={index}
                          file={picFile}
                          onRemove={handleRemoveMedia}
                        />
                      ))}
                    </div>
                  )}

                  {uploadingSkeletons.map((_, index) => (
                    <div
                      key={`skeleton-${index}`}
                      className='skeleton img_loader'
                    ></div>
                  ))}
                </div> */}

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
                  <div>
                    <LinkIcon />
                  </div>
                  <div>
                    <MdEmojiEmotions color='#636466' size={20} />
                  </div>

                  {/* <span className={uploadMsg.type}>{uploadMsg?.msg}</span> */}
                  {/* <span className={uploadMsg?.type}>
                    {isUploading ? <div className='loader'></div> : null}
                  </span> */}
                </div>
              </FocusableDiv>
            </div>
          </div>
          {editPost ? (
            <div className='media'>
              <CButton
                loading={isLoadingPost}
                disabled={!isFormValid()}
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
                disabled={!isFormValid()}
                onClick={() => handlePost("draft")}
                className='create_btn'
              >
                Save as Draft
              </CButton>
              <CButton
                loading={isLoadingPost}
                disabled={!isFormValid()}
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
