// "use client";
// import React from "react";
// import { Virtuoso } from "react-virtuoso";

// interface IProps {
//   listData: any[];
//   isLoading: boolean;
//   page: number;
//   setPage: React.Dispatch<React.SetStateAction<number>>;
//   limit: number;
//   renderComponent: any;
//   customScrollSelector?: string;
//   totalCount?: number;
//   footerHeight?: number;
// }
// export default function VirtualList({
//   listData,
//   isLoading,
//   page,
//   setPage,
//   limit,
//   renderComponent,
//   customScrollSelector = "main_panel_container",
//   footerHeight = 50,
// }: IProps) {
//   return (
//     <Virtuoso
//       data={listData}
//       // totalCount={200} // add this if we know total count of listData and remove below condition
//       endReached={() => {
//         if (
//           !isLoading &&
//           listData.length % limit === 0 &&
//           listData.length / limit === page
//         ) {
//           setPage((prevPage) => prevPage + 1);
//         }
//       }}
//       itemContent={renderComponent}
//       className='virtuoso'
//       style={{ overflow: "hidden" }}
//       customScrollParent={
//         document.querySelector(`.${customScrollSelector}`) as HTMLElement
//       }
//       components={{
//         Footer: () => <div style={{ height: `${footerHeight}px` }}></div>,
//       }}
//       // followOutput={true}
//     />
//   );
// }

"use client";
import React from "react";
import { Virtuoso, VirtuosoGrid } from "react-virtuoso";

interface IProps {
  listData: any[];
  isLoading: boolean;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  limit: number;
  renderComponent: any;
  isGrid?: boolean;
  itemWidth?: number;
  customScrollSelector?: string;
  footerHeight?: number;
}

export default function VirtualizedContainer({
  listData,
  isLoading,
  page,
  setPage,
  limit,
  renderComponent,
  isGrid = false,
  itemWidth = 200,
  customScrollSelector = "main_panel_container",
  footerHeight = 50,
}: IProps) {
  const commonProps = {
    data: listData,
    endReached: () => {
      if (
        !isLoading &&
        listData.length % limit === 0 &&
        listData.length / limit === page
      ) {
        setPage((prevPage) => prevPage + 1);
      }
    },
    itemContent: renderComponent,
    style: { overflow: "hidden" },
    customScrollParent: document.querySelector(
      `.${customScrollSelector}`
    ) as HTMLElement,
    components: {
      Footer: () => <div style={{ height: `${footerHeight}px` }}></div>,
    },
  };

  return isGrid ? (
    <VirtuosoGrid
      {...commonProps}
      components={{
        List: React.forwardRef(({ style, children }, ref) => (
          <div
            ref={ref}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(auto-fill, minmax(${itemWidth}px, 1fr))`,
              gap: "16px",
              ...style,
            }}
            className='virtuoso_grid_list'
          >
            {children}
          </div>
        )),
        ...commonProps.components,
      }}
    />
  ) : (
    <Virtuoso {...commonProps} className='virtuoso' />
  );
}
