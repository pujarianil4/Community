import React from "react";
import "./index.scss";
import CommentPost from "./commentPost";
import CommentPostLoader from "./commentPostLoader";
import EmptyData from "@/components/common/Empty";

export default function SearchComments() {
  // TODO: apply loader condition and Null condition;
  const isLoading = false;

  // if (!isLoading && "Nodata Condition") {
  //   return <EmptyData />;
  // }

  return (
    <section>
      {!isLoading ? (
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
      )}
    </section>
  );
}
