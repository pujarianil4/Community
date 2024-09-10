"use client";

import React, { useState } from "react";
import { Input, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import CInput from "../common/Input";
import Image from "next/image";
import { getImageSource } from "@/utils/helpers";
import { ICommunity } from "@/utils/types/types";
import PageLoader from "../common/loaders/pageLoader";
import ProfilelistLoader from "../common/loaders/profilelist";
import { IoSearch } from "react-icons/io5";

interface DropdownWithSearchProps {
  onSelect: (value: ICommunity) => void;
  options: ICommunity[];
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
}

const DropdownWithSearch: React.FC<DropdownWithSearchProps> = ({
  onSelect,
  options,
  searchTerm,
  setSearchTerm,
}) => {
  const [visible, setVisible] = useState(false);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setVisible(true);
  };

  const handleFocus = () => {
    setVisible(true);
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
          value={searchTerm}
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
                  {/* <div className='dropdown_item'>
                    <Image
                      src={getImageSource(item?.img?.pro, "c")}
                      alt={item?.name}
                      width={32}
                      height={32}
                    />
                    <div className='post_search_data'>
                      <div className='community_name'>{item.username}</div>
                      <div className='followers'>{item.followers} Members</div>
                    </div>
                  </div> */}
                  <div className='c_post'>
                    <Image
                      src={getImageSource(item?.logo, "c")}
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
