"use client";
import React, { useEffect, useRef, useState } from "react";
import { IComment, IPostCommentAPI } from "@/utils/types/types";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import TurndownService from "turndown";
import { postComments } from "@/services/api/postApi";
import { uploadSingleFile } from "@/services/api/commonApi";
import NotificationMessage from "@/components/common/Notification";
import TiptapEditor from "@/components/common/tiptapEditor";
import Image from "next/image";
import { MdDeleteOutline } from "react-icons/md";
import { LuImagePlus } from "react-icons/lu";
import { RiText } from "react-icons/ri";
import CButton from "@/components/common/Button";

import { FileInput } from "@/components/common/FileInput";
interface ICommentInputProps {
  onComment: (newComment: IComment) => void;
  setIsReplying?: (val: boolean) => void;
  parentComment?: IComment;
  postId: number;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
  setChildCommentCount?: React.Dispatch<React.SetStateAction<number>>;
  status?: string;
}

const CommentInput: React.FC<ICommentInputProps> = ({
  onComment,
  setIsReplying,
  parentComment,
  postId,
  setCommentCount,
  setChildCommentCount,
  status,
}) => {
  const isArchived = status === "archived";
  const [commentBody, setCommentBody] = useState("");
  const [content, setContent] = useState<string>("");
  const [commentImg, setCommentImg] = useState(null);
  const [imgLoading, setImageLoading] = useState<boolean>(false);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const userNameSelector = (state: RootState) => state?.user;
  const [{}, [user]] = useRedux([userNameSelector]);
  const commentInputRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const noUser = user?.profile?.id;
  const turndownService = new TurndownService();
  const markDownContent = turndownService.turndown(content);
  const isDisabled = isArchived || !noUser;

  const handlePostComment = async () => {
    const turndownService = new TurndownService();
    const markDown = turndownService.turndown(content);
    const postData: IPostCommentAPI = {
      content: markDown,
      img: commentImg,
      pid: +postId,
      pcid: parentComment?.id || null,
    };
    try {
      const response = await postComments(postData);
      if (response !== undefined) {
        const data: IComment = {
          id: response?.id,
          uid: response?.uid,
          pid: response?.pid,
          pcid: response?.pcid,
          content: response?.content,
          up: response?.up,
          down: response?.down,
          rCount: response?.rCount,
          cta: response?.cta,
          uta: response?.uta,
          user: { ...user, img: { pro: user.img } },
          img: response?.img,
          parentComment: parentComment || null,
          comments: [],
        };
        onComment(data);
        setContent("");
        setCommentImg(null);
        setCommentCount((prev: number) => prev + 1);
        if (setChildCommentCount)
          setChildCommentCount((prev: number) => prev + 1);
        if (setIsReplying) setIsReplying(false);
      } else {
        NotificationMessage("error", "Something went wrong");
      }
    } catch (error: any) {
      NotificationMessage("error", error?.message);
    }
  };

  const handleUploadFile = async (file: any) => {
    if (isDisabled) return;
    setImageLoading(true);
    try {
      const uploadedFile = await uploadSingleFile(file[0]);
      setCommentImg(uploadedFile);
    } catch (error) {
      console.error("Error uploading files", error);
      NotificationMessage("error", "Error uploading files");
    }
    setImageLoading(false);
  };

  const handleDeleteImage = () => {
    const wrapper = document.querySelector(".comment_image_wrapper");
    wrapper?.classList.add("fade-out");

    setTimeout(() => {
      setCommentImg(null);
      wrapper?.classList.remove("fade-out");
    }, 300);
  };

  useEffect(() => {
    const scrollToEditor = () => {
      const editor = commentInputRef.current;
      const container = containerRef.current;

      if (editor && container) {
        const editorRect = editor.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const editorHeight = editorRect.height;
        const editorTop = editorRect.top;
        const editorBottom = editorRect.bottom;
        const viewportHeight =
          window.innerHeight || document.documentElement.clientHeight;

        const visibleHeight =
          Math.min(viewportHeight, editorBottom) - Math.max(editorTop, 0);
        const visiblePercentage = visibleHeight / editorHeight;

        const isEditorVisible = visiblePercentage >= 0.3;

        if (!isEditorVisible) {
          container.scrollIntoView({
            behavior: "smooth",
            block: "center",
          });
        }
      }
    };

    scrollToEditor();
  }, [setIsReplying]);

  const isFormValid = () => {
    const isFilled = markDownContent?.trim() !== "";
    return isFilled;
  };
  return (
    <div className='comment_input' ref={containerRef}>
      <div ref={commentInputRef} className={isDisabled ? "delete_disable" : ""}>
        <TiptapEditor
          setContent={setContent}
          content={content}
          maxCharCount={300}
          className='box_height'
          // hideBtn={["h1", "h2", "h3", "code"]}
        />
      </div>
      {imgLoading && (
        <div className={`comment_image_wrapper `}>
          <div className='skeleton image_loader'></div>
        </div>
      )}
      {commentImg && (
        <div className={`comment_image_wrapper`}>
          <div className='image_wrapper'>
            <Image
              src={commentImg}
              alt='comment_img'
              width={100}
              height={100}
              className='comment_img'
            />
          </div>
          {!imgLoading && (
            <button className='delete_image_button' onClick={handleDeleteImage}>
              <MdDeleteOutline color='var(--primary)' size={20} />
            </button>
          )}
        </div>
      )}
      <div className={`comment_controls ${isDisabled ? "delete_disable" : ""}`}>
        <div>
          <FileInput onChange={handleUploadFile}>
            <LuImagePlus
              color={isDisabled ? "var(--primary-border)" : "var(--primary)"}
              size={36}
            />
          </FileInput>
          <RiText
            onClick={() => setShowToolbar(!showToolbar)}
            color={isDisabled ? "var(--primary-border)" : "var(--primary)"}
            size={36}
          />
        </div>
        <CButton
          className='comment_btn'
          // disabled={!isFormValid()}
          disabled={isDisabled || !isFormValid()}
          onClick={() => handlePostComment()}
        >
          Comment
        </CButton>
      </div>
    </div>
  );
};

export default CommentInput;
