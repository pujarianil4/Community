"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./index.scss";
import CTabs from "../common/Tabs";
import Posts from "./posts";
import Communities from "./communitiesList";
import User from "./userList";
import SearchComments from "./comments";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

interface IProps {
  params?: any;
  isComment?: boolean;
}

export default function SearchPageComponent({ isComment = true }: IProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const tabsList = useMemo(() => {
    const baseTabs = [
      {
        key: "1",
        label: "Posts",
        content: <Posts />,
      },
      // {
      //   key: "2",
      //   label: "Communities",
      //   // content: <Communities communitiesData={searchData?.communities} />,
      //   content: <Communities />,
      // },
    ];

    if (isComment) {
      baseTabs.push({
        key: "2",
        label: "Communities",
        // content: <Communities communitiesData={searchData?.communities} />,
        content: <Communities />,
      });
      baseTabs.push({
        key: "3",
        label: "Comments",
        // content: <SearchComments commentsData={searchData?.comments} />,
        content: <SearchComments />,
      });
      baseTabs.push({
        key: "4",
        label: "User",
        // content: <User usersData={searchData?.users} />,
        content: <User />,
      });
    }

    return baseTabs;
  }, [isComment]);

  const labelToKeyMap = Object.fromEntries(
    tabsList.map((tab) => [tab.label.toLocaleLowerCase(), tab.key])
  );
  const initialLabel = searchParams.get("type")?.toLocaleLowerCase() || "posts";
  const [activeType, setActiveType] = useState(
    labelToKeyMap[initialLabel] || "1"
  );

  useEffect(() => {
    const currentLabel = searchParams.get("type")?.toLocaleLowerCase();
    if (currentLabel && labelToKeyMap[currentLabel]) {
      setActiveType(labelToKeyMap[currentLabel]);
    } else {
      // Handle default behavior when type parameter is missing or invalid
      const currentQParam = searchParams.get("q") || "";
      router.replace(
        `${pathname}?q=${encodeURIComponent(currentQParam)}&type=posts`
      );
    }
  }, [searchParams, pathname, router, labelToKeyMap]);

  const handleTabChange = useCallback(
    (key: string) => {
      const selectedLabel = tabsList
        .find((tab) => tab.key === key)
        ?.label.toLocaleLowerCase();
      setActiveType(key);
      if (selectedLabel) {
        const currentQParam = searchParams.get("q") || "";
        router.push(
          `${pathname}?q=${encodeURIComponent(
            currentQParam
          )}&type=${encodeURIComponent(selectedLabel)}`
        );
      }
    },
    [pathname, router, searchParams, tabsList]
  );

  return (
    <main className='search_page_container'>
      <CTabs
        activeKey={activeType}
        defaultActiveKey='1'
        items={tabsList}
        onChange={handleTabChange}
      />
    </main>
  );
}
