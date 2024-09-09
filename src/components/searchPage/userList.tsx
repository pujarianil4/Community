import React from "react";
import "./index.scss";
import useAsync from "@/hooks/useAsync";
import { getFollowersByUserId } from "@/services/api/api";
import CardList from "../cardList";
import { IUser } from "@/utils/types/types";

export default function User() {
  const { isLoading, data, refetch } = useAsync(getFollowersByUserId, {
    userId: 1,
    type: "u",
  });
  console.log("USER_DATA", data);
  const tempData = data?.map((user: any) => user.user);
  const dummyData = tempData?.length > 0 && [
    ...tempData,
    ...tempData,
    ...tempData,
    ...tempData,
    ...tempData,
    ...tempData,
    ...tempData,
  ];
  return (
    <>
      <CardList cardListData={dummyData as IUser[]} type='u' />
    </>
  );
}
