"use client";
import React from "react";
// import "./index.scss";
import useAsync from "@/hooks/useAsync";
import { fetchCommunities } from "@/services/api/api";
import CardList from "@/components/cardList";
import { ICommunity } from "@/utils/types/types";

export default function Communities() {
  const { isLoading, data, refetch } = useAsync(fetchCommunities, "followers");
  console.log("COMMUNITY_DATA", data);
  const dummyData = data?.length > 0 && [
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
    ...data,
  ];
  return (
    <>
      <CardList
        cardListData={dummyData as ICommunity[]}
        type='c'
        isLoading={isLoading}
      />
    </>
  );
}
