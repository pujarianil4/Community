"use client";

import React, { useState } from "react";
import { List } from "antd";
import { IoSearch } from "react-icons/io5";
import Image from "next/image";
import { getImageSource } from "@/utils/helpers";
import { ICommunity } from "@/utils/types/types";
import ProfilelistLoader from "../common/loaders/profilelist";

interface DropdownWithSearchProps {
  onSelect: (value: ICommunity) => void;
  options: ICommunity[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  selected: ICommunity | null;
  defaultCommunity?: ICommunity;
}

const DropdownWithSearch: React.FC<DropdownWithSearchProps> = ({
  onSelect,
  options,
  searchTerm,
  setSearchTerm,
  selected,
}) => {
  const [visible, setVisible] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setVisible(true);
  };

  const handleFocus = () => {
    setVisible(true);
    if (selected) {
      setSearchTerm(""); // Clear the search term when focusing on the input again
    }
  };

  const handleBlur = () => {
    setTimeout(() => {
      setVisible(false);
    }, 200);
  };

  const handleSelect = (item: ICommunity) => {
    if (onSelect) {
      onSelect(item);
    }
    setSearchTerm(item?.username);
    setVisible(false);
  };

  return (
    <main className='dropdown_with_search'>
      <div className='search_input'>
        <IoSearch className='s_icon' />
        <input
          className='dropdown_input'
          placeholder='Select Community'
          value={selected ? selected.username : searchTerm}
          onChange={handleSearch}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
      </div>
      {visible && (
        <div className='custom_dropdown'>
          {options?.length > 0 ? (
            <List
              className='dropdown_list'
              dataSource={options?.filter((option) =>
                option?.username
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )}
              renderItem={(item) => (
                <List.Item onClick={() => handleSelect(item)}>
                  <div className='c_post'>
                    <Image
                      src={getImageSource(item?.img?.pro, "c")}
                      alt={item?.name}
                      width={32}
                      height={32}
                    />
                    <div className='u_bx'>
                      <span className='u_txt'>{item.username}</span>
                      <span className='u_follow'>{item.followers} Members</span>
                    </div>
                  </div>
                </List.Item>
              )}
            />
          ) : (
            <ProfilelistLoader />
          )}
        </div>
      )}
    </main>
  );
};

export default DropdownWithSearch;
