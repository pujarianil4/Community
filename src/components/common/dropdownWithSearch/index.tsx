"use client";

import React, { useEffect, useState } from "react";
import "./index.scss";
import { List } from "antd";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import { getImageSource } from "@/utils/helpers";
import EmptyData from "../Empty";
import ProfilelistLoader from "../loaders/profilelist";
import { CloseIcon } from "@/assets/icons";

interface DropdownWithSearchProps {
  onSelect: (value: any) => void;
  options: any[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selected?: any | null;
  isUser?: boolean;
  placeholder?: string;
  defaultCommunity?: any;
  isStringArray?: boolean;
}

const DropdownWithSearch: React.FC<DropdownWithSearchProps> = ({
  onSelect,
  options,
  searchTerm,
  setSearchTerm,
  selected,
  isUser = false,
  placeholder = "Select Community",
  defaultCommunity,
  isStringArray = false,
}) => {
  const [visible, setVisible] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setVisible(true);
    if (value === "") {
      onSelect(null);
    }
  };

  const handleFocus = () => {
    setVisible(true);
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement, Element>) => {
    // if (
    //   !e.currentTarget.contains(e.relatedTarget as Node) &&
    //   e.relatedTarget?.className !== "dropdown_list"
    // ) {
    //   setVisible(false);
    // }
    setTimeout(() => {
      setVisible(false);
    }, 300);
  };

  const handleSelect = (item: any) => {
    if (onSelect) {
      onSelect(item);
    }

    setSearchTerm(isStringArray ? item : item?.username);
    setVisible(false);
  };

  const handleClose = () => {
    setSearchTerm("");
  };

  useEffect(() => {
    if (selected) {
      setSearchTerm(isStringArray ? selected : selected?.username);
    } else {
      onSelect("");
      setSearchTerm("");
    }
  }, [selected, isStringArray]);

  return (
    <main className='dropdown_with_search'>
      {!defaultCommunity && (
        <div className='search_input'>
          <IoSearch className='s_icon' />
          <input
            className='dropdown_input'
            placeholder={placeholder}
            value={searchTerm}
            onChange={handleSearch}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
          {searchTerm && (
            <div className='close_icon' onClick={handleClose}>
              <CloseIcon />
            </div>
          )}
        </div>
      )}
      {visible && (
        <div className='custom_dropdown'>
          {options?.length > 0 ? (
            <List
              className='dropdown_list'
              dataSource={options?.filter((option) =>
                isStringArray
                  ? option.toLowerCase().includes(searchTerm.toLowerCase())
                  : option?.username
                      ?.toLowerCase()
                      .includes(searchTerm?.toLowerCase())
              )}
              renderItem={(item) => (
                <List.Item onClick={() => handleSelect(item)}>
                  {isStringArray ? (
                    <div className='c_post'>
                      <div className='u_bx'>
                        <span className='u_txt'>{item}</span>
                      </div>
                    </div>
                  ) : (
                    <div className='c_post'>
                      <Image
                        src={getImageSource(item?.img?.pro, "c")}
                        alt={item?.name}
                        width={32}
                        height={32}
                      />
                      <div className='u_bx'>
                        <span className='u_txt'>{item.username}</span>
                        {!isUser && (
                          <span className='u_follow'>
                            {item.followers} Members
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </List.Item>
              )}
            />
          ) : options?.length === 0 ? (
            <>
              <EmptyData />
            </>
          ) : (
            <ProfilelistLoader />
          )}
        </div>
      )}
    </main>
  );
};

export default DropdownWithSearch;
