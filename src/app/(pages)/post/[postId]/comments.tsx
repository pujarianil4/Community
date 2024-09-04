"use client";

import { DropdownLowIcon, DropdownUpIcon, ShareIcon } from "@/assets/icons";
import CButton from "@/components/common/Button";
import CommentsLoader from "@/components/common/loaders/comments";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import NotificationMessage from "@/components/common/Notification";
import RichTextEditor from "@/components/common/richTextEditor";
import TextArea from "@/components/common/textArea";
import TiptapEditor from "@/components/common/tiptapEditor";
import { FileInput } from "@/components/createPost/CreatePost";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import {
  fetchComments,
  postComments,
  uploadSingleFile,
} from "@/services/api/api";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { IComment, IPostCommentAPI, IUser } from "@/utils/types/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { GoComment, GoShareAndroid } from "react-icons/go";
import { LuImagePlus } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";
import { RiText } from "react-icons/ri";
// import ReactMarkdown from "react-markdown";

interface Iprops {
  postId: number;
}
export default function Comments({ postId }: Iprops) {
  const { isLoading, data: commentsData } = useAsync(fetchComments, postId);
  const [comments, setComments] = useState<IComment[]>();
  const loadingArray = Array(5).fill(() => 0);

  function organizeComments(comments: IComment[]): IComment[] {
    const commentMap = new Map<number, IComment>();
    const rootComments: IComment[] = [];

    comments?.forEach((comment) => {
      comment.comments = [];
      commentMap.set(comment.id, comment);
    });

    comments?.forEach((comment) => {
      const parentCommentId = comment.pcid;
      if (parentCommentId !== null) {
        const parentComment = commentMap.get(parentCommentId);
        if (parentComment) {
          if (!parentComment.comments) {
            parentComment.comments = [];
          }
          parentComment.comments.push(comment);
        } else {
          console.warn(
            `Parent comment ${parentCommentId} not found for comment ${comment.id}`
          );
        }
      } else {
        rootComments.push(comment);
      }
    });

    return rootComments;
  }

  useEffect(() => {
    if (commentsData) {
      const updatedCommentsData = organizeComments(commentsData);
      setComments(updatedCommentsData);
    }
  }, [commentsData]);

  const onComment = (newComment: IComment) => {
    if (newComment.pcid === null) {
      setComments([newComment, ...(comments || [])]);
    }
  };
  return (
    <section className='comments'>
      <CommentInput onComment={onComment} postId={postId} />
      {isLoading ? (
        loadingArray.map((_: any, i: number) => <CommentsLoader key={i} />)
      ) : (
        <div className='comment_container'>
          {comments
            ?.filter((comment: any) => comment?.pcid === null)
            ?.sort(
              (a: any, b: any) =>
                new Date(b.cta).getTime() - new Date(a.cta).getTime()
            )
            ?.map((comment: any, index: number) => (
              <CommentItem key={index} comment={comment} postId={postId} />
            ))}
        </div>
      )}
    </section>
  );
}

interface ICommentItemProps {
  comment: IComment;
  postId: number;
}

const CommentItem: React.FC<ICommentItemProps> = React.memo(
  ({
    comment,
    //  refetch
    postId,
  }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [childComments, setChildComments] = useState<IComment[]>(
      comment?.comments || []
    );

    const onComment = (newComment: IComment) => {
      setChildComments((prevComments) => [newComment, ...prevComments]);
    };

    const handleClick = (val: boolean) => {
      setIsReplying(val);
    };

    return (
      <div className='comment_item'>
        {comment.pcid !== null && <div className='comment_line' />}
        <div className='user_head'>
          <Link
            href={`u/${comment?.user.username}`}
            as={`/u/${comment?.user.username}`}
            // className='community_logo'
          >
            <Image
              src={getImageSource(comment?.user?.img?.pro, "u")}
              alt={comment?.user.username}
              width={32}
              height={32}
            />
          </Link>
          <Link
            href={`u/${comment?.user.username}`}
            as={`/u/${comment?.user.username}`}
            className='user_name'
          >
            {comment?.user.username}
          </Link>
          <p className='post_time'>&bull; {timeAgo(comment?.cta)}</p>
        </div>
        <div className='content'>
          {comment?.img && (
            <Image
              src={comment?.img}
              alt='comment_img'
              width={240}
              height={240}
              className='comment_img'
            />
          )}
          {/* <ReactMarkdown>{comment?.content}</ReactMarkdown> */}
          <MarkdownRenderer markdownContent={comment?.content} />
          {/* <p>{comment?.content}</p> */}
        </div>
        <div className='actions'>
          <div className='up_down'>
            <DropdownUpIcon width={18} />
            <span>{comment?.up}</span>
            <DropdownLowIcon width={18} />
          </div>
          {isReplying ? (
            <div onClick={() => handleClick(false)}>
              <span>Cancel</span>
            </div>
          ) : (
            <div onClick={() => handleClick(true)}>
              <GoComment size={18} />
              <span>Reply</span>
            </div>
          )}
          <div>
            <ShareIcon width={18} />
            <span>Share</span>
          </div>
        </div>
        {isReplying && (
          <CommentInput
            onComment={onComment}
            setIsReplying={setIsReplying}
            parentComment={comment}
            postId={postId}
          />
        )}
        {childComments.length > 0 && (
          <div className='nested_comments'>
            {childComments.map((childComment) => (
              <CommentItem
                key={childComment.id}
                comment={childComment}
                // refetch={refetch}
                postId={postId}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);

CommentItem.displayName = "CommentItem";

interface ICommentInputProps {
  onComment: (newComment: IComment) => void;
  setIsReplying?: (val: boolean) => void;
  parentComment?: IComment;
  // refetch?: any;
  postId: number;
}

const CommentInput: React.FC<ICommentInputProps> = ({
  onComment,
  setIsReplying,
  parentComment,
  postId,
}) => {
  const [commentBody, setCommentBody] = useState("");
  const [commentImg, setCommentImg] = useState(null);
  const [imgLoading, setImageLoading] = useState<boolean>(false);
  const [showToolbar, setShowToolbar] = useState<boolean>(false);
  const userNameSelector = (state: RootState) => state?.user;
  const [{}, [user]] = useRedux([userNameSelector]);
  // const commentInputRef = useRef<HTMLDivElement>(null);
  const commentInputRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePostComment = async () => {
    const postData: IPostCommentAPI = {
      uid: user?.uid,
      content: commentBody,
      img: commentImg,
      pid: +postId,
      pcid: parentComment?.id || null,
    };
    const response = await postComments(postData);
    // // refetch();
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
      user: user as IUser,
      img: response?.img,
      parentComment: parentComment || null,
      comments: [],
    };
    onComment(data);
    setCommentBody("");
    setCommentImg(null);
    if (setIsReplying) setIsReplying(false);
  };

  const handleUploadFile = async (file: any) => {
    console.log("FILE_DATA", file[0]);
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

  const scrollToEditor = () => {
    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const isFullyVisible =
        containerRect.top >= 0 && containerRect.bottom <= window.innerHeight;

      if (!isFullyVisible) {
        window.scrollBy({
          top: containerRect.bottom - window.innerHeight + 20, // Adding margin to ensure visibility
          behavior: "smooth",
        });
      }
    }
  };

  const smoothScrollUp = (distance: number) => {
    window.scrollBy({
      top: -distance,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    console.log("EFFECT1");

    if (commentInputRef.current) {
      commentInputRef.current.focus();
    }

    scrollToEditor();
  }, [setIsReplying, commentImg]);

  useEffect(() => {
    console.log("EFFECT2");
    // Smooth scroll up by 500px if there's not enough space at the bottom for the full comment input.
    const checkViewportSpace = () => {
      if (containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        if (containerRect.bottom > window.innerHeight) {
          smoothScrollUp(500);
        }
      }
    };

    checkViewportSpace();
  }, [commentImg, setIsReplying]);

  // useEffect(() => {
  //   const scrollToEditor = () => {
  //     const editor = commentInputRef.current;
  //     const container = containerRef.current;

  //     if (editor && container) {
  //       const editorRect = editor.getBoundingClientRect();
  //       const containerRect = container.getBoundingClientRect();

  //       const isEditorVisible =
  //         editorRect.top >= 0 &&
  //         editorRect.bottom <=
  //           (window.innerHeight || document.documentElement.clientHeight);

  //       if (!isEditorVisible) {
  //         container.scrollIntoView({
  //           behavior: "smooth",
  //           block: "end",
  //         });

  //         if (imgLoading) {
  //           window.scrollBy(0, 200); // Scroll an additional 200px if image preview is present
  //         }
  //       }

  //       // Auto-focus the editor input
  //       if (editor) {
  //         const editorInput = editor.querySelector(
  //           "div[contenteditable='true']"
  //         );
  //         if (editorInput) {
  //           (editorInput as HTMLElement).focus();
  //         }
  //       }
  //     }
  //   };

  //   scrollToEditor();
  // }, [setIsReplying, imgLoading]);

  return (
    <div className='comment_input' ref={containerRef}>
      {/* <TextArea
        content={commentBody}
        setContent={setCommentBody}
        placeholder='Write your comment'
      /> */}
      <div ref={commentInputRef}>
        {/* <RichTextEditor
          showToolbar={showToolbar}
          setContent={setCommentBody}
          value={commentBody}
        /> */}
        <TiptapEditor
          showToolbar={showToolbar}
          setContent={setCommentBody}
          content={commentBody}
        />
      </div>
      {imgLoading && (
        <div className={`comment_image_wrapper `}>
          <div className='skeleton image_loader'></div>
        </div>
      )}
      {commentImg && (
        <div className={`comment_image_wrapper `}>
          <div className='image_wrapper'>
            <Image
              src={commentImg}
              alt='comment_img'
              width={200}
              height={200}
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
      <div className='comment_controls'>
        <div>
          <FileInput onChange={handleUploadFile}>
            <LuImagePlus color='var(--primary)' size={36} />
          </FileInput>
          <RiText
            onClick={() => setShowToolbar(!showToolbar)}
            color='var(--primary)'
            size={36}
          />
        </div>
        <CButton
          className='comment_btn'
          disabled={commentBody === "" && commentImg == null}
          onClick={() => handlePostComment()}
        >
          Comment
        </CButton>
      </div>
    </div>
  );
};
