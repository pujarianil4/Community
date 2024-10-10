"use client";
import React, { useEffect, useState } from "react";
import "./index.scss";
import CommentPost from "./commentPost";
import CommentPostLoader from "./commentPostLoader";
import EmptyData from "@/components/common/Empty";
import { IComment } from "@/utils/types/types";
import { useSearchParams } from "next/navigation";
import useAsync from "@/hooks/useAsync";
import { fetchSearchByCommentData } from "@/services/api/searchApi";
import NotificationMessage from "@/components/common/Notification";
import VirtualList from "@/components/common/virtualList";

interface IProps {
  commentsData?: IComment[];
}

export default function SearchComments({ commentsData }: IProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [page, setPage] = useState(1);
  const [comments, setComments] = useState<IComment[]>([]);
  const limit = 10;
  const payload = {
    search: searchQuery,
    page,
    limit,
  };

  const { error, isLoading, data, refetch } = useAsync(
    fetchSearchByCommentData,
    payload
  );

  useEffect(() => {
    if (searchQuery) {
      setComments([]);
      refetch();
      setPage(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (data?.comments && data?.comments?.length > 0) {
      if (page === 1) {
        setComments(data?.comments);
      } else {
        setComments((prevData) => [...prevData, ...data?.comments]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  useEffect(() => {
    if (error) NotificationMessage("error", error?.message);
  }, [error]);

  if (data?.comments?.length === 0 && !isLoading) {
    return <EmptyData />;
  }

  return (
    <section>
      {page < 2 && isLoading ? (
        <>
          {Array(5)
            .fill(() => 0)
            .map((_: any, i: number) => (
              <CommentPostLoader key={i} />
            ))}
        </>
      ) : (
        <>
          <VirtualList
            listData={comments}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            limit={limit}
            renderComponent={(index: number, comment: IComment) => (
              <CommentPost key={index} commentData={comment} />
            )}
            footerHeight={50}
          />
          {isLoading && page > 1 && <CommentPostLoader />}
        </>
      )}
      {/* {!isLoading ? (
        <>
          <CommentPost />
          <CommentPost />
          <CommentPost />
        </>
      ) : (
        <>
          {Array(5)
            .fill(() => 0)
            .map((_: any, i: number) => (
              <CommentPostLoader key={i} />
            ))}
        </>
      )} */}
    </section>
  );
}
