import { Popover } from "antd";
import React from "react";
import { IoIosMore } from "react-icons/io";
import "./index.scss";
interface List {
  label: string;
  icon?: any;
}
interface IPopup {
  children: React.ReactNode;
  list: Array<List>;
}

export default function CPopup({ children, list }: IPopup) {
  const content = (
    <div className='cpopup_content'>
      {list?.map(({ icon: Icon, label }: List) => (
        <div className='option'>
          {Icon && Icon}
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
  return (
    <Popover
      placement='bottomRight'
      className='filter_popover'
      overlayClassName='filter_popover'
      content={content}
      trigger='click'
    >
      {children}
    </Popover>
  );
}
