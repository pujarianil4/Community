"use client";
import React from "react";
// import "./index.scss";
import useAsync from "@/hooks/useAsync";
import { fetchCommunities } from "@/services/api/api";
import CardList from "@/components/cardList";
import { ICommunity } from "@/utils/types/types";

export default function Communities() {
  const { isLoading, data, refetch } = useAsync(fetchCommunities, "followers");

  return (
    <CardList
      cardListData={data as ICommunity[]}
      type='c'
      isLoading={isLoading}
    />
  );
}
