"use client";

import { timeAgo } from "@/utils/helpers";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { GoComment, GoShareAndroid } from "react-icons/go";
import { PiArrowFatDownLight, PiArrowFatUpLight } from "react-icons/pi";

interface IUser {
  username: string;
  img: string;
}

interface IComment {
  body: string;
  id?: number;
  comments: IComment[];
  user: IUser;
  cta: string;
}

const dummyComments: IComment[] = [
  {
    id: 1,
    body: "this is comment 1",
    comments: [],
    user: {
      username: "test45",
      img: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    cta: "2024-08-02T10:09:15.193Z",
  },
  {
    id: 2,
    body: "this is comment 2",
    comments: [],
    user: {
      username: "test45",
      img: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    cta: "2024-08-02T10:09:15.193Z",
  },
  {
    id: 3,
    body: "this is comment 3",
    comments: [],
    user: {
      username: "test45",
      img: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
    cta: "2024-08-02T10:09:15.193Z",
  },
];
export default function Comments() {
  const [comments, setComments] = useState(dummyComments);

  const onComment = (newComment: IComment) => {
    setComments((prev) => [newComment, ...prev]);
  };
  return (
    <section className='comments'>
      {/* <UploadComponent limit={1} /> */}
      <CommentInput onComment={onComment} />
      <div className='comment_container'>
        {comments?.map((comment, index) => (
          <CommentItem key={index} comment={comment} />
        ))}
      </div>
    </section>
  );
}

interface ICommentItem {
  comment: IComment;
}
const CommentItem = ({ comment }: ICommentItem) => {
  const [isreplying, setIsReplying] = useState(false);
  const [comments, setComments] = useState(comment.comments);

  const onComment = (newComment: IComment) => {
    setComments((prev) => [newComment, ...prev]);
  };

  const handleClick = (val: boolean) => {
    setIsReplying(val);
  };

  return (
    <div className='comment_item'>
      <div className='user_head'>
        <Link
          href={`u/${comment?.user.username}`}
          as={`/u/${comment?.user.username}`}
          className='community_logo'
        >
          <Image
            src={comment?.user.img}
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
      {/* <span>{comment.body}</span> */}
      <div className='content'>
        {/* <div className='post_image'>
              <Image
                src='https://i.imgur.com/Qpw6j8D_d.webp?maxwidth=760&fidelity=grand'
                loading='lazy'
                alt='blog'
                fill
              />
            </div> */}
        <p>{comment?.body}</p>
      </div>

      <div className='actions'>
        <div>
          <PiArrowFatUpLight size={18} />
          {/* <span>{comment?.up}</span> */}
          <span>1</span>
          <PiArrowFatDownLight size={18} />
        </div>
        {isreplying ? (
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

      {/* {isreplying ? (
        <button onClick={() => handleClick(false)}>cancel</button>
      ) : (
        <button onClick={() => handleClick(true)}>reply</button>
      )} */}

      {isreplying && (
        <CommentInput onComment={onComment} setIsReplying={setIsReplying} />
      )}
      <div className='nested_comments'>
        {comments?.map((comment, index) => (
          <CommentItem key={index} comment={comment} />
        ))}
      </div>
    </div>
  );
};

interface ICommentInput {
  onComment: (newComment: IComment) => void;
  setIsReplying?: any;
}

const CommentInput = ({ onComment, setIsReplying }: ICommentInput) => {
  const [commentBody, setCommentBody] = useState("");
  return (
    <div className='comment_input'>
      <input
        value={commentBody}
        onChange={(event) => setCommentBody(event.target.value)}
        placeholder='write your comment'
      />
      <button
        onClick={() => {
          onComment({
            body: commentBody,
            comments: [],
            user: {
              username: "test45",
              img: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
            },
            cta: "2024-08-02T10:09:15.193Z",
          });
          setCommentBody("");
          setIsReplying(false);
        }}
      >
        comment
      </button>
    </div>
  );
};
