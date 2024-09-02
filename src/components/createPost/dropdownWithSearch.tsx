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
      <CInput
        className='dropdown_input'
        placeholder='Select community'
        suffix={<SearchOutlined />}
        value={searchTerm}
        onChange={handleSearch}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />

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
                  <div className='dropdown_item'>
                    <Image
                      src={getImageSource(item?.logo, "c")}
                      alt={item?.name}
                      width={32}
                      height={32}
                    />
                    <div>
                      <p className='community_name'>{item.username}</p>
                      <p className='followers'>{item.followers} followers</p>
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
