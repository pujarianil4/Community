"use client";
import React, { useEffect, useMemo, useState } from "react";
import "../index.scss";
import {
  fetchDelegatesByUname,
  undoDelegateNetWorth,
  delegateNetWorth,
  getFollowersByUserId,
} from "@/services/api/userApi";
import { fetchNetworth } from "@/services/api/networthApi";
import { fetchVotedProposalsByUname } from "@/services/api/proposalApi";
import useAsync from "@/hooks/useAsync";
import CButton from "@/components/common/Button";
import { formatNumber, getImageSource, throwError } from "@/utils/helpers";
import { RootState } from "@/contexts/store";
import useRedux from "@/hooks/useRedux";
import DropdownWithSearch from "@/components/common/dropdownWithSearch";
import { IUser } from "@/utils/types/types";
import NotificationMessage from "@/components/common/Notification";
import Deligator from "./Deligator";
import ProposalWarning from "./ProposalWarning";
import CInput from "@/components/common/Input";
import EmptyData from "@/components/common/Empty";
import Image from "next/image";

export default function Deligate() {
  const userNameSelector = (state: RootState) => state?.user.profile;
  const [{}, [user]] = useRedux([userNameSelector]);
  const { isLoading: usersLoading, data: userList } = useAsync(
    getFollowersByUserId,
    {
      userId: user?.id,
      type: "u",
    }
  );
  const {
    isLoading: networthLoading,
    data: networthData,
    refetch: refetchNetworth,
  } = useAsync(fetchNetworth);

  const {
    error,
    data: proposalsData,
    refetch: refetchVoted,
  } = useAsync(fetchVotedProposalsByUname, {
    uname: user?.username,
    page: 1,
    limit: 100,
  });

  if (error) {
    throwError(error);
  }

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
  const [effectiveNetWrth, setEffectiveNetWrth] = useState<number>(0);
  const [isWarningModal, setWarningModal] = useState<boolean>(false);
  const [selectedToken, setSelectedToken] = useState<string>("");
  const [searchToken, setSearchToken] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [amountError, setAmountError] = useState<string>("");
  // TODO: update below 2 states after API update
  const [userNetworth, setUserNetworth] = useState<any>(null);
  const [delegatedTokens, setDelegatedTokens] = useState<
    Record<number, Set<string>>
  >({});
  const [tokens, setTokens] = useState<string[]>([]);
  const [btnLoader, setBtnLoader] = useState({ delegate: false, undoId: 0 });

  const delegateToken = async () => {
    const payload = {
      userId: selectedUser?.id as number,
      tkn: selectedToken,
      amount: Number(amount),
    };
    try {
      setBtnLoader({ ...btnLoader, delegate: true });
      await delegateNetWorth(payload);
      refetch();
      NotificationMessage(
        "success",
        `Deligation of ${amount} ${selectedToken} is successful`
      );
      setWarningModal(false);
      setAmount("");
      setSelectedUser(null);
      setSelectedToken("");
      refetchNetworth();
      setBtnLoader({ ...btnLoader, delegate: false });
    } catch (error: any) {
      NotificationMessage("error", error?.response.data.message);
      setWarningModal(false);
    }
  };

  const handleDelegate = async () => {
    const hasVoted = proposalsData?.some(
      (vote: any) => vote?.community?.ticker === selectedToken
    );

    if (hasVoted) {
      setWarningModal(true);
      return;
    } else {
      await delegateToken();
    }
  };

  const handleChange = (e: any) => {
    const inputValue = e.target.value;

    const regex = /^(\d+(\.\d{0,2})?|\.\d{1,2})?$/;

    if (regex.test(inputValue) || inputValue === "") {
      setAmount(inputValue);
    }
  };

  const handleCancel = async () => {
    setWarningModal(false);
  };

  const handleUndoDelegate = async (id: number, token: string) => {
    try {
      setBtnLoader({ ...btnLoader, undoId: id });
      await undoDelegateNetWorth({ delegateId: id, token });
      refetch();
      refetchNetworth();
      NotificationMessage(
        "success",
        `Delegation of ${token} is revoked sucessfully`
      );
      setBtnLoader({ ...btnLoader, undoId: 0 });
    } catch (error: any) {
      NotificationMessage("error", error?.response.data.message);
    }
  };

  const sumOfAllBalances = (key: string) => {
    return Object.values(userNetworth?.balances).reduce(
      (acc, asset: any) => acc + asset[key],
      0
    );
  };

  const handleSetmax = () => {
    const maxBal = userNetworth?.balances[selectedToken]?.effectiveNetWorth;
    if (maxBal) {
      setAmount(maxBal);
    } else if (true) {
      NotificationMessage("info", "Please select user and token first");
    } else {
      NotificationMessage("info", "Please select different token");
    }
  };

  useEffect(() => {
    const newDelegatedTokens: Record<number, Set<string>> = {};
    data?.forEach((item: any) => {
      if (!newDelegatedTokens[item.dgte]) {
        newDelegatedTokens[item.dgte] = new Set();
      }
      newDelegatedTokens[item.dgte].add(item.tkn);
    });
    setDelegatedTokens(newDelegatedTokens);
  }, [data]);

  useEffect(() => {
    const currentUserData = networthData?.find(
      (item: any) => item.id === user?.id
    );
    if (currentUserData) {
      const allTokens = Object.keys(currentUserData?.balances);
      const availableTokens = allTokens.filter(
        (token) =>
          !Object.entries(delegatedTokens).some(
            ([userId, tokensSet]) =>
              Number(userId) !== selectedUser?.id && tokensSet.has(token)
          )
      );
      console.log("delegatedTokens", delegatedTokens);
      setTokens(availableTokens);
    }
  }, [selectedUser, delegatedTokens, networthData]);

  useEffect(() => {
    const currentEffectiveNetworth =
      userNetworth?.balances[selectedToken]?.effectiveNetWorth;
    if (Number(amount > currentEffectiveNetworth)) {
      setAmountError(`Amount should be less than ${currentEffectiveNetworth}`);
    } else {
      setAmountError("");
    }
  }, [amount]);

  useEffect(() => {
    const currentUserData = networthData?.find(
      (item: any) => item.id === user?.id
    );
    const allTokens = currentUserData && Object.keys(currentUserData?.balances);
    setUserNetworth(currentUserData);
    setTokens(allTokens);
  }, [networthData]);

  useEffect(() => {
    if (userNetworth) {
      setEffectiveNetWrth(sumOfAllBalances("effectiveNetWorth") as number);
    }
  }, [userNetworth]);
  return (
    <>
      <div className='my_delegate'>
        <p>
          Networth:{" "}
          {userNetworth && formatNumber(sumOfAllBalances("netWorth") as number)}
        </p>
        <p>
          Effective Networth:{" "}
          {userNetworth && formatNumber(effectiveNetWrth || 0)}
        </p>
      </div>

      <section>
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
          <DropdownWithSearch
            onSelect={setSelectedToken}
            options={tokens}
            searchTerm={searchToken}
            setSearchTerm={setSearchToken}
            selected={selectedToken}
            placeholder='Select Token'
            isStringArray={true}
          />
          <div className='input_with_max'>
            <CInput
              className='input_container'
              name='amount'
              placeHolder='Enter amount'
              value={amount}
              onChange={handleChange}
              autoComplete='off'
            />
            <CButton onClick={handleSetmax}>Max</CButton>
          </div>
          {<p className='amount_error'>{amountError ? amountError : ` `}</p>}
          <CButton
            disabled={selectedUser === null || !selectedToken || !amount}
            onClick={handleDelegate}
            loading={btnLoader?.delegate}
          >
            Delegate
          </CButton>
        </div>
        <p className='d_head'>Deligate</p>
      </section>

      {isLoading ? (
        <>
          {Array(3)
            .fill(() => 0)
            .map((_, index) => (
              <div key={index} className='delegate_loader skeleton'></div>
            ))}
        </>
      ) : data?.length === 0 ? (
        <EmptyData />
      ) : (
        <section
          className={`delegation_list ${
            data?.length > 4 ? "right_padding" : ""
          }`}
        >
          {data?.map((item: any) => (
            <div className='delegate_item' key={item.id}>
              {/* Required User Details like img */}
              <div>
                <Image
                  src={getImageSource(item?.delegatee?.img?.pro, "u")}
                  alt={item?.delegatee?.username}
                  loading='lazy'
                  width={32}
                  height={32}
                />
                <p>{item?.delegatee?.username}</p>
              </div>
              <p>{`value: ${formatNumber(item?.value)} ${item?.tkn}`}</p>
              <CButton
                onClick={() => handleUndoDelegate(item?.dgte, item?.tkn)}
                loading={btnLoader?.undoId === item?.dgte}
              >
                Undo
              </CButton>
            </div>
          ))}
        </section>
      )}
      <Deligator />
      <ProposalWarning
        isModalOpen={isWarningModal}
        onClose={handleCancel}
        onProceed={delegateToken}
      />
    </>
  );
}
