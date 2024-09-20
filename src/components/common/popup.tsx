import { Popover } from "antd";
import { TooltipPlacement } from "antd/es/tooltip";
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
  onAction?: "click" | "hover";
  position?: TooltipPlacement;
  onSelect: (label: string) => void;
}

export default function CPopup({
  children,
  list,
  onAction = "click",
  position = "bottomRight",
  onSelect,
}: IPopup) {
  const content = (
    <div className='cpopup_content'>
      {list?.map(({ icon: Icon, label }: List) => (
        <div onClick={() => onSelect(label)} key={label} className='option'>
          {Icon && Icon}
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
  return (
    <Popover
      placement={position}
      className='filter_popover'
      overlayClassName='filter_popover'
      content={content}
      trigger={onAction}
    >
      {children}
    </Popover>
  );
}
