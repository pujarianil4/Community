"use client";

import CommentsLoader from "@/components/common/loaders/comments";
import useAsync from "@/hooks/useAsync";
import { fetchComments } from "@/services/api/postApi";
import { IComment } from "@/utils/types/types";
import React, { useEffect, useRef, useState } from "react";
import { CarryOutOutlined } from "@ant-design/icons";
import { Tree } from "antd";
import type { TreeDataNode } from "antd";
import { DataNode } from "antd/es/tree";
import CommentInput from "./commentInput";
import CommentItem from "./commentItem";

interface Iprops {
  postId: number;
  setCommentCount: React.Dispatch<React.SetStateAction<number>>;
  status: string;
}
export default function Comments({ postId, setCommentCount, status }: Iprops) {
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
            setCommentCount={setCommentCount}
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

  useEffect(() => {
    if (commentsData) {
      const updatedCommentsData = organizeComments(commentsData);
      setComments(updatedCommentsData);
      setActualData(commentsData);
    }
  }, [commentsData]);

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
      <CommentInput
        onComment={onComment}
        postId={postId}
        setCommentCount={setCommentCount}
        status={status}
      />
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
