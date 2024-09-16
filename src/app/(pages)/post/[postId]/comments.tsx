"use client";

import { DropdownLowIcon, DropdownUpIcon, ShareIcon } from "@/assets/icons";
import CButton from "@/components/common/Button";
import CommentsLoader from "@/components/common/loaders/comments";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import NotificationMessage from "@/components/common/Notification";
import TiptapEditor from "@/components/common/tiptapEditor";
import { FileInput } from "@/components/createPost/CreatePost";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import {
  fetchComments,
  postComments,
  sendVote,
  uploadSingleFile,
} from "@/services/api/api";
import { getImageSource, timeAgo } from "@/utils/helpers";
import {
  IComment,
  IPostCommentAPI,
  IUser,
  IVotePayload,
} from "@/utils/types/types";
import { PiArrowFatDownDuotone, PiArrowFatUpDuotone } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";
import TurndownService from "turndown";
import React, { useEffect, useRef, useState } from "react";
import { GoComment } from "react-icons/go";
import { LuImagePlus } from "react-icons/lu";
import { MdDeleteOutline } from "react-icons/md";
import { RiText } from "react-icons/ri";
import {
  CarryOutOutlined,
  CheckOutlined,
  FormOutlined,
} from "@ant-design/icons";
import { Select, Switch, Tree } from "antd";
import type { TreeDataNode } from "antd";
import UHead from "@/components/common/uhead";
import { DataNode } from "antd/es/tree";

interface Iprops {
  postId: number;
}
export default function Comments({ postId }: Iprops) {
  const { isLoading, data: commentsData } = useAsync(fetchComments, postId);
  const [comments, setComments] = useState<IComment[]>([]);
  const [commentsTree, setCommentsTree] = useState<DataNode[]>([]);
  const loadingArray = Array(5).fill(() => 0);
  const [actualData, setActualData] = useState<IComment[]>([]);
  const actualDataRef = useRef<IComment[]>();
  actualDataRef.current = actualData;

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

    const sorted = rootComments
      ?.filter((comment: any) => comment?.pcid === null)
      ?.sort(
        (a: any, b: any) =>
          new Date(b.cta).getTime() - new Date(a.cta).getTime()
      );

    const treeData: TreeDataNode[] = generateTreeData(sorted);
    console.log("sorted", sorted, treeData);
    setCommentsTree(treeData);
    return sorted;
  }

  const generateTreeData = (
    comments: IComment[],
    parentKey = ""
  ): TreeDataNode[] => {
    return comments.map((comment, index) => {
      const currentKey = parentKey
        ? `${parentKey}-${index + 1}`
        : (index + 1).toString();

      return {
        title: (
          <CommentItem
            onReply={onComment}
            key={index}
            comment={comment}
            postId={postId}
          />
        ),
        key: currentKey,
        icon: <CarryOutOutlined />,
        children: comment.comments
          ? generateTreeData(comment.comments, currentKey)
          : [],
      };
    });
  };

  // const treeData: TreeDataNode[] = generateTreeData(comments);

  // console.log("tree", treeData, comments);

  useEffect(() => {
    if (commentsData) {
      const updatedCommentsData = organizeComments(commentsData);
      setComments(updatedCommentsData);
      setActualData(commentsData);
    }
  }, [commentsData]);

  useEffect(() => {
    console.log("actualData", commentsData);
  }, [actualData]);

  const onSelect = (selectedKeys: React.Key[], info: any) => {
    console.log("selected", selectedKeys, info);
  };

  const onComment = (newComment: IComment) => {
    const withAddedComment = [newComment, ...(actualDataRef.current || [])];

    console.log(
      "comment",
      withAddedComment,
      actualDataRef,
      actualData,
      newComment
    );
    setActualData(withAddedComment);
    const organized = organizeComments(withAddedComment);
    setComments(organized);

    // const treeData: TreeDataNode[] = generateTreeData(organized);
    // console.log("aftercomment", withAddedComment, treeData);
    // setCommentsTree(treeData);
  };

  const onReply = (newReply: IComment) => {
    const u = [commentsData, newReply];
  };
  return (
    <section className='comments'>
      <CommentInput onComment={onComment} postId={postId} />
      {isLoading ? (
        loadingArray.map((_: any, i: number) => <CommentsLoader key={i} />)
      ) : (
        <div className='comment_container'>
          {/* {comments?.map((comment: any, index: number) => (
            <CommentItem key={index} comment={comment} postId={postId} />
          ))} */}

          <Tree
            showLine={true}
            showIcon={false}
            className='comments'
            rootClassName='comments'
            // defaultExpandedKeys={["1"]}
            onSelect={onSelect}
            treeData={commentsTree}
          />
        </div>
      )}
    </section>
  );
}

interface ICommentItemProps {
  comment: IComment;
  postId: number;
  onReply: (reply: IComment) => void;
}

interface Vote {
  value: number;
  type: "up" | "down" | "";
}
const CommentItem: React.FC<ICommentItemProps> = React.memo(
  ({ comment, postId, onReply }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [childComments, setChildComments] = useState<IComment[]>(
      comment?.comments || []
    );
    const [vote, setVote] = useState<Vote>({
      value: Number(comment.up) + Number(comment.down),
      type: "",
    });

    const handleVote = async (action: string) => {
      const previousVote = { ...vote };

      let newVote: Vote = { ...vote };

      if (action === "up") {
        if (vote.type === "down") {
          newVote = { value: vote.value + 2, type: "up" };
        } else if (vote.type === "up") {
          newVote = { value: vote.value - 1, type: "" };
        } else {
          newVote = { value: vote.value + 1, type: "up" };
        }
      } else if (action === "down") {
        if (vote.type === "up") {
          newVote = { value: vote.value - 2, type: "down" };
        } else if (vote.type === "down") {
          newVote = { value: vote.value + 1, type: "" };
        } else {
          newVote = { value: vote.value - 1, type: "down" };
        }
      }

      setVote(newVote);

      try {
        if (comment.id) {
          const payload: IVotePayload = {
            typ: "c",
            cntId: comment.id,
            voteTyp: newVote.type,
          };
          const afterVote = await sendVote(payload);
          console.log("updated", afterVote, payload);

          // setVote({ value: updatedPost.voteCount, type: newVote.type });
        }
      } catch (error) {
        console.error("Vote failed:", error);
        setVote(previousVote);
      }
    };
    const scrollableContainerRef = useRef(null);

    const onComment = (newComment: IComment) => {
      // setChildComments((prevComments) => [newComment, ...prevComments]);
      onReply(newComment);
    };

    const handleClick = (val: boolean) => {
      setIsReplying(val);
    };

    return (
      <div
        ref={scrollableContainerRef}
        className={`comment_item ${
          comment.comments?.length == 0 ? "lastComment" : ""
        } `}
      >
        <div className='user_head'>
          <Link
            href={`u/${comment?.user.username}`}
            as={`/u/${comment?.user.username}`}
            // className='community_logo'
          >
            <Image
              src={getImageSource(comment?.user?.img?.pro, "u")}
              alt={comment?.user.username}
              width={30}
              height={30}
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
          <MarkdownRenderer markdownContent={comment?.content} />
        </div>
        {/* <div className='actions'>
          <div className='up_down'>
            <PiArrowFatUpDuotone
              // className={vote.type == "up" ? "active" : ""}
              // onClick={() => handleVote("up")}
              size={18}
            />
            <span>{vote.value}</span>
            <PiArrowFatDownDuotone
              // className={vote.type == "down" ? "active" : ""}
              // onClick={() => handleVote("down")}
              size={18}
            />
          </div>
          <div className='comments'>
            <GoComment size={18} />
            <span>{post?.ccount > 0 ? post.ccount : "comments"}</span>
          </div>

          <div className='share'>
            <ShareIcon width={18} />
            <span>Share</span>
          </div>
          <div className='save'>
            <SaveIcon width={16} height={16} />
            <span>Save</span>
          </div>
        </div> */}
        <div className='actions'>
          <div className='up_down'>
            <PiArrowFatUpDuotone
              className={vote.type == "up" ? "active" : ""}
              onClick={() => handleVote("up")}
              size={18}
            />
            <span>{vote.value}</span>
            <PiArrowFatDownDuotone
              className={vote.type == "down" ? "active" : ""}
              onClick={() => handleVote("down")}
              size={18}
            />
          </div>
          {isReplying ? (
            <div className='comments' onClick={() => handleClick(false)}>
              <span>Cancel</span>
            </div>
          ) : (
            <div className='comments' onClick={() => handleClick(true)}>
              <GoComment size={18} />
              <span>Reply</span>
            </div>
          )}
          <div className='save'>
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
        {/* {childComments.length > 0 && (
          <div className='nested_comments'>
            {childComments.map((childComment) => (
              <CommentItem
                key={childComment.id}
                comment={childComment}
                postId={postId}
              />
            ))}
          </div>
        )} */}
      </div>
    );
  }
);

CommentItem.displayName = "CommentItem";

interface ICommentInputProps {
  onComment: (newComment: IComment) => void;
  setIsReplying?: (val: boolean) => void;
  parentComment?: IComment;
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
  const commentInputRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePostComment = async () => {
    const turndownService = new TurndownService();
    const markDown = turndownService.turndown(commentBody);
    const postData: IPostCommentAPI = {
      uid: user?.uid,
      content: markDown,
      img: commentImg,
      pid: +postId,
      pcid: parentComment?.id || null,
    };
    const response = await postComments(postData);
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
    setCommentBody("");
    setCommentImg(null);
    if (setIsReplying) setIsReplying(false);
  };

  const handleUploadFile = async (file: any) => {
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

  return (
    <div className='comment_input' ref={containerRef}>
      <div ref={commentInputRef}>
        <TiptapEditor
          showToolbar={showToolbar}
          setContent={setCommentBody}
          content={commentBody}
          maxCharCount={300}
          // autoFocus={true}
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
