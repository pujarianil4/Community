"use client";
import React, { useEffect } from "react";
import useAsync from "@/hooks/useAsync";
import { fetchCommunities } from "@/services/api/communityApi";
import CardList from "@/components/cardList";
import { ICommunity } from "@/utils/types/types";

import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";

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
