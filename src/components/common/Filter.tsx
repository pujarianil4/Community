import { Popover } from "antd";
import React, { useState } from "react";
import { GoChevronDown } from "react-icons/go";
import "./index.scss";

interface List {
  value: string;
  title: string;
}
interface ICFilter {
  list: Array<List>;
  callBack: (s: List) => void;
  defaultListIndex: number;
  selectedFilter?: string;
}

export default function CFilter({
  list,
  callBack,
  defaultListIndex,
  selectedFilter, // Use selectedFilter
}: ICFilter) {
  const [selected, setSelected] = useState(
    selectedFilter || list[defaultListIndex].title
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (listItem: List) => {
    callBack(listItem);
    setSelected(listItem.title);
    setIsOpen(false);
  };

  const content = (
    <div className='filter_list'>
      {list?.map((item: List, i: number) => (
        <p key={i} onClick={() => handleSelect(item)}>
          {item.title}
        </p>
      ))}
    </div>
  );

  return (
    <div className='cfilter_container'>
      <Popover
        placement='bottomRight'
        className='filter_popover'
        overlayClassName='filter_popover'
        open={isOpen}
        onOpenChange={setIsOpen}
        content={content}
        trigger='click'
      >
        <div className='cfilter'>
          <span>{selected}</span>
          <GoChevronDown className='downarrow' size={20} />
        </div>
      </Popover>
    </div>
  );
}
