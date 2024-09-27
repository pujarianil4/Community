"use client";
import React, { useMemo, useState } from "react";
import { Collapse } from "antd";
import { DropdownLowIcon } from "@/assets/icons";
import {
  delegateNetWorth,
  fetchDelegatesByUname,
  getFollowinsByUserId,
  undoDelegateNetWorth,
} from "@/services/api/api";
import useAsync from "@/hooks/useAsync";
import CButton from "@/components/common/Button";
import { numberWithCommas } from "@/utils/helpers";
import EmptyData from "@/components/common/Empty";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import DropdownWithSearch from "@/components/createPost/dropdownWithSearch";
import { IUser } from "@/utils/types/types";

const { Panel } = Collapse;

export default function Deligate() {
  const userNameSelector = (state: RootState) => state?.user;
  const [{}, [user]] = useRedux([userNameSelector]);
  const { isLoading: usersLoading, data: userList } = useAsync(
    getFollowinsByUserId,
    {
      userId: user?.uid,
      type: "u",
    }
  );
  const userData = useMemo(() => {
    return userList?.map((item: any) => item?.followedUser);
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

  const handleDelegate = async () => {
    await delegateNetWorth(selectedUser?.id as number);
    refetch();
  };

  const handleUndoDelegate = async (id: number) => {
    await undoDelegateNetWorth(id);
    refetch();
  };
  return (
    <Collapse accordion style={{ marginTop: "16px" }}>
      <Panel
        header='Deligate'
        key='1'
        extra={<DropdownLowIcon fill='#EBB82A' width={13} height={7} />}
      >
        <div>
          <p>networth: {user?.netWrth}</p>
          <p>effective networth: {user?.effectiveNetWrth}</p>
        </div>

        <>
          {isLoading ? (
            <p>Loading...</p>
          ) : data?.length > 0 ? (
            <>
              {data?.map((item: any) => (
                <div className='deligat_item' key={item.id}>
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
                    selected={selectedUser}
                    isUser
                    placeholder='Select User'
                  />
                  <CButton onClick={handleDelegate}>Delegate</CButton>
                </div>
              ) : (
                <p>Loading...</p>
              )}
            </>
          )}
        </>
      </Panel>
    </Collapse>
  );
}
