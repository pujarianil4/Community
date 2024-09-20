"use client";
import React from "react";
import useAsync from "@/hooks/useAsync";
import { fetchCommunities } from "@/services/api/api";
import CardList from "@/components/cardList";
import { ICommunity } from "@/utils/types/types";

interface List {
  value: string;
  title: string;
}

export default function CommunitiesList() {
  const {
    isLoading,
    data: communityData,
    refetch,
    callFunction,
  } = useAsync(fetchCommunities, "followers");
  const handleFilter = (filter: List) => {
    callFunction(fetchCommunities, filter.value);
  };
  return (
    <>
      <CardList
        cardListData={communityData as ICommunity[]}
        type='c'
        showFilters
        handleFilter={(filter) => handleFilter(filter)}
        isLoading={isLoading}
      />
    </>
  );
}
