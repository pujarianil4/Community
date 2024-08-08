"use client";

import React, { useState } from "react";
import { Input, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import CInput from "../common/Input";
import Image from "next/image";

export interface ICommunity {
  id: number;
  username: string;
  name: string;
  ticker: string;
  logo: string;
  metadata: string;
  pCount: number;
  followers: number;
  totalSupply: number;
  sts: number;
  cta: string;
  uta: string;
}

interface DropdownWithSearchProps {
  onSelect: (value: ICommunity) => void;
  options: ICommunity[];
}

const DropdownWithSearch: React.FC<DropdownWithSearchProps> = ({
  onSelect,
  options,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [visible, setVisible] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

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
    onSelect(item);
    // setSelectedValue(value);
    // console.log("SEARCH", item);
    setSearchTerm(item?.username);
    setVisible(false);
  };

  const getImageSource = (logo: string) => {
    if (
      logo &&
      (logo.startsWith("http://") ||
        logo.startsWith("https://") ||
        logo.startsWith("/"))
    ) {
      return logo;
    } else {
      return "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
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
          <List
            className='dropdown_list'
            dataSource={options?.filter((option) =>
              option?.username.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            renderItem={(item) => (
              <List.Item onClick={() => handleSelect(item)}>
                <div className='dropdown_item'>
                  {/* <img src={item.logo} alt={item.username} /> */}
                  <Image
                    src={getImageSource(item?.logo)}
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
        </div>
      )}
    </main>
  );
};

export default DropdownWithSearch;
