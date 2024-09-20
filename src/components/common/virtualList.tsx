import React from "react";
import { Virtuoso } from "react-virtuoso";

interface IProps {
  listData: any[];
  isLoading: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  renderComponent: any;
  customScrollSelector?: string;
  totalCount?: number;
}
export default function VirtualList({
  listData,
  isLoading,
  page,
  setPage,
  limit,
  renderComponent,
  customScrollSelector = "main_panel_container",
}: IProps) {
  return (
    <Virtuoso
      data={listData}
      // totalCount={200} // add this if we know total count of listData and remove below condition
      endReached={() => {
        if (
          !isLoading &&
          listData.length % limit === 0 &&
          listData.length / limit === page
        ) {
          setPage((prevPage) => prevPage + 1);
        }
      }}
      itemContent={renderComponent}
      className='virtuoso'
      style={{ overflow: "hidden" }}
      customScrollParent={
        document.querySelector(`.${customScrollSelector}`) as HTMLElement
      }
    />
  );
}
