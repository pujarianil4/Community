import React from "react";
import "./index.scss";
import useAsync from "@/hooks/useAsync";
import { getFollowersByUserId } from "@/services/api/api";
import Card from "../card";

export default function User() {
  const { isLoading, data, refetch } = useAsync(getFollowersByUserId, {
    userId: 1,
    type: "u",
  });
  console.log("USER_DATA", data);
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
    <main className='user'>
      {dummyData &&
        dummyData?.map((card) => (
          <Card key={card.id} cardData={card.user} type='u' />
        ))}
    </main>
  );
}
