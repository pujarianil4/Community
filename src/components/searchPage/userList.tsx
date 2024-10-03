import React, { useMemo } from "react";
import "./index.scss";
import useAsync from "@/hooks/useAsync";
import { getFollowersByUserId } from "@/services/api/api";
import CardList from "../cardList";
import { IUser } from "@/utils/types/types";

export default function User() {
  const { isLoading, data, refetch } = useAsync(getFollowersByUserId, {
    userId: 5,
    type: "u",
  });
  const userData = useMemo(() => {
    return data?.map((item: any) => item.user);
  }, [data]);
  return (
    <CardList
      cardListData={userData as IUser[]}
      type='u'
      isLoading={isLoading}
    />
  );
}
