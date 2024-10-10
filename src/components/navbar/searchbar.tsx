/* eslint-disable react-hooks/exhaustive-deps */
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
import { fetchSearchData } from "@/services/api/searchApi";
import { ICommunity, IPost, IUser } from "@/utils/types/types";
import Image from "next/image";
import { debounce, getImageSource, numberWithCommas } from "@/utils/helpers";
import { CloseIcon } from "@/assets/icons";

interface IPagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface ISuggestions {
  posts: {
    data: IPost[];
    pagination: IPagination;
  };
  comments: {
    data: any[];
    pagination: IPagination;
  };
  communities: {
    data: ICommunity[];
    pagination: IPagination;
  };
  users: {
    data: IUser[];
    pagination: IPagination;
  };
}

// export default function Searchbar() {
const Searchbar = memo(() => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isSearchPage = useMemo(() => {
    return pathname.split("/")[pathname.split("/").length - 1] === "search";
  }, [pathname]);

  const initialPagination = {
    currentPage: 1,
    totalPages: 2,
    totalItems: 20,
    itemsPerPage: 10,
  };

  const initialSuggetion: ISuggestions = {
    posts: {
      data: [],
      pagination: initialPagination,
    },
    comments: {
      data: [],
      pagination: initialPagination,
    },
    communities: {
      data: [],
      pagination: initialPagination,
    },
    users: {
      data: [],
      pagination: initialPagination,
    },
  };

  const isCommunity = false;
  // TODO update community
  // const community = "TestCommunity";
  const [searchVal, setSearchVal] = useState<string>("");
  const [suggestions, setSuggestions] =
    useState<ISuggestions>(initialSuggetion);
  const [selectedData, setSelectedData] = useState<ICommunity[] | IUser[]>([]); // TODO add condition to remove the data
  const [selectionType, setSelectionType] = useState<"u" | "c" | null>(null);
  console.log("selectedData", selectedData);
  console.log("selectionType", selectionType);
  const [focused, setFocused] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchPayload = {
    search: searchVal,
    page: 1,
    limit: 10,
  };

  const {
    isLoading,
    data: searchData,
    callFunction,
  } = useAsync(fetchSearchData, searchPayload);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchVal(event.target.value);
  };

  // const debouncedHandleChange = useCallback(
  //   debounce((event: React.ChangeEvent<HTMLInputElement>) => {
  //     setSearchVal(event.target.value);
  //   }, 300),
  //   []
  // );

  const handleSelect = (data: ICommunity | IUser, type: "u" | "c") => {
    setSelectedData([...selectedData, data]);
    setSelectionType(type);
    // console.log("PATH_", `/${type === "c" ? "c" : "u"}/${data?.username}`);
    // router.push(`/${type === "c" ? "c" : "u"}/${data?.username}`);
    console.log("COMMUNIYT", selectedData, data);
    // setSelectedUserSet(new Set([...selectedUserSet, user.email]));
    setSearchVal("");
    setSuggestions(initialSuggetion);
    inputRef?.current?.focus();
  };

  const handleRemoveSearch = (data: ICommunity | IUser) => {
    const updatedVal = selectedData?.filter((item) => item.id !== data.id);
    setSelectedData(updatedVal);
  };

  const handleSearchVal = (val: string) => {
    const type = searchParams.get("type"); // Get the current type
    let searchUrl = `/search?q=${encodeURIComponent(searchVal)}`;

    if (selectionType === "c" && selectedData[0]?.username) {
      searchUrl = `/c/${
        selectedData[0]?.username
      }/search?q=${encodeURIComponent(searchVal)}`;
    } else if (selectionType === "u" && selectedData[0]?.username) {
      searchUrl = `/u/${
        selectedData[0]?.username
      }/search?q=${encodeURIComponent(searchVal)}`;
    }

    if (!selectedData[0]?.username) {
      setSelectionType(null);
    }

    if (type) {
      searchUrl += `&type=${type}`;
    }

    router.push(searchUrl);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (event.key === "Enter") {
      if (isCommunity) {
        router.push(
          `/c/${selectedData[0]?.username}/search?q=${encodeURIComponent(
            searchVal
          )}`
        );
      } else {
        router.push(`/search?q=${encodeURIComponent(searchVal)}`);
      }
    } else if (
      event.key === "Backspace" &&
      target?.value === "" &&
      selectedData?.length > 0
    ) {
      const lastSelect = selectedData[selectedData.length - 1];
      handleRemoveSearch(lastSelect);
      setSuggestions(initialSuggetion);
    }
  };

  const handleFocus = () => setFocused(true);
  // const handleBlur = () => setFocused(false);

  // useEffect(() => {
  //   const handleClickOutside = (event: MouseEvent) => {
  //     if (
  //       suggestionsRef.current &&
  //       !suggestionsRef?.current.contains(event?.target as Node)
  //     ) {
  //       setFocused(false);
  //     }
  //   };

  //   document.addEventListener("mousedown", handleClickOutside);

  //   return () => {
  //     document.removeEventListener("mousedown", handleClickOutside);
  //   };
  // }, []);

  useEffect(() => {
    if (searchVal.length > 2) {
      callFunction(fetchSearchData, { ...searchPayload, search: searchVal });
    }
  }, [searchVal]);

  useEffect(() => {
    if (searchVal.trim() === "") {
      setSuggestions(initialSuggetion);
      return;
    }
    setSuggestions(searchData); //communities
  }, [searchVal, searchData]);

  useEffect(() => {
    if (isSearchPage) {
      setSearchVal(searchParams.get("q")?.toLocaleLowerCase() as string);
    }
  }, [isSearchPage]);
  return (
    <div className='search_container'>
      <div className='search_input'>
        {selectedData.length > 0 && (
          <div
            className='user_pill'
            onClick={() => handleRemoveSearch(selectedData[0])}
          >
            <Image
              src={selectedData[0]?.img?.pro}
              alt={selectedData[0]?.username}
              width={24}
              height={24}
            />
            <span>{selectedData[0]?.username} &times;</span>
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
          // onBlur={handleBlur}
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
            {suggestions?.communities?.data?.length > 0 &&
              selectedData?.length === 0 && <h2>Community</h2>}
            {suggestions?.communities?.data?.length > 0 &&
              selectedData?.length === 0 &&
              suggestions?.communities?.data?.map((community: ICommunity) => (
                <li
                  key={community.id}
                  onClick={() => handleSelect(community, "c")}
                >
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
            {suggestions?.users?.data?.length > 0 &&
              selectedData?.length === 0 && <h2>Users</h2>}
            {suggestions?.users?.data?.length > 0 &&
              selectedData?.length === 0 &&
              suggestions?.users?.data?.map((user: IUser) => (
                <li key={user.id} onClick={() => handleSelect(user, "u")}>
                  <Image
                    src={getImageSource(user?.img?.pro, "u")}
                    alt={user?.username}
                    width={24}
                    height={24}
                    loading='lazy'
                  />
                  <span>{user?.username}</span>
                  <span>
                    {numberWithCommas(user?.fwrs || 0)} &nbsp;
                    {user?.fwrs == 1 ? "Follower" : "Followers"}
                  </span>
                </li>
              ))}
          </ul>
        </>
      )}
    </div>
  );
});

Searchbar.displayName = "Searchbar";
export default Searchbar;
