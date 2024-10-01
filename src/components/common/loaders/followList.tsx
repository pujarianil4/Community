import React from "react";

interface IProps {
  items?: number;
}
export default function FollowListLoader({ items = 7 }: IProps) {
  return (
    <>
      {Array(items)
        .fill(() => 0)
        .map((_: any, i: number) => (
          <div className='follower_List_Loader' key={i}>
            <div className='skeleton img'></div>
            <div className='skeleton name'></div>
            <div className='skeleton username'></div>
          </div>
        ))}
    </>
  );
}
