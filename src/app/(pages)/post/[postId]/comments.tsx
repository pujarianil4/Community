"use client";

import CButton from "@/components/common/Button";
import TextArea from "@/components/common/textArea";
import { RootState } from "@/contexts/store";
import useAsync from "@/hooks/useAsync";
import useRedux from "@/hooks/useRedux";
import { fetchComments, postComments } from "@/services/api/api";
import { getImageSource, timeAgo } from "@/utils/helpers";
import { IComment, IPostCommentAPI, IUser } from "@/utils/types/types";
import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { GoComment, GoShareAndroid } from "react-icons/go";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";

export default function Comments() {
  const userNameSelector = (state: RootState) => state?.user;
  const { isLoading, data: commentsData } = useAsync(fetchComments);
  const [comments, setComments] = useState<IComment[]>();
  const [{}, [user]] = useRedux([userNameSelector]);

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
    setComments((prev) => [newComment, ...(prev || [])]);
  };
  return (
    <section className='comments'>
      <CommentInput onComment={onComment} user={user} />
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className='comment_container'>
          {comments
            ?.filter((comment: any) => comment?.pcid === null)
            ?.sort(
              (a: any, b: any) =>
                new Date(b.cta).getTime() - new Date(a.cta).getTime()
            )
            ?.map((comment: any, index: number) => (
              <CommentItem
                key={index}
                comment={comment}
                //  refetch={refetch}
              />
            ))}
        </div>
      )}
    </section>
  );
}

interface ICommentItemProps {
  comment: IComment;
  // refetch?: any;
}

const CommentItem: React.FC<ICommentItemProps> = React.memo(
  ({
    comment,
    //  refetch
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
            className='community_logo'
          >
            <Image
              src={getImageSource(comment?.user.img)}
              alt={comment?.user.username}
              width={32}
              height={32}
            />
          </Link>
          <Link
            href={`u/${comment?.user.username}`}
            as={`/u/${comment?.user.username}`}
            className='community_logo'
          >
            {comment?.user.username}
          </Link>
          <p className='post_time'>&bull; {timeAgo(comment?.cta)}</p>
        </div>
        <div className='content'>
          <p>{comment?.content}</p>
        </div>
        <div className='actions'>
          <div>
            <PiArrowFatUpLight size={18} />
            <span>{comment?.up}</span>
            <PiArrowFatDownLight size={18} />
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
            <GoShareAndroid size={18} />
            <span>Share</span>
          </div>
        </div>
        {isReplying && (
          <CommentInput
            onComment={onComment}
            setIsReplying={setIsReplying}
            parentComment={comment}
            // refetch={refetch}
            user={comment?.user}
          />
        )}
        {childComments.length > 0 && (
          <div className='nested_comments'>
            {childComments.map((childComment) => (
              <CommentItem
                key={childComment.id}
                comment={childComment}
                // refetch={refetch}
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
  user?: IUser;
}

const CommentInput: React.FC<ICommentInputProps> = ({
  onComment,
  setIsReplying,
  parentComment,
  // refetch,
  user,
}) => {
  const [commentBody, setCommentBody] = useState("");

  const handlePostComment = async () => {
    const postData: IPostCommentAPI = {
      uid: 8,
      content: commentBody,
      // img: null,
      pid: 1,
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
      parentComment: parentComment || null,
      comments: [],
    };
    onComment(data);
    setCommentBody("");
    if (setIsReplying) setIsReplying(false);
  };

  return (
    <div className='comment_input'>
      {/* <input
        value={commentBody}
        onChange={(event) => setCommentBody(event.target.value)}
        placeholder='Write your comment'
      /> */}
      <TextArea
        content={commentBody}
        setContent={setCommentBody}
        placeholder='Write your comment'
      />
      <div>
        <div>{/* TODO: add media icons */}</div>
        <CButton
          className='comment_btn'
          disabled={commentBody === ""}
          onClick={() => handlePostComment()}
        >
          Comment
        </CButton>
      </div>
      {/* // <button onClick={() => handlePostComment()}>Comment</button> */}
    </div>
  );
};
