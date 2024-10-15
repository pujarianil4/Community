/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import "./index.scss";
import useAsync from "@/hooks/useAsync";
import { fetchSearchByUserData } from "@/services/api/searchApi";
import { IUser } from "@/utils/types/types";
import { useSearchParams } from "next/navigation";
import EmptyData from "../common/Empty";
import NotificationMessage from "../common/Notification";
import Card from "../cardList/card";
import CardListLoader from "../cardList/cardListLoader";
import VirtualList from "../common/virtualList";

interface IProps {
  usersData?: IUser[];
}
export default function User({ usersData }: IProps) {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("q");
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<IUser[]>([]);
  const limit = 10;
  const payload = {
    search: searchQuery,
    page,
    limit,
  };
  // const { isLoading, data, refetch } = useAsync(getFollowersByUserId, {
  //   userId: 5,
  //   type: "u",
  // });
  const { error, isLoading, data, refetch } = useAsync(
    fetchSearchByUserData,
    payload
  );

  useEffect(() => {
    if (searchQuery) {
      setUsers([]);
      refetch();
      setPage(1);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (data?.users && data?.users?.length > 0) {
      if (page === 1) {
        setUsers(data?.users);
      } else {
        setUsers((prevData) => [...prevData, ...data?.users]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (page !== 1) refetch();
  }, [page]);

  useEffect(() => {
    if (error) NotificationMessage("error", error?.message);
  }, [error]);

  if (data?.users?.length === 0 && !isLoading) {
    return <EmptyData />;
  }

  return (
    // <CardList
    //   cardListData={data?.users as IUser[]}
    //   type='u'
    //   isLoading={isLoading}
    // />
    <main>
      {/* {true ? ( */}
      {page < 2 && isLoading ? (
        <>
          <div className='communities'>
            {Array(12)
              .fill(() => 0)
              .map((_: any, i: number) => (
                <CardListLoader key={i} />
              ))}
          </div>
        </>
      ) : (
        <>
          <VirtualList
            listData={users}
            isLoading={isLoading}
            page={page}
            setPage={setPage}
            limit={limit}
            isGrid={true}
            itemWidth={200}
            renderComponent={(index: number, users: IUser) => (
              <Card key={index} cardData={users as IUser} type='u' />
            )}
            footerHeight={50}
          />
          {isLoading && page > 1 && <CardListLoader />}
        </>
      )}
    </main>
  );
}
