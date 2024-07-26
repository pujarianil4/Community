import React from "react";
import { Tabs } from "antd";
import type { TabsProps } from "antd";

interface TabItem {
  key: string;
  label: string;
  content: React.ReactNode;
}

interface TabsComponentProps {
  defaultActiveKey?: string;
  items: TabItem[];
  onChange?: (key: string) => void;
}
const CTabs: React.FC<TabsComponentProps> = ({
  defaultActiveKey = "1",
  items,
  onChange,
}) => {
  const tabItems: TabsProps["items"] = items.map((item) => ({
    key: item.key,
    label: item.label,
    children: item.content,
  }));

  return (
    <Tabs
      defaultActiveKey={defaultActiveKey}
      items={tabItems}
      onChange={onChange}
    />
  );
};

export default CTabs;
