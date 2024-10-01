"use client";
import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoSearch } from "react-icons/io5";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useAsync from "@/hooks/useAsync";
import { fetchCommunities } from "@/services/api/api";
import { ICommunity } from "@/utils/types/types";
import Image from "next/image";
import { debounce, getImageSource, numberWithCommas } from "@/utils/helpers";
import { CloseIcon } from "@/assets/icons";

// TODO: UPDATE WITH API DATA
const communityList: ICommunity[] = [
  {
    id: 1,
    username: "TestCommunity",
    name: "TestCommunity",
    ticker: "UFT",
    img: {
      pro: "https://testcommunity.s3.amazonaws.com/05b06751-aef7-468b-89b5-02d42e2a1d47-unilend_finance_logo.jpeg",
      cvr: "https://testcommunity.s3.amazonaws.com/05b06751-aef7-468b-89b5-02d42e2a1d47-unilend_finance_logo.jpeg",
    },
    metadata: "unilend",
    pCount: 5,
    followers: 3,
    tSupply: 0,
    sts: 1,
    cta: "2024-09-03T07:09:26.687Z",
    uta: "2024-09-03T07:09:26.687Z",
  },
  {
    id: 2,
    username: "Unilend2",
    name: "Unilend",
    ticker: "UFT",
    img: {
      pro: "https://testcommunity.s3.amazonaws.com/05b06751-aef7-468b-89b5-02d42e2a1d47-unilend_finance_logo.jpeg",
      cvr: "https://testcommunity.s3.amazonaws.com/05b06751-aef7-468b-89b5-02d42e2a1d47-unilend_finance_logo.jpeg",
    },
    metadata: "unilend",
    pCount: 5,
    followers: 3,
    tSupply: 0,
    sts: 1,
    cta: "2024-09-03T07:09:26.687Z",
    uta: "2024-09-03T07:09:26.687Z",
  },
  {
    id: 3,
    username: "Unilend3",
    name: "Unilend",
    ticker: "UFT",
    img: {
      pro: "https://testcommunity.s3.amazonaws.com/05b06751-aef7-468b-89b5-02d42e2a1d47-unilend_finance_logo.jpeg",
      cvr: "https://testcommunity.s3.amazonaws.com/05b06751-aef7-468b-89b5-02d42e2a1d47-unilend_finance_logo.jpeg",
    },
    metadata: "unilend",
    pCount: 5,
    followers: 3,
    tSupply: 0,
    sts: 1,
    cta: "2024-09-03T07:09:26.687Z",
    uta: "2024-09-03T07:09:26.687Z",
  },
];

// export default function Searchbar() {
const Searchbar = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSearchPage = useMemo(() => {
    return pathname.split("/")[pathname.split("/").length - 1] === "search";
  }, [pathname]);
  // const {
  //   isLoading,
  //   data: communityList,
  //   refetch,
  // } = useAsync(fetchCommunities);
  const isCommunity = false;
  // TODO update community
  const community = "TestCommunity";
  const [searchVal, setSearchVal] = useState<string>("");
  const [suggestions, setSuggestions] = useState<ICommunity[]>([]);
  const [selectedData, setSelectedData] = useState<ICommunity[]>([]);
  const [focused, setFocused] = useState<boolean>(false);
  // console.log("communityList", communityList);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value);
  };

  // const debouncedHandleChange = useCallback(
  //   debounce((event: React.ChangeEvent<HTMLInputElement>) => {
  //     setSearchVal(event.target.value);
  //   }, 300),
  //   []
  // );

  const handleSelect = (community: ICommunity) => {
    setSelectedData([...selectedData, community]);
    // setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    // setSearchVal("");
    setSuggestions([]);
    inputRef?.current?.focus();
  };

  const handleRemoveSearch = (community: ICommunity) => {
    const updatedVal = selectedData.filter((item) => item.id !== community.id);
    setSelectedData(updatedVal);
  };

  const handleSearchVal = (val: string) => {
    if (isCommunity) {
      router.push(`/c/${community}/search?q=${encodeURIComponent(searchVal)}`);
    } else {
      router.push(`/search?q=${encodeURIComponent(searchVal)}`);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (event.key === "Enter") {
      if (isCommunity) {
        router.push(
          `/c/${community}/search?q=${encodeURIComponent(searchVal)}`
        );
      } else {
        router.push(`/search?q=${encodeURIComponent(searchVal)}`);
      }
    } else if (
      event.key === "Backspace" &&
      target?.value === "" &&
      selectedData?.length > 0
    ) {
      const lastCommunity = selectedData[selectedData.length - 1];
      handleRemoveSearch(lastCommunity);
      setSuggestions([]);
    }
  };

  const handleFocus = () => setFocused(true);
  const handleBlur = () => setFocused(false);

  useEffect(() => {
    if (searchVal.trim() === "") {
      setSuggestions([]);
      return;
    }
    setSuggestions(communityList);
  }, [searchVal]);
  useEffect(() => {
    if (isSearchPage) {
      setSearchVal(searchParams.get("q")?.toLocaleLowerCase() as string);
    }
  }, [isSearchPage]);
  return (
    <div className='search_container'>
      {/* <CInput
        prefix={<IoSearch />}
        placeholder='Search Post Here'
        className='search'
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      /> */}
      <div className='search_input'>
        {selectedData.length > 0 && (
          <div
            className='user_pill'
            onClick={() => handleRemoveSearch(selectedData[0])}
          >
            <Image
              src={selectedData[0]?.img.pro}
              alt={selectedData[0]?.username}
              width={16}
              height={16}
            />
            <span>{selectedData[0].metadata} &times;</span>
          </div>
        )}

        <input
          ref={inputRef}
          type='text'
          value={searchVal}
          onChange={handleChange}
          placeholder={
            selectedData.length == 1
              ? `Search in ${selectedData[0].username}`
              : "Search"
          }
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {searchVal && (
          <div className='close_icon' onClick={() => setSearchVal("")}>
            <CloseIcon />
          </div>
        )}
      </div>
      {focused && searchVal && (
        <>
          <li
            className='search_Suggestion'
            onClick={() => handleSearchVal(searchVal)}
          >
            <IoSearch />
            <span>{`Search For "${searchVal}"`}</span>
          </li>
          <ul className='suggestions_list'>
            {suggestions.length > 0 &&
              selectedData.length === 0 &&
              suggestions?.map((community: ICommunity) => (
                <li key={community.id} onClick={() => handleSelect(community)}>
                  <Image
                    src={getImageSource(community.img.pro, "c")}
                    alt={community?.username}
                    width={24}
                    height={24}
                    loading='lazy'
                  />
                  <span>{community?.username}</span>
                  <span>{numberWithCommas(community?.followers)} Members</span>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
});

export default Searchbar;
