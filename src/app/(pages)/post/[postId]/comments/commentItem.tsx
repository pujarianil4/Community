"use client";
import React, { useRef, useState } from "react";
import { IComment, IVotePayload } from "@/utils/types/types";
import { sendVote } from "@/services/api/api";
import Link from "next/link";
import Image from "next/image";
import { getImageSource, timeAgo } from "@/utils/helpers";
import MarkdownRenderer from "@/components/common/MarkDownRender";
import { PiArrowFatDownDuotone, PiArrowFatUpDuotone } from "react-icons/pi";
import { GoComment } from "react-icons/go";
import { ShareIcon } from "@/assets/icons";
import CommentInput from "./commentInput";

interface ICommentItemProps {
  comment: IComment;
  postId: number;
  onReply: (reply: IComment) => void;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
}

interface Vote {
  value: number;
  type: "up" | "down" | "";
}
const CommentItem: React.FC<ICommentItemProps> = React.memo(
  ({ comment, postId, onReply, setCommentCount }) => {
    const [isReplying, setIsReplying] = useState(false);
    const [childComments, setChildComments] = useState<IComment[]>(
      comment?.comments || []
    );
    const [childCommentCount, setChildCommentCount] = useState<number>(
      childComments?.length
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
        <div className='actions'>
          <div className='up_down'>
            <PiArrowFatUpDuotone
              className={vote.type == "up" || comment?.isVoted ? "active" : ""}
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
              <span>{childCommentCount > 0 ? childCommentCount : "Reply"}</span>
            </div>
          )}
          <div className='share'>
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
            setCommentCount={setCommentCount}
            setChildCommentCount={setChildCommentCount}
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

export default CommentItem;
