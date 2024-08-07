"use client";

import React, { useState } from "react";
import { Input, List } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import CInput from "../common/Input";
import Image from "next/image";

interface DropdownWithSearchProps {
  onSelect: (value: string) => void;
  options: string[]; // Assuming options is an array of strings
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

  const handleSelect = (value: string) => {
    onSelect(value);
    // setSelectedValue(value);
    setSearchTerm(value);
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
          <List
            className='dropdown_list'
            dataSource={options?.filter((option) =>
              option?.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            renderItem={(item) => (
              <List.Item onClick={() => handleSelect(item)}>
                {/* <Image
                  loading='lazy'
                  src='https://cdn.vectorstock.com/i/1000x1000/26/37/user-profile-icon-in-flat-style-member-avatar-vector-45692637.webp'
                  alt='user_img'
                  width={24}
                  height={24}
                /> */}
                {item}
              </List.Item>
            )}
          />
        </div>
      )}
    </main>
  );
};

export default DropdownWithSearch;
