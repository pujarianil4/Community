"use client";
import React from "react";
import "./index.scss";
import Card from "../card";
import useAsync from "@/hooks/useAsync";
import { fetchCommunities } from "@/services/api/api";
import { ICommunity, IUser } from "@/utils/types/types";

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
    <main className='communities'>
      {dummyData &&
        dummyData?.map((card) => (
          <Card key={card.id} cardData={card} type='c' />
        ))}
    </main>
  );
}
