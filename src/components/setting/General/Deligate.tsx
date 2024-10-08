"use client";
import React, { useMemo, useState } from "react";
import { Collapse } from "antd";
import { DropdownLowIcon } from "@/assets/icons";
import {
  delegateNetWorth,
  fetchDelegatesByUname,
  getFollowersByUserId,
  undoDelegateNetWorth,
} from "@/services/api/api";
import useAsync from "@/hooks/useAsync";
import CButton from "@/components/common/Button";
import { numberWithCommas } from "@/utils/helpers";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import DropdownWithSearch from "@/components/createPost/dropdownWithSearch";
import { IUser } from "@/utils/types/types";
import Deligator from "./Deligator";
import NotificationMessage from "@/components/common/Notification";

const { Panel } = Collapse;

export default function Deligate() {
  const userNameSelector = (state: RootState) => state?.user;
  const [{}, [user]] = useRedux([userNameSelector]);
  const { isLoading: usersLoading, data: userList } = useAsync(
    getFollowersByUserId,
    {
      userId: user?.uid,
      type: "u",
    }
  );
  const userData = useMemo(() => {
    return userList?.map((item: any) => item?.user);
  }, [userList]);
  const payload = {
    username: user?.username,
    type: "dgtr",
    page: 1,
    limit: 10,
  };
  const { isLoading, data, refetch } = useAsync(fetchDelegatesByUname, payload);
  const [selectedUser, setSelectedUser] = useState<IUser | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [effectiveNetWrth, setEffectiveNetWrth] = useState<number>(
    user?.effectiveNetWrth || 0
  );

  const handleDelegate = async () => {
    try {
      setEffectiveNetWrth(0);
      await delegateNetWorth(selectedUser?.id as number);
      refetch();
    } catch (error: any) {
      NotificationMessage("error", error?.response.data.message);
    }
  };

  const handleUndoDelegate = async (id: number) => {
    setEffectiveNetWrth(user?.effectiveNetWrth);
    await undoDelegateNetWorth(id);
    refetch();
  };
  return (
    <>
      <div className='my_delegate'>
        <p>Networth: {user?.netWrth}</p>
        <p>Effective Networth: {effectiveNetWrth}</p>
      </div>

      {isLoading ? (
        <div className='delegate_loader skeleton'></div>
      ) : data?.length > 0 ? (
        <>
          {data?.map((item: any) => (
            <div className='delegate_item' key={item.id}>
              {/* Required User Details like img */}
              <p>user: {item?.delegatee?.username}</p>
              <p>networth: {numberWithCommas(item?.delegatee?.netWrth)}</p>
              <p>
                effective networth:
                {numberWithCommas(item?.delegatee?.effectiveNetWrth)}
              </p>
              <CButton onClick={() => handleUndoDelegate(item?.dgte)}>
                Undo
              </CButton>
            </div>
          ))}
        </>
      ) : (
        <>
          {!usersLoading ? (
            <div className='delegate_container'>
              <DropdownWithSearch
                onSelect={setSelectedUser}
                options={userData}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                // selected={selectedUser}
                isUser
                placeholder='Select User'
              />
              <CButton disabled={!searchTerm} onClick={handleDelegate}>
                Delegate
              </CButton>
            </div>
          ) : (
            <div className='delegate_loader skeleton'></div>
          )}
        </>
      )}
      <Deligator />
    </>
  );
}
